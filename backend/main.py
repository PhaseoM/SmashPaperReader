import requests
from flask import Flask, render_template, jsonify, send_file
from flask_socketio import SocketIO, emit
import random
import time
from threading import Thread
import json
import uuid
from DataProcessing import *
from MilvusVectorDB import MilvusVectorDB
from papermage import Box

from PaperProcessing_meta import metaPaper, msg_action, highlight_action
from exts import db
import config
from DB_Models import *
from LLM_API.ollama_test import gpt_model

severid = "1919810"
collection_name = "rag_collection_test_002"
mDoc: metaPaper = metaPaper()
# mVDB: MilvusVectorDB = MilvusVectorDB()
paperPDFPath = None
app = Flask(__name__)
app.debug = True
app.config.from_object(config)
db.init_app(app)
socketio = SocketIO(
    app,
    cors_allowed_origins='*'
)
gpt = gpt_model()


@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('server_response', {'data': 'Connected to server!'})


@socketio.on('disconnect')
def handle_disconnect():
    # emit('RelatedPaperUpadate', {'data': get_related_paper_top3()})
    # print(get_related_paper_top3())
    print('Client disconnected')


@socketio.on('loadpdf')
def load_pdf(data):
    global mDoc
    print(data)
    type = data['type']
    if type == 0:
        url = data['data']
        mVDB: MilvusVectorDB = MilvusVectorDB()
        if load_doc_from_url(mDoc, url):
            # mVDB.insert_document(mDoc, collection_name=collection_name)
            emit('pdfloaded', {'pdf_state': f"successful! request_url:{url} doc_id:{mDoc.doc_id}"})
            emit('RelatedPaperUpadate', {'data': get_related_paper_top3()})
        else:
            emit('pdfloaded', {'pdf_state': 'type=0-Error:File could not be downloaded.'})
    elif type == 1:
        file = data['data']
        filename = file['filename']
        pdfdata = file['file']
        file.save('\TempPdf'+filename, pdfdata)
        if load_doc_from_filename(mDoc, filename):
            emit('pdfloaded', {'pdf_state': f"successful! request_filename:{filename} doc_id:{mDoc.doc_id}"})
            emit('RelatedPaperUpadate', {'data': get_related_paper_top3()})
        else:
            emit('pdfloaded', {'pdf_state': 'type=1-Error:File load error.'})
    else:
        emit('pdfloaded', {'pdf_state': 'notype-Error:unknown error.'})


def send_message(type, msgid, select, context, HintList):
    retdata = {
        'type': type,
        'id': severid,
        'msgid': msgid,
        'select': select,
        'context': context,
        'loading_id': msgid,
        'HintList': HintList,
    }

    emit('Messagehandled', {'data': retdata}, broadcast=False)


@socketio.on('handleMessage')
def handle_message(msg):
    mVDB: MilvusVectorDB = MilvusVectorDB()
    print('Received message:', msg)
    msg = json.loads(msg)
    msgid = msg['loading_id']
    context = ""
    question = msg['context']
    search_res = ""
    if len(msg['select']) != 0:
        context = msg['select']
        search_res = mVDB.search(queries=[question], collection_name=collection_name)
    else:
        search_res = mVDB.search(queries=[question], collection_name=collection_name)
    context += '\n' + chunk_to_prompt_context(search_res)
    hint_box = chunk_to_socket_ret(search_res)
    HintList = hint_box_to_HintList(hint_box)
    gpt.send_msg(func_call=send_message, msgid=msgid, question=question, context=context)
    send_message(type='ai_send_stream', msgid=msgid, select=None, context="", HintList=HintList)
    emit('Hinthandled', {'data': hint_box}, broadcast=False)


@socketio.on('handleHint')
def handle_Hint(msg):
    global mDoc
    print('Received message:', msg)
    retcontent = (
        "To explore this question, we present the Semantic Reader Project, a broad collaborative effort across multiple non-profit, industry, and academic institutions to create interactive, intelligent reading interfaces for research papers.")
    # retboxes = mDoc.get_section_box()
    # testbox = Box(100, 100, 100, 100, 0)
    retdata = {
        'type': "addbox",
        'id': 0,
        'color': "yellow",
        'content': retcontent,
        # 'UniteBox': box_trans_to_json(testbox),
        # 'BoxList': boxes_trans_to_json([testbox]),
        # 'UniteBox': testUniBox,
        # 'BoxList': textboxs

    }
    print(retdata)
    emit('Hinthandled', {'data': retdata}, broadcast=False)


@socketio.on('handleRP')
def handle_Hint(msg):
    print(msg)
    msgid = msg['loading_id']
    emit('RelatedPaperUpdate', {'data': get_related_paper_top3()}, broadcast=False)


@socketio.on('handleCompare')
def handle_compare(msg):
    msg = json.loads(msg)
    print(msg)
    gpt.send_compare_paperAB(func_call=send_message, msgid=msg['loading_id'])


if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=27302, allow_unsafe_werkzeug=True)
