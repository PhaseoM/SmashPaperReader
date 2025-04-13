import React, { useState, useContext, useReducer, useRef, useEffect, createContext, MutableRefObject } from 'react';
import * as ReactDOM from 'react-dom';
import msgReducer from './msgReducer'
import { msgList, msgAction, msgact, spid, msgState } from '../../types/msgchat';
import { v4 as uuidv4 } from 'uuid';
import { Text, Container, Loader, ScrollArea, Paper, Skeleton, Alert, List, Textarea, TypographyStylesProvider, Box, Button, ActionIcon, Divider, Center } from '@mantine/core';
import { msg_Usr, msg_Ser, msg_Err, msg_Ser_Loading } from './msg_module'
import { IconAlertCircle, IconAperture, IconCircleArrowUp, IconCircleArrowUpFilled } from '@tabler/icons-react';
import useWindowSize from '../../utils/useWindowSize';
import { Input } from 'antd';
import { NavItemContext } from '../../context/NavContext';
import { getActualWidthOfChars as getContextLen, opArgs } from '../../utils/useGetTextLength';
import io from 'socket.io-client';
import { socket } from '../socketio'
import { ToolPopContext } from '../../context/PopoverConext';
import { scrollToBbox } from '../Highlight/HighlightRender';
import { HLContext } from '../../context/HLContext';
import { useWindowScroll } from '@mantine/hooks';
import { winSizeContext } from '../../context/winSizeContext';
import { RefContext } from '../../context/RefContext';
const usrid = "130";

const msginitiallist: msgList = [
    {
        ...msg_Ser(),
        context: "HelloReader!"
    },
    {
        ...msg_Usr(),
        context: "How can I implement the RBT?"
    },
    {
        ...msg_Ser(),
        context: "Sorry,I cant:<\nsadddddddda\naddddsdadsdaddasdadsdasdsadadasdsdadasdasdasdasasdadsassdd\nddddadsssdasdasdasdasdasddsdasdasdasdasddassdasdasdsadasdasdasdasd"
    },
    {
        ...msg_Usr(),
        select: `Scholarly publications are key to the transfer of knowledge from scholars to others.However, research papers are information- dense, and as the volume of the scientific literature grows, the need for new technology to support the reading process grows. `,
        context: "No,u can",
    },
    // {
    //     ...msg_Ser_Loading()
    // },
    // {
    //     ...msg_Err()
    // }
]

interface msgProps {
    w: number,
    msg: msgState,
}


const Loading: React.FC<msgProps> = ({ w, msg }) => {
    const { id, msgid, select, context, isloading } = msg;
    return (
        <Loader color="dark" size="sm" variant="dots" />
    );
}

const autoWrap = (str: string, maxLength: number) => {
    let result: string = '';
    let i: number = 0, j: number = 0, cnt = 0;
    while (i < str.length) {
        let curlen = 0;
        // console.log(result);
        // console.log(i, j);
        // console.log(maxLength, curlen + getContextLen(str[j]));
        while (j < str.length && curlen + getContextLen(str[j]) < maxLength) {
            if (str[j] == '\n') {
                j++;
                break;
            }
            result += str[j];
            curlen += getContextLen(str[j]);
            j++;
        }
        result += '\n';
        i = j;
        cnt++;
        if (cnt > 100) break;
    }
    // console.log(result);
    return result;
};

const getSubMaxLen = (str: string) => {
    let res = 0;
    let i = 0, j = 0;
    while (i < str.length) {
        while (j < str.length && str[j] != '\n') {
            j++;
        }
        res = Math.max(res, getContextLen(str.substring(i, j)));
        i = ++j;
    }
    return res;
}



const MsgBlock: React.FC<msgProps> = ({ w, msg }) => {
    const { id, msgid, select, context, isloading } = msg;
    // let selectLen = getContextLen(select, { size: 14, family: "Segoe UI" });
    let selectLen = getSubMaxLen(select ? select : "");
    let contextLen = getSubMaxLen(context);
    // console.log(`w: ${w} contextlen: ${contextLen}`);
    const actualContext = autoWrap(context, Math.min(w, contextLen) + 10);
    // const aw = Math.min(w, contextLen);
    // console.log(`------- w:${w} contextlen: ${contextLen}   actw: ${aw}  --------`)
    // const actualContext = autoWrap(context, 50);
    // const actualContext = context;
    if (isloading) {
        return <Loading w={w} msg={msg} />
    }
    else {
        return (
            <Paper
                shadow="xs" radius="md" p="sm"
                withBorder >
                {select === null ? null :
                    <React.Fragment>
                        <Box className='msgselect'
                            w={Math.min(w, selectLen) + 10}>
                            <div style={{
                                width: 25,
                                // height: "100%",
                                background: "gray",
                                opacity: 0.4,
                                backgroundClip: "content-box",
                                padding: "0px 5px 0px 0px",
                            }} />
                            <Text c="gray.5" lineClamp={5}>{select}</Text >
                        </Box>
                        {/* <Divider my="sm" p={1}/> */}
                    </React.Fragment >}
                <Box w={Math.min(w, contextLen) + 5}>
                    <Text style={{ whiteSpace: 'pre-line' }}>
                        {actualContext}
                    </Text>
                </Box>

            </Paper >
        );
    }
}

const MsgBlockError: React.FC<msgProps> = ({ w, msg }) => {
    const { id, msgid, select, context, isloading } = msg
    if (isloading) {
        return <Loading w={w} msg={msg} />
    }
    else {
        return (
            <Box w={w}>
                <Alert icon={<IconAlertCircle size="1rem" />} title="MessageError" color="red" radius="sm">
                    serverError
                </Alert>
            </Box>
        );
    }
}



const MsgItem: React.FC<msgProps> = ({ w, msg }) => {
    const { id, msgid, select, context, isloading } = msg;
    switch (id) {
        case usrid: {
            return (
                <div className='msgitemRight'>
                    <MsgBlock w={w} msg={msg} />
                </div>
            );
        }
        case spid.serverid: {
            return (
                <div className='msgitemLeft'>
                    <MsgBlock w={w} msg={msg} />
                </div>

            );

        }
        case spid.msgerror: {
            return (
                <div
                    className='msgerror'
                >
                    <MsgBlockError w={w} msg={msg} />
                </div>
            );
        }
        default: {
            return <></>;
            // throw Error("NoneId :" + id);
        }

    }
}



export default function PaperCopliot() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [msglist, dispatch] = useReducer(msgReducer, msginitiallist);
    const [seltext, useSeltext] = useState<string | null>(null);

    const wRef = useRef<HTMLDivElement | null>(null);
    const [width, setWidth] = useState(0);
    const { width: w, height } = useWindowSize();
    const { curID } = useContext(HLContext);
    const { winSize, setWinSize } = useContext(winSizeContext);
    const {
        textSelected,
        textPos,
        text,
        setTextSelected,
        setTextPos,
        setText,
    } = React.useContext(ToolPopContext);
    const { InputRef } = useContext(RefContext)
    useEffect(() => {
        const onMsgGet = (event: { data: any; }) => {
            const response = event.data;
            const MsgData: msgState = {
                id: spid.serverid,
                msgid: response.msgid,
                context: response.context,
                select: response.select,
                isloading: false
            }
            console.log(event.data);
            handleMegGet(MsgData);
        }
        socket.on('server_response', onMsgGet);
        return () => {
            socket.off('server_response', onMsgGet);
        }
    }, []);

    useEffect(() => {
        if (wRef.current) {
            setWidth(wRef.current.offsetWidth * 0.65);
            setWinSize({
                ...winSize,
                leftwinSize: { w: wRef.current.offsetWidth, h: wRef.current.offsetHeight },
            });
        }
    }, [wRef.current?.offsetWidth]);
    // console.log(`~~~~~~rw: ${wRef.current?.offsetWidth}  sw: ${width}~~~~`);


    let heightOftxt: number = 0;
    useEffect(() => {
        if (InputRef.current) {
            heightOftxt = InputRef.current.offsetHeight;
        }
    }, []);


    const viewportRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        if (viewportRef.current && viewportRef.current.scrollHeight) {
            viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
            // console.log(viewportRef.current.scrollHeight);
        }
    }

    const handleUsrSend = (send: string, select: string | null) => {
        const message = {
            id: usrid,
            msgid: uuidv4(),
            select: select,
            send: send
        }
        dispatch({
            type: msgact.USER_SEND,
            id: usrid,
            msgid: uuidv4(),
            select: select,
            send: send
        });
        dispatch({
            type: msgact.ADD_LOADING,
            id: spid.serverid,
            msgid: message.msgid,
            select: null,
            send: "defaultContext_l"
        });
        // console.log(`
        //     type: ${msgact.USER_SEND},
        //     id: ${usrid},
        //     msgid: ${uuidv4()},
        //     select: ${select},
        //     send: ${send}`
        // );
        scrollToBottom();

        const msgjson = JSON.stringify(message);
        socket.emit("client_message", msgjson);
    }

    const handleMegGet = (response: msgState) => {
        dispatch({
            type: msgact.AI_SEND_NORMAL,
            id: response.id,
            msgid: response.msgid,
            select: response.select,
            send: response.context
        });
        scrollToBottom();
        console.log("GetEnd");
        // setTimeout(() => {scrollToBottom()}, 1);
    }

    const [isFocus, setIsFocus] = useState(false);
    // useEffect(() => {
    //     console.log("isForce:" + isFocus);
    // }, [isFocus]);
    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isFocus) {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (InputRef.current && InputRef.current.value) {
                    setText("");
                    handleUsrSend(InputRef.current.value, text);
                    setTimeout(() => {
                        if (InputRef.current && InputRef.current.value) {
                            InputRef.current.value = "";
                        }
                    }, 1);
                    // txtRef.current.value = "";
                }
            }
        }
    };

    const minRows = 3;
    return (
        <div className='papercopilot' ref={wRef} >
            <ScrollArea
                viewportRef={viewportRef}
                h={height - 40 * minRows - 15}
                type='hover'
                // offsetScrollbars
                scrollHideDelay={500}
                scrollbarSize={6}
                pb={10}>
                {width != 0 ?
                    msglist.map((msg, index) => (
                        <MsgItem key={msg.msgid} w={width} msg={msg} />
                    ))
                    : <></>}
                {/* {width != 0 ?
                    msglist.map((msg, index) => (
                        <MsgItem key={msg.msgid} w={width} msg={msg} />
                    ))
                    : <></>}
                {width != 0 ?
                    msglist.map((msg, index) => (
                        <MsgItem key={msg.msgid} w={width} msg={msg} />
                    ))
                    : <></>} */}
            </ScrollArea>
            <div style={{
                // height: `${heightOftxt}px`,
                // padding: '5px 10px 5px 0px',
                position: 'absolute',
                // display: "flex",
                // justifySelf: "center",
                width: "95%",
                bottom: 10,
            }}>
                <Paper radius="sm" p="xs" pt={1} pb={1} withBorder
                    style={{
                        zIndex: 1,
                        cursor: text === "" ? "default" : "pointer",
                    }}
                    onClick={() => {
                        console.log("ssssssssscroll");
                        scrollToBbox(curID);
                    }}
                >
                    <Text fz="sm" lineClamp={1}
                        c={text === "" ? "gray.4" : "gray.5"}>
                        {text === "" ? "Selected Text" : text}
                    </Text >
                </Paper >
                <Textarea
                    ref={InputRef}
                    icon={<IconAperture />}
                    placeholder='Send a message to PaperCopilot'
                    radius="sm"
                    autosize
                    minRows={minRows}
                    onBlur={() => {
                        setIsFocus(false);
                    }}
                    onFocus={() => {
                        setIsFocus(true);
                    }}
                    onKeyPress={(e) => {
                        handleKeyPress(e);
                    }}
                />
                <ActionIcon className='upLoad' variant="transparent" size='lg'
                    style={{
                        bottom: "25%",
                        right: 5,
                        display: "flex",
                        position: "absolute",
                        justifySelf: "flex-end",
                        zIndex: 1,
                    }}
                    onClick={() => {
                        if (InputRef.current) {
                            if (InputRef.current.value) {
                                setText("");
                                handleUsrSend(InputRef.current.value, text)
                                InputRef.current.value = "";
                            }
                        }
                    }}>
                    <IconCircleArrowUpFilled size="1.75rem" />
                </ActionIcon>
            </div>
        </div >
    );
}

