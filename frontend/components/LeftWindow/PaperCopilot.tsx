import React, { useState, useContext, useReducer, useRef, useEffect, createContext, MutableRefObject } from 'react';
import * as ReactDOM from 'react-dom';
import msgReducer from './msgReducer'
import { msgList, msgAction, msgact, spid, msgState, msgHint } from '../../types/msgchat';
import { v4 as uuidv4 } from 'uuid';
import { Text, Container, Loader, ScrollArea, Paper, Skeleton, Alert, List, Textarea, TypographyStylesProvider, Box, Button, ActionIcon, Divider, Center, Tooltip } from '@mantine/core';
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
import CopilotInput from './CopilotInput';
import RelatedPaperList from './RelatedPaperList';
import Markdown from 'react-markdown'
const usrid = "130";
const serveid = "1919810";

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

    function hintlist_render(): Array<React.ReactElement> {
        const hints: Array<React.ReactElement> = [];
        hintlist.map((msghint, i) => {
            let contextLen = getSubMaxLen(msghint.hint);
            hints.push(
                <Tooltip
                    key={i}
                    label={msghint.hint}
                    withArrow
                    multiline
                    w='90%'
                >
                    <div
                        style={{
                            padding: 3,
                            display: "flex",
                            justifyContent: "flex-start",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            // hint_Emit({ bbid: msghint.bbid, hint: "" });
                            setTimeout(() => {
                                scrollToBbox(msghint.bbid);
                            }, 10)
                        }}
                    >
                        <Paper className='copilot_hint_paper'
                            radius="md" p="7px 5px 7px 5px"
                        >
                            <IconCornerDownRight style={{
                                margin: "0 3"
                            }} size={"1.25rem"} color='gray' />
                            <Box w={Math.min(w, contextLen + 50) + 10}>
                                <Text lineClamp={1} truncate c="gray.8">
                                    {msghint.hint}
                                </Text>
                            </Box>
                        </Paper>
                    </div>
                </Tooltip>
            )
        })
        return hints;
    }
    if (hintlist.length > 0) {
        return (
            <React.Fragment>
                {hintlist_render()}
            </React.Fragment>
        );
    }
    else {
        return <React.Fragment />;
    }
}


const MsgBlock: React.FC<msgProps> = ({ w, msg }) => {
    const { id, msgid, select, context, isloading } = msg;
    // let selectLen = getContextLen(select, {size: 14, family: "Segoe UI" });
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
            <div>
                {msg.id === serveid ?
                    <React.Fragment>
                        {select != null &&
                            <React.Fragment>
                                <Text c="gray.6" >{"Thinking..."}</Text >
                                <Text c="gray.5" >{" "}</Text >
                                <Text c="gray.5" >{select}</Text >
                            </React.Fragment>}
                        {context != "" &&
                            <Paper shadow="xs" radius="md" p="8px 20px 0px 8px" withBorder>
                                <Text ><Markdown>{actualContext}</Markdown></Text>
                                <MsgHint w={w} msg={msg} />
                            </Paper >
                        }
                    </React.Fragment>
                    :
                    <Paper shadow="xs" radius="md" p="sm" withBorder w={Math.min(w, Math.max(selectLen + 10, contextLen)) + 20}>
                        {select != null &&
                            <Box className='msgselect' w={Math.min(w, Math.max(selectLen + 10, contextLen))}>
                                <div style={{
                                    width: 20,
                                    background: "gray",
                                    opacity: 0.4,
                                    margin: "0px 5px 0px 0px"
                                }} />
                                <Tooltip label={select} withArrow multiline w='90%'>
                                    <Text c="gray.5" lineClamp={5}>{select}</Text >
                                </Tooltip >
                            </Box>}
                        <Text >{actualContext}</Text>
                    </Paper >
                }
            </div>
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
    const { ReaderPaneRef, ToolkitRef, ReaderScrollRef, LeftPaneRef } = useContext(RefContext);
    const { curID, hlList, hldispatch } = useContext(HLContext);
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

    const parentPaneWitdh = LeftPaneRef.current ? LeftPaneRef.current.offsetWidth : 0;
    const parentPaneHeight = LeftPaneRef.current ? LeftPaneRef.current.offsetHeight : 0;

    const scrollToBottom = () => {
        if (viewportRef.current && viewportRef.current.scrollHeight) {
            viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
        }
    }

    const handleMegGet = (msg: msgAction) => {
        msgdispatch(msg);
        scrollToBottom();
    }

    const handleHintGet = (hint_r: HLaction) => {
        hldispatch(hint_r);
        // scrollToBbox(hlList.length - 1);
    }

    msg_onReceive(handleMegGet);
    hint_onReceive(handleHintGet);

    return (
        <div className='papercopilot'
            style={{
                height: window.innerWidth,
            }}
        >
            <ScrollArea
                viewportRef={viewportRef}
                h={parentPaneHeight * 0.85}
                type='hover'
                scrollHideDelay={500}
                scrollbarSize={6}
                style={{
                    // border: "1px solid #555454",
                    // borderRadius: "4px",
                }}
            >
                {msglist.map((msg, index) => (
                    <MsgItem key={msg.msgid} w={parentPaneWitdh * 0.65} msg={msg} />
                ))}
            </ScrollArea>
            <CopilotInput />
            <RelatedPaperList />
        </div >
    );
}

