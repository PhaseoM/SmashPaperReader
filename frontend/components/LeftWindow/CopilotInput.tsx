import React, { useState, useContext, useReducer, useRef, useEffect, createContext, MutableRefObject } from 'react';
import * as ReactDOM from 'react-dom';
import msgReducer from './msgReducer'
import { msgList, msgAction, msgact, spid, msgState, msgHint } from '../../types/msgchat';
import { v4 as uuidv4 } from 'uuid';
import { Text, Container, Loader, ScrollArea, Paper, Skeleton, Alert, List, Textarea, TypographyStylesProvider, Box, Button, ActionIcon, Divider, Center, Tooltip } from '@mantine/core';
import { state_Send, state_Receive, state_Err, state_Ser_Loading, action_Send, action_Ser_Loading } from './msg_module'
import {
    IconAlertCircle,
    IconAperture,
    IconCircleArrowUp,
    IconCircleArrowUpFilled,
    IconCornerDownRight
} from '@tabler/icons-react';
import { ToolPopContext } from '../../context/PopoverConext';
import { scrollToBbox } from '../Highlight/HighlightRender';
import { HLContext } from '../../context/HLContext';
import { winSizeContext } from '../../context/winSizeContext';
import { RefContext } from '../../context/RefContext';
import { PcContext } from '../../context/PcContext';
import { msg_Emit, socketIO } from '../socketio';
import { VisibleContext } from '../../context/VisibleContext';

export default function CopilotInput() {
    const Rowsvalue_1 = 3;
    const Rowsvalue_2 = 4;

    const [isFocus, setIsFocus] = useState(false);

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
    const { ViewportRef, InputRef } = useContext(RefContext);
    const { rpvisible, setRpvisible } = useContext(VisibleContext);

    const parentPaneWitdh = LeftPaneRef.current ? LeftPaneRef.current.offsetWidth : 0;
    const parentPaneHeight = LeftPaneRef.current ? LeftPaneRef.current.offsetHeight : 0;
    const scrollToBottom = () => {
        if (ViewportRef.current && ViewportRef.current.scrollHeight) {
            ViewportRef.current.scrollTo({ top: ViewportRef.current.scrollHeight, behavior: 'smooth' });
        }
    }

    const handleUsrSend = (message: msgAction) => {
        msgdispatch(message);
        msgdispatch({
            ...action_Ser_Loading,
            msgid: message.loading_id,
        });
        msg_Emit(message);
        setTimeout(() => { scrollToBottom(); }, 1);
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isFocus) {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (InputRef.current && InputRef.current.value) {
                    setText("");
                    handleUsrSend({
                        ...action_Send,
                        msgid: uuidv4(),
                        select: text,
                        loading_id: uuidv4(),
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
    // console.log(`ph:${parentPaneHeight}`)
    return (
        <div className='copilot_input'
            style={{
                height: 0.15 * parentPaneHeight,
                padding: "8px 6px",
                // margin: `5px ${parentPaneWitdh * 0.02 + 30}px 0px ${parentPaneWitdh * 0.02 + 30}px`
            }}
        >
            <div className='copilot_subinput_2'
                style={{
                    height: 0.13 * parentPaneHeight,
                }}
            >
                {
                    text === "" ? <React.Fragment /> :
                        <Tooltip label={text} withArrow multiline w={0.96 * parentPaneWitdh}>
                            <Paper className='copilot_tip'
                                radius={4} p="xs" pt={3} pb={2} ml={0.03 * parentPaneWitdh} mt={3}
                                w={0.90 * parentPaneWitdh}
                                onClick={() => { scrollToBbox(curID); }}
                            >
                                <IconCornerDownRight style={{
                                    margin: "0 2"
                                }} size={"1.25rem"} color='gray' />
                                <Box w={0.78 * parentPaneWitdh}>
                                    <Text fz="sm" lineClamp={1} truncate c="gray.7">{text}</Text >
                                </Box>
                            </Paper >
                        </Tooltip>
                }
                <ActionIcon className='copilot_paper_select' variant="transparent" size='lg'
                    onClick={() => {
                        // socketIO.emit("handleRP","hadsd11111");
                        setRpvisible(!rpvisible);
                    }} >
                    <IconAperture size="28" />
                </ActionIcon>
                <Textarea
                    className='copilot_textarea'
                    ref={InputRef}
                    placeholder='Send a message to PaperCopilot'
                    radius="sm"
                    autosize
                    minRows={text === "" ? Rowsvalue_2 : Rowsvalue_1}
                    maxRows={text === "" ? Rowsvalue_2 : Rowsvalue_1}
                    w={0.96 * parentPaneWitdh - 70}
                    // pl={parentPaneWitdh * 0.02 + 30}
                    variant='unstyled'
                    style={{
                        margin: `${text === "" ? "10px" : "4px"} ${parentPaneWitdh * 0.02 + 30}px 0px ${parentPaneWitdh * 0.02 + 30}px`,
                    }}
                    onBlur={() => { setIsFocus(false); }}
                    onFocus={() => { setIsFocus(true); }}
                    onKeyPress={(e) => { handleKeyPress(e); }}
                />
                <ActionIcon className='copilot_upload' variant="transparent" size='lg'
                    onClick={() => {
                        if (InputRef.current) {
                            if (InputRef.current.value) {
                                setText("");
                                handleUsrSend({
                                    ...action_Send,
                                    msgid: uuidv4(),
                                    select: text,
                                    loading_id: uuidv4(),
                                    context: InputRef.current.value,
                                });
                                InputRef.current.value = "";
                            }
                        }
                    }}>
                    <IconCircleArrowUpFilled size="28" />
                </ActionIcon>
            </div>
        </div>
    );
}

