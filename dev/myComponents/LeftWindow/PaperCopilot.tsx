import React, { useState, useContext, useReducer, useRef, useEffect, createContext, MutableRefObject } from 'react';
import * as ReactDOM from 'react-dom';
import msgReducer from './msgReducer'
import { msgList, msgAction, msgact, spid, msgState, msgHint } from '../../types/msgchat';
import { v4 as uuidv4 } from 'uuid';
import { Text, Container, Loader, ScrollArea, Paper, Skeleton, Alert, List, Textarea, TypographyStylesProvider, Box, Button, ActionIcon, Divider, Center } from '@mantine/core';
import { state_Send, state_Receive, state_Err, state_Ser_Loading, action_Send, action_Ser_Loading } from './msg_module'
import { IconAlertCircle, IconAperture, IconCircleArrowUp, IconCircleArrowUpFilled, IconCornerDownRight } from '@tabler/icons-react';
import useWindowSize from '../../utils/useWindowSize';
import { Input } from 'antd';
import { NavItemContext } from '../../context/NavContext';
import { getActualWidthOfChars as getContextLen, opArgs } from '../../utils/useGetTextLength';
import io from 'socket.io-client';
import { hint_Emit, hint_onReceive, msg_Emit, msg_onReceive, socketIO } from '../socketio'
import { ToolPopContext } from '../../context/PopoverConext';
import { scrollToBbox } from '../Highlight/HighlightRender';
import { HLContext } from '../../context/HLContext';
import { useWindowScroll } from '@mantine/hooks';
import { winSizeContext } from '../../context/winSizeContext';
import { RefContext } from '../../context/RefContext';
import { HLaction } from '../../types/hightlight';
import { msginitiallist } from './msgReducer'
import { PcContext } from '../../context/PcContext';
const usrid = "130";


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

const MsgHint: React.FC<msgProps> = ({ w, msg }) => {
    const hintlist = msg.HintList;
    const { curID, hlList, hldispatch } = useContext(HLContext);

    function hintlistrender(): Array<React.ReactElement> {
        const hints: Array<React.ReactElement> = [];
        hintlist.map((msghint, i) => {
            let contextLen = getSubMaxLen(msghint.hint);
            hints.push(
                <div
                    key={i}
                    style={{
                        padding: 3,
                        display: "flex",
                        justifyContent: "flex-start",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        hint_Emit({ id: msghint.id, hint: "" });
                        setTimeout(() => {
                            scrollToBbox(hlList.length);
                        }, 10)
                    }}
                >
                    <Paper shadow="xs" radius="lg" p="sm" withBorder
                        bg="gray.1">
                        {/* <div style={{
                            display: "flex",
                            top: "5",
                            right: "20",
                        }}>
                            <IconCornerDownRight size={"1.25rem"} />
                        </div> */}
                        <Box w={Math.min(w, contextLen + 50) + 10}>
                            <Text lineClamp={1} truncate>
                                {msghint.hint}
                            </Text>
                        </Box>
                    </Paper>
                </div>

            )
        })
        return hints;
    }
    if (hintlist.length > 0) {
        return (
            <React.Fragment>
                {hintlistrender()}
            </React.Fragment>
        );
    }
    else {
        return <React.Fragment />;
    }
}


const MsgBlock: React.FC<msgProps> = ({ w, msg }) => {
    const { id, msgid, select, context, isloading } = msg;
    // let selectLen = getContextLen(select, { size: 14, family: "Segoe UI" });
    let selectLen = getSubMaxLen(select ? select : "");
    let contextLen = getSubMaxLen(context);
    // console.log(`w: ${w} contextlen: ${contextLen}`);
    const actualContext = autoWrap(context, Math.min(w, contextLen) + 15);
    // const aw = Math.min(w, contextLen);
    // console.log(`------- w:${w} contextlen: ${contextLen}   actw: ${aw}  --------`)
    // const actualContext = autoWrap(context, 50);
    // const actualContext = context;
    if (isloading) {
        return <Loading w={w} msg={msg} />
    }
    else {
        return (
            <Paper shadow="xs" radius="md" p="sm" withBorder >
                {select === null ? null :
                    <React.Fragment>
                        <Box className='msgselect'
                            w={Math.min(w, selectLen) + 10}>
                            <div style={{
                                width: 20,
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
                <Box w={Math.min(w, contextLen) + 15}>
                    <Text >
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
                <React.Fragment>
                    <div className='msgitemLeft'>
                        <MsgBlock w={w} msg={msg} />
                    </div>
                    <MsgHint w={w} msg={msg} />
                </React.Fragment>

            );

        }
        case spid.msgerror: {
            return (
                <div className='msgerror'>
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
    const minRows = 3;
    let heightOftxt: number = 0;

    const [seltext, useSeltext] = useState<string | null>(null);
    const [width, setWidth] = useState(0);
    const [isFocus, setIsFocus] = useState(false);

    const wRef = useRef<HTMLDivElement | null>(null);

    const { curID, hlList, hldispatch } = useContext(HLContext);
    const { winSize, setWinSize } = useContext(winSizeContext);
    const {
        textSelected,
        textPos,
        text,
        setTextSelected,
        setTextPos,
        setText,
    } = React.useContext(ToolPopContext);
    const { msglist, msgdispatch } = useContext(PcContext);
    const { ViewportRef: viewportRef, InputRef } = useContext(RefContext)

    const { width: w, height } = useWindowSize();

    useEffect(() => {
        if (wRef.current) {
            setWidth(wRef.current.offsetWidth * 0.65);
            setWinSize({
                ...winSize,
                leftwinSize: { w: wRef.current.offsetWidth, h: wRef.current.offsetHeight },
            });
        }
    }, [wRef.current?.offsetWidth]);


    useEffect(() => {
        if (InputRef.current) {
            heightOftxt = InputRef.current.offsetHeight;
        }
    }, []);

    const scrollToBottom = () => {
        if (viewportRef.current && viewportRef.current.scrollHeight) {
            viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
        }
    }

    const handleUsrSend = (message: msgAction) => {
        msgdispatch(message);
        msgdispatch(action_Ser_Loading);
        msg_Emit(message);
        scrollToBottom();
    }

    const handleMegGet = (msg: msgAction) => {
        msgdispatch(msg);
        scrollToBottom();
    }

    const handleHintGet = (hint_r: HLaction) => {
        hldispatch(hint_r);
        scrollToBbox(hlList.length - 1);
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isFocus) {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (InputRef.current && InputRef.current.value) {
                    setText("");
                    handleUsrSend({
                        ...action_Send,
                        select: text,
                        context: InputRef.current.value,
                    });
                    setTimeout(() => {
                        if (InputRef.current && InputRef.current.value) {
                            InputRef.current.value = "";
                        }
                    }, 1);
                }
            }
        }
    };


    msg_onReceive(handleMegGet);
    hint_onReceive(handleHintGet);

    return (
        <div className='papercopilot' ref={wRef}
            style={{
                height: window.innerWidth,
            }}
        >
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
                                handleUsrSend({
                                    ...action_Send,
                                    msgid: uuidv4(),
                                    select: text,
                                    context: InputRef.current.value,
                                });
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

