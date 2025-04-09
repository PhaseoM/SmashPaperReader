import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BoundingBoxText as BoxProps, HLaction, hltype } from "../types/hightlight";

const URL = 'http://localhost:5001';

export const socket = io(URL);


type DownloadpdfProps = {
    url: string,
}

export const HighlightEventListener = (dispatch: React.Dispatch<HLaction>) => {
    // const [hlGet, setHlGet] = useState(false);
    useEffect(() => {

        const ReceiveHLMsg_ADD = (event: { data: HLaction }) => {
            const action = event.data;
            console.log(typeof (action));
            console.log("------------------------------------");
            console.log(action);
            console.log("------------------------------------");
            dispatch({
                type: hltype.ADD,
                id: 0,
                color: action.color,
                content: "",
                BoxList: action.BoxList
            });
        }

        const fun1 = (event: { data: any }) => {
            const Data = event.data;
            for (let i = 0; i < Data.length; i++) {
                dispatch({
                    type: hltype.ADD,
                    id: 0,
                    content: "",
                    color: 'yellow',
                    BoxList: Data[i].BoxList
                });
            }
        }
        console.log("addddddd")
        socket.on('Highlight_Added', ReceiveHLMsg_ADD);
        socket.on('Header_Highlight_Added', fun1);
        return () => {
            console.log("removeeeeee")
            socket.off('Highlight_Added', ReceiveHLMsg_ADD);
        }
    }, [])
}