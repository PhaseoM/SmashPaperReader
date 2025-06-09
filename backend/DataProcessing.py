from copy import deepcopy
from typing import List, Union

import numpy as np
import requests
from flask import Flask, render_template, jsonify, send_file
from flask_socketio import SocketIO, emit
import random
import time
from threading import Thread
import json

from uuid import uuid4
from tqdm import tqdm

from PaperProcessing_meta import metaPaper, myBox
from papermage import Box

page_width = 816
page_height = 1056


def unite_box(boxes: list[Box]) -> Box:
    boxmin = np.min(boxes, axis=1)
    boxmax = np.max(boxes, axis=1)
    if boxmin.page != boxmax.page:
        raise Exception("Try to Unite boxes.page Error")
    return Box(boxmin[0], boxmin[1], boxmax[2], boxmax[3], boxmin.page)


def box_trans_to_my(box: Box) -> myBox:
    return myBox(page=box.page, left=box.l * page_width, top=box.t * page_height, width=box.w * page_width,
                 height=box.h * page_height)


def box_trans_to_json(box: Box) -> List[Union[float, int]]:
    return box_trans_to_my(box).to_json()


def boxes_trans_to_my(boxes: list[Box]):
    # retBoxes = []
    # for box in boxes:
    #     retBoxes.append(box_trans_to_my(box))
    return [myBox(page=box.page, left=box.l * page_width, top=box.t * page_height, width=box.w * page_width,
                  height=box.h * page_height)
            for box in boxes]


def boxes_trans_to_json(boxes: list[Box]):
    retBoxes = []
    for box in boxes:
        retBoxes.append(box_trans_to_json(box))
    return boxes


def load_doc_from_url(mDoc: metaPaper, url):
    filename = url.split('/')[-1]
    mDoc.filename = filename
    pdf_path = "./TempPdf/" + filename + ".pdf"
    json_path = "./DocumentModels/" + filename + ".json"
    result = True
    if not mDoc.load_doc(json_path):
        if not mDoc.process_pdf(pdf_path):
            response = requests.get(url)
            if response.status_code == 200:
                with open(pdf_path, 'wb') as f:
                    f.write(response.content)
                result = mDoc.process_pdf(pdf_path)
            else:
                result = False
        mDoc.store_doc(json_path)
    return result

def load_doc_from_filename(mDoc: metaPaper, filename):
    pdf_path = "./TempPdf/" + filename + ".pdf"
    json_path = "./DocumentModels/" + filename + ".json"
    result = True
    if not mDoc.load_doc(json_path):
        if not mDoc.process_pdf(pdf_path):
            result = False
        mDoc.store_doc(json_path)
    return result


def get_doc_sentences(mDoc: metaPaper):
    sentences = []
    for k, paragraph in enumerate(mDoc.doc.paragraphs):
        for sent in paragraph.sentences:
            if len(sent.text) < 10: continue
            tokens_filter_0 = [{"text": token.text, "boxes": boxes_trans_to_my(token.boxes)} for token in sent.tokens]
            rows_dict = {}
            for item in tokens_filter_0:
                text = item['text']
                box = item['boxes'][0]
                if 11.5 < box.height < 12.5:
                    if rows_dict.get(box.top) is None:
                        rows_dict[box.top] = {
                            'text': text,
                            'box': {
                                'page': box.page,
                                'left': box.left,
                                'top': box.top,
                                'width': box.width,
                                'height': box.height,
                            }
                        }
                    else:
                        tmp = rows_dict[box.top]
                        rows_dict[box.top] = {
                            'text': tmp['text'] + " " + text,
                            'box': {
                                'page': box.page,
                                'left': min(tmp['box']['left'], box.left),
                                'top': box.top,
                                'width': box.left + box.width - min(tmp['box']['left'], box.left),
                                'height': box.height,
                            }
                        }
            if len(rows_dict) != 0:
                rows = []
                for key, value in rows_dict.items():
                    rows.append({'text': value['text'], 'box': value['box']})
                sentences.append({'text': sent.text, 'rows': rows, })
    return sentences


def get_doc_sent3_from_sents(sentences):
    sentences_3 = []
    for i in range(0, len(sentences) - 3):
        sent_3 = {'text': "", 'rows': []}
        for j in range(i, i + 3):
            last_rows = sent_3['rows']
            cur_fir_rows = sentences[j]['rows']
            if len(last_rows) != 0 and last_rows[-1]['box']['left'] != cur_fir_rows[0]['box']['left']:
                last_rows[-1]['box']['width'] = cur_fir_rows[0]['box']['left'] + cur_fir_rows[0]['box'][
                    'width'] - last_rows[-1]['box']['left']
                sent_3['text'] += " " + sentences[j]['text']
                sent_3['rows'].extend(sentences[j]['rows'][1:])
            else:
                sent_3['text'] += " " + sentences[j]['text']
                sent_3['rows'].extend(sentences[j]['rows'])
        sentences_3.append(sent_3)

    return sentences_3


def trans_sent3_to_db(sentences_3):
    content = []
    boxes = []
    for sent3 in sentences_3:
        unite_boxes = [deepcopy(sent3['rows'][0]['box'])]
        box_list = []
        for row in sent3['rows']:
            box = deepcopy(row['box'])
            box_list.append(box)
            if unite_boxes[-1]['page'] == box['page']:
                unite_boxes[-1]['top'] = min(unite_boxes[-1]['top'], box['top'])
                unite_boxes[-1]['left'] = min(unite_boxes[-1]['left'], box['left'])
                unite_boxes[-1]['width'] = max(box['width'], unite_boxes[-1]['width'])
                unite_boxes[-1]['height'] = box['top'] + box['height'] - unite_boxes[-1]['top']
            else:
                unite_boxes.append(deepcopy(box))
        content.append(sent3['text'])
        boxes.append({
            "UniteBoxes": unite_boxes,
            "BoxList": box_list,
        })
    ret = {
        "content": content,
        "boxes": boxes
    }
    return ret


def get_sent3(mDoc: metaPaper):
    sentences = get_doc_sentences(mDoc)
    sent_3 = get_doc_sent3_from_sents(sentences)
    ret = trans_sent3_to_db(sent_3)
    return ret


def get_title(mDoc: metaPaper):
    return {
        "content": mDoc.doc.titles.text,
        "box": boxes_trans_to_my(mDoc.doc.titles.boxes)
    }


def chunk_to_socket_ret(search_res):
    system_color = 'blue'
    socket_data_ret = [{
        'type': 'addbox',
        'bbid': str(uuid4()),
        'color': system_color,
        'content': chunk['entity']['chunk_content'],
        'UniteBox': chunk['entity']['chunk_box']['UniteBoxes'][0],
        'BoxList': chunk['entity']['chunk_box']['BoxList']
    } for chunk in search_res[0]]
    print(f'{"chunk_box_info":-^30}')
    for item in search_res[0]:
        print(item)
    print(f'{"":-^30}')
    return socket_data_ret


def chunk_to_prompt_context(search_res):
    prompt_context = '\n'.join(
        [chunk['entity']['chunk_content'] for chunk in search_res[0]]
    )
    return prompt_context


def hint_box_to_HintList(hint_box):
    ret = [{
        'bbid': hint['bbid'],
        'hint': hint['content'],
    } for hint in hint_box]
    return ret


def get_related_paper_top3():
    ret = [
        {
            "title": "The Semantic Reader Project: Augmenting Scholarly Documents through AI-Powered Interactive Reading Interfaces",
            "doc_id": 111
        },
        {
            "title": "PaperWeaver: Enriching Topical Paper Alerts by Contextualizing Recommended Papers with User-collected Papers",
            "doc_id": 222
        },
        {
            "title": "Paper Plain: Making Medical Research Papers Approachable to Healthcare Consumers with Natural Language Processing",
            "doc_id": 333
        }
    ]
    return ret


if __name__ == "__main__":
    filename = '2310.07581'
    mDoc = metaPaper(filename)
    print(load_doc_from_filename(mDoc, filename))
    # print(mDoc.doc.titles)
    # print(mDoc.doc.abstracts)
    sent3 = get_sent3(mDoc)
