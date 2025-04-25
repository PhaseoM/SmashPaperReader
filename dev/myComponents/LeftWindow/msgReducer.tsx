import React, { useState, useContext, ReducerAction } from 'react';
import * as ReactDOM from 'react-dom';
import { msgList, msgAction, msgact, spid } from '../../types/msgchat';
import { v4 as uuidv4 } from 'uuid';
import { state_Receive } from './msg_module';
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
            return oldstate.filter((msg) => msg.msgid != action.msgid)
        }
        case msgact.AI_SEND_NORMAL: {
            oldstate.forEach((msg) => {
                if (msg.msgid === "42") {
                    msg.context = action.context;
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