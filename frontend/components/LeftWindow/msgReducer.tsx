import React, { useState, useContext, ReducerAction } from 'react';
import * as ReactDOM from 'react-dom';
import { msgList, msgAction, msgact, spid } from '../../types/msgchat';
import { v4 as uuidv4 } from 'uuid';
import { state_Err, state_Receive, state_Send, state_Ser_Loading } from './msg_module';
export const msginitiallist: msgList = [
    {
        ...state_Receive,
        context: "Hello, welcome to use PaperCopilot",
        // HintList: [
        //     { hint: "A->aaa" },
        //     { hint: "B->bbbbbbbbb" },
        //     { hint: "C->ccccccccccccccccccccc" }
        // ],
    },
//     {
//         ...state_Send,
//         select: `Scholarly publications are key to the transfer of knowledge from
// scholars to others. However, research papers are information-dense,
// and as the volume of the scientific literature grows, the need for new
// technology to support the reading process grows. In contrast to the
// process of finding papers, which has been transformed by Internet
// technology, the experience of reading research papers has changed
// little in decades. The PDF`,
//         context: `es. This paper explores the question“Can recent advances in AI and HCI power intelligent, interactive,and accessible reading interfaces—even for legacy PDFs?” We de-scribe the Semantic Reader Project, a collaborative effort acrossmultiple institutions to explore automatic creation of dynamic read-ing interfaces for research papers. T`,
//     },
//     {
//         ...state_Receive,
//         select: `To explore this question, we present the Semantic Reader
// Project, a broad collaborative effort across multiple non-profit,
// industry, and academic institutions to create interactive, intelligent
// reading interfaces for research papers. This project consists of three
// pillars: research, product, and open science resources. On the re-
// search front, the Sema`,
//         context: "LLM return Answer",
//         HintList: [
//             { bbid: "1", hint: "ref 1:related content...something..for.maybeneveror" },
//         ],
//     },
//     {
//         ...state_Ser_Loading,
//     },
//     {
//         ...state_Err,
//     },
]

export default function msgReducer(msglist: msgList, action: msgAction): msgList {
    let oldstate = [...msglist];
    switch (action.type) {
        case msgact.USER_SEND: {
            oldstate.push({
                id: action.id,
                msgid: action.msgid,
                select: action.select,
                context: action.context,
                isloading: false,
                HintList: action.HintList,
            });
            return oldstate;
        }
        case msgact.ADD_LOADING: {
            oldstate.push({
                id: action.id,
                msgid: action.msgid,
                select: action.select,
                context: action.context,
                isloading: true,
                HintList: action.HintList,
            });
            return oldstate;
        }
        case msgact.DELETE: {
            return oldstate.filter((msg) =>
                msg.msgid != action.msgid)
        }
        case msgact.AI_SEND_NORMAL: {
            oldstate.forEach((msg) => {
                if (msg.msgid === action.loading_id) {
                    msg.select = action.select;
                    msg.context = action.context;
                    msg.isloading = false;
                    msg.HintList = action.HintList;
                }
            });
            return oldstate;
        }
        case msgact.AI_SEND_STREAM: {
            oldstate.forEach((msg) => {
                if (msg.msgid === action.loading_id) {
                    if (action.select)
                        msg.select += action.select;
                    msg.context += action.context;
                    msg.isloading = false;
                    msg.HintList = action.HintList;
                }
            });
            return oldstate;
        }
        default: {
            oldstate.push({
                id: spid.msgerror,
                msgid: action.msgid,
                select: action.select,
                context: action.context,
                isloading: false,
                HintList: [],
            });
            return oldstate;
        }
    }
}