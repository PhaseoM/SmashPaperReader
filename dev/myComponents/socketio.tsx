import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BoundingBoxText as BoxProps, HLaction, hltype } from "../types/hightlight";
import { msgact, msgAction, msgHint, msgState, spid } from "../types/msgchat";

const URL = 'http://localhost:27302';
const usrid = "130";

export const socketIO = io(URL);

type LoadPDFProps = {
    url: string,
}

//URL_Load
export function loadPDF_send(loadpdf: LoadPDFProps) {
    socketIO.emit('loadpdf', loadpdf);
}

//PaperCopilot_Op
export function msg_Debug(msgAct: msgAction) {
    console.log(`
        type: ${msgact.USER_SEND},
        id: ${usrid},
        msgid: ${msgAct.msgid},
        select: ${msgAct.select},
        send: ${msgAct.context}`
    );
}

export const msg_Emit = (message: msgAction) => {
    const msgjson = JSON.stringify(message);
    socketIO.emit("handleMessage", msgjson);
}

export function msg_onReceive(
    handleMegGet: (msg: msgAction) => void,
) {
    useEffect(() => {
        const onMsgGet = (event: { data: any; }) => {
            const response = event.data;
            const MsgAct: msgAction = {
                type: msgact.AI_SEND_NORMAL,
                id: spid.serverid,
                msgid: response.msgid,
                context: response.context,
                select: response.select,
                HintList: response.HintList,
            }
            handleMegGet(MsgAct);
        }
        socketIO.on('Messagehandled', onMsgGet);
        return () => {
            socketIO.off('Messagehandled', onMsgGet);
        }
    }, []);
}

//HintOp
export const hint_Emit = (hint_e: msgHint) => {
    const hintjson = JSON.stringify(hint_e);
    socketIO.emit("handleHint", hintjson);
}
export function hint_onReceive(
    handleHintGet: (hint_r: HLaction) => void,
) {
    useEffect(() => {
        const onMsgGet = (event: { data: any; }) => {
            const response = event.data;
            const HintAct: HLaction = {
                type: response.type,
                id: response.id,
                color: response.color,
                content: response.content,
                UniteBox: response.UniteBox,
                BoxList: response.BoxList,
            }
            handleHintGet(HintAct);
        }
        socketIO.on('Hinthandled', onMsgGet);
        return () => {
            socketIO.off('Hinthandled', onMsgGet);
        }
    }, []);
}