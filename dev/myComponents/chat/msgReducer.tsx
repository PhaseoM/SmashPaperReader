import React, { useState, useContext, ReducerAction } from 'react';
import * as ReactDOM from 'react-dom';
import { msgList, msgAction, msgact, spid } from '../../types/msgchat';
import { v4 as uuidv4 } from 'uuid';


export default function msgReducer(msglist: msgList, action: msgAction): msgList {
    let oldstate = [...msglist];
    switch (action.type) {
        case msgact.USER_SEND: {
            // console.log(`
            //             type: ${msgact.USER_SEND},
            //             id: ${action.id},
            //             select: ${action.select},
            //             send: ${action.send}`);
            oldstate.push({
                id: action.id,
                msgid: action.msgid,
                select: action.select,
                context: action.send,
                isloading: false
            });
            return oldstate;
        }
        case msgact.ADD_LOADING: {
            oldstate.push({
                id: action.id,
                msgid: action.msgid,
                select: action.select,
                context: action.send,
                isloading: true
            });
            return oldstate;
        }
        case msgact.DELETE: {
            return oldstate.filter((msg) => msg.msgid != action.msgid)
        }
        case msgact.AI_SEND_NORMAL: {
            oldstate.forEach((msg) => {
                if (msg.msgid === action.msgid) {
                    msg.context = action.send;
                    msg.isloading = false;
                }
            });

            return oldstate;

        }
        default: {
            oldstate.push({
                id: spid.msgerror,
                msgid: action.msgid,
                select: action.select,
                context: action.send,
                isloading: false
            });
            return oldstate;
        }
    }
}

