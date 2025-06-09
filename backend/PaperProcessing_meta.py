import json
import os
import uuid
from operator import truediv
from typing import Union, List

import numpy as np
from papermage import Box, Document

from papermage.recipes import CoreRecipe

severid = "1919810"


class myBox:
    def __init__(self, page: int, left: float, top: float, width: float, height: float):
        self.page = page
        self.left = left
        self.top = top
        self.width = width
        self.height = height

    def to_json(self):
        return {'page': self.page,
                'left': self.left,
                'top': self.top,
                'width': self.width,
                'height': self.height}

    def __repr__(self):
        return f"{self.to_json()}"


class msg_action:
    def __init__(
            self,
            type="ai_send_normal",
            id=severid,
            msgid="-42",
            select=None,
            context="",
    ):
        self.type = type
        self.id = id
        self.msgid = msgid
        if (msgid == "-42"):
            self.msgid = uuid.uuid4()
        self.select = select
        self.context = context


class highlight_action:
    def __init__(
            self,
            type="ADD", id=0, color="yellow",
            content: str = "",
            UniteBox: Box = {0, 0, 0, 0, 0},
            BoxList=[],
    ):
        self.type = type
        self.id = id
        self.color = color
        self.content = content
        self.UniteBox = UniteBox
        self.BoxList = BoxList

    def unite_selfbox(self) -> Box:
        boxes = self.BoxList
        boxmin = np.min(boxes, axis=1)
        boxmax = np.max(boxes, axis=1)
        if boxmin.page != boxmax.page:
            raise Exception("Try to Unite boxes.page Error")
        return Box(boxmin[0], boxmin[1], boxmax[2], boxmax[3], boxmin.page)


class metaPaper():
    def __init__(self, filename=None, width=816, height=1056, doc_id="0000-0001"):
        self.doc: Document = None
        self._filename = filename
        self.width = width
        self.height = height
        self._doc_id = doc_id

    @property
    def filename(self):
        return self._filename

    @filename.setter
    def filename(self, value):
        self._filename = value

    @property
    def doc_id(self):
        return self._doc_id

    @doc_id.setter
    def doc_id(self, value):
        self._doc_id = value

    def get_sections(self):
        for s in self.doc.sections:
            print(s)

    def get_sentences(self):
        with open("./paper.txt", "w") as f:
            # for s in self.doc.sentences:
            #     f.write(s.text)
            for i in range(0, 5):
                for sent in self.doc.paragraphs[i].sentences:
                    # print([{"text": token.text, "boxes": token.boxes} for token in sent.tokens])
                    f.write(sent.text + '\n')
                    f.write(str(sent.spans) + '\n')
                    f.write(str(sent.boxes) + '\n' + '\n')
                    f.write(str([token.boxes for token in sent.tokens]) + '\n' + '\n')
                    # for token in sent.tokens:

    # f.write(self.doc.paragraphs[i].text + '\n')
    # f.writelines(str(self.doc.paragraphs[i].spans) + '\n')
    # f.writelines(str(self.doc.paragraphs[i].boxes) + '\n' + '\n')

    def get_section_box(self):
        boxes = []
        for s in self.doc.sections:
            boxes.append(s.boxes)
        return boxes

    def load_doc(self, filepath):
        if (os.path.isfile(filepath)):
            with open(filepath) as f_in:
                doc_dict = json.load(f_in)
                self.doc = Document.from_json(doc_dict)
            print("PDF Loaded by local_json")
            return True
        else:
            return False

    def store_doc(self, filepath):
        with open(filepath, 'w') as f_out:
            json.dump(self.doc.to_json(), f_out, indent=4)
        print("PDF stored")

    def process_pdf(self, filepath):
        if (os.path.isfile(filepath)):
            recipe = CoreRecipe()
            self.doc = recipe.run(filepath)
            print("PDF process by local_pdf")
            return True
        else:
            return False


# def SendHighLight_ADD(self):
#     sendData = {
#         'type': 'addbox',
#         'id': 0,
#         'page': 0,
#         'top': 100,
#         'left': 100,
#         'width': 100,
#         'height': 100,
#         'color': 'red',
#     }
#     return sendData


def load_test(mDoc, fileName):
    pdf_path = "./TempPdf/" + fileName
    json_path = "./DocumentModels/" + fileName[:-4] + ".json"
    result = True
    if not mDoc.load_doc(json_path):
        if not mDoc.process_pdf(pdf_path):
            result = False
        mDoc.store_doc(json_path)
    return result


if __name__ == "__main__":
    fileName = '2310.07581.pdf'
    mDoc = metaPaper(fileName)
    print(load_test(mDoc, fileName))
    mDoc.get_sentences()
    # with open('./DocumentModels/2310.07581.json', 'w') as f_out:
    #     json.dump(mDoc.doc.to_json(), f_out, indent=4)
    #
    # with open('filename.json') as f_in:
    #     doc_dict = json.load(f_in)
    #     doc = Document.from_json(doc_dict)
