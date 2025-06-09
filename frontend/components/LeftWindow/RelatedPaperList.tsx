import React, { useState, useContext, useReducer, useRef, useEffect, createContext, MutableRefObject } from 'react';
import { RefContext } from '../../context/RefContext';
import { VisibleContext } from '../../context/VisibleContext';
import { Tooltip, Text, Paper, Box, ActionIcon } from '@mantine/core';
import { IconAdjustments } from '@tabler/icons-react';
import { LoadingContext } from '../../context/LoadingContext';
import { msg_Emit, msg_Emit_Compare, rpu_onReceive } from '../socketio';
import { PcContext } from '../../context/PcContext';
import { action_Send, action_Ser_Loading } from './msg_module';
import { v4 as uuidv4 } from 'uuid';

export type relatedPaperState = {
    title: string,
    doc_id: number,
};


export default function RelatedPaperList() {
    const { ReaderPaneRef, ToolkitRef, ReaderScrollRef, LeftPaneRef } = useContext(RefContext);
    const { rpvisible, setRpvisible } = useContext(VisibleContext);
    const parentPaneWitdh = LeftPaneRef.current ? LeftPaneRef.current.offsetWidth : 0;
    const parentPaneHeight = LeftPaneRef.current ? LeftPaneRef.current.offsetHeight : 0;
    const { rploading, setRploading } = useContext(LoadingContext);
    const { msglist, msgdispatch } = useContext(PcContext);
    const [rplist, setRplist] = useState<relatedPaperState[]>([
        {
            title: "AQuestion Answering Framework for Decontextualizing User-facing Snippets from Scientific Documents",
            doc_id: 111,
        },
        {
            title: "PaperWeaver: Enriching Topical Paper Alerts by Contextualizing Recommended Papers with User-collected Papers",
            doc_id: 222,
        },
        {
            title: "Paper Plain: Making Medical Research Papers Approachable to Healthcare Consumers with Natural Language Processing",
            doc_id: 333,
        },
    ]);
    rpu_onReceive(setRplist);
    return (
        <React.Fragment >
            {rpvisible &&
                <div className='related_paper'>
                    <Text fz="sm" p={2} fw={700}>Related Paper</Text>
                    <div>
                        {rplist.map((paper, index) => {
                            const { title, doc_id } = paper;

                            return (
                                <Tooltip key={index} label={title} multiline w={0.7 * parentPaneWitdh} >
                                    <Text className='related_paper_button' fz="sm" lineClamp={1} p={2} w={200}
                                        onClick={() => {
                                            setRpvisible(false);
                                            const msgid = uuidv4();
                                            const action = {
                                                ...action_Send,
                                                msgid: msgid,
                                                select: null,
                                                loading_id: msgid,
                                                context: "$Compare_A_B$"
                                            }
                                            msgdispatch({
                                                ...action_Ser_Loading,
                                                msgid: msgid,
                                            });
                                            msg_Emit_Compare(action);
                                        }}>{title}</Text >
                                </Tooltip>
                            )
                        })}
                    </div>
                </div >
            }
        </React.Fragment >
    );
}

