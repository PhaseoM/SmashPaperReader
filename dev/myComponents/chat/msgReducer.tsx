import React, { useState, useContext, ReducerAction } from 'react';
import * as ReactDOM from 'react-dom';
import { msgList, msgAction, msgact, spid } from '../../types/msgchat';
import { v4 as uuidv4 } from 'uuid';


export default function msgReducer(msglist: msgList, action: msgAction): msgList {
    switch (action.type) {
        case msgact.USER_SEND: {
            // console.log(`
            //             type: ${msgact.USER_SEND},
            //             id: ${action.id},
            //             select: ${action.select},
            //             send: ${action.send}`);
            return [
                ...msglist,
                {
                    id: action.id,
                    msgid: uuidv4(),
                    select: action.select,
                    context: action.send,
                    isloading: false
                }
            ]
        }
        case msgact.ADD_LOADING: {
            return [
                ...msglist,
                {
                    id: action.id,
                    msgid: action.msgid,
                    select: action.select,
                    context: action.send,
                    isloading: true
                }
            ]
        }
        case msgact.DEL_LOADING: {
            return msglist.filter((msg) => {
                msg.isloading === true
            })
        }
        case msgact.AI_SEND_NORMAL: {
            return [
                ...msglist,
                {
                    id: action.id,
                    msgid: action.msgid,
                    select: action.select,
                    context: action.send,
                    isloading: false
                }
            ]
        }
        default: {
            return [
                ...msglist,
                {
                    id: spid.msgerror,
                    msgid: action.msgid,
                    select: action.select,
                    context: action.send,
                    isloading: false
                }
            ]
        }
    }
}

