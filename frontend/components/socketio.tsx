import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BoundingBoxText as BoxProps, HLaction, hltype } from "../types/hightlight";
import { msgact, msgAction, msgHint, msgState, spid } from "../types/msgchat";
import { relatedPaperState } from "./LeftWindow/RelatedPaperList";

const URL = 'http://localhost:27302';
const usrid = "130";

export const socketIO = io(URL);

type fileProps = {
    filename: string,
    file: File,
}


type LoadPDFProps = {
    type: number,
    data: string | fileProps,
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
    console.log(message)
    socketIO.emit("handleMessage", msgjson);
}

export function msg_onReceive(
    handleMegGet: (msg: msgAction) => void,
) {
    useEffect(() => {
        const onMsgGet = (event: { data: any; }) => {
            const response = event.data;
            const MsgAct: msgAction = {
                type: response.type,
                id: response.id,
                msgid: response.msgid,
                context: response.context,
                select: response.select,
                loading_id: response.loading_id,
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
        const onMsgGet = (event: { data: HLaction[]; }) => {
            const Data = event.data;
            Data.forEach(item => {
                const HintAct: HLaction = {
                    type: item.type,
                    bbid: item.bbid,
                    color: item.color,
                    content: item.content,
                    UniteBox: item.UniteBox,
                    BoxList: item.BoxList,
                }
                handleHintGet(HintAct);
            })
        }
        socketIO.on('Hinthandled', onMsgGet);
        return () => {
            socketIO.off('Hinthandled', onMsgGet);
        }
    }, []);
}


//RelatedPaperUpadate
export function rpu_onReceive(
    setRPlist: (rps: relatedPaperState[]) => void,
) {
    useEffect(() => {
        const onMsgGet = (event: { data: relatedPaperState[]; }) => {
            setRPlist(event.data);
        }
        socketIO.on('RelatedPaperUpdate', onMsgGet);
        return () => {
            socketIO.off('RelatedPaperUpdate', onMsgGet);
        }
    }, []);
}


export const msg_Emit_Compare = (message: msgAction) => {
    const msgjson = JSON.stringify(message);
    socketIO.emit("handleCompare", msgjson);
}