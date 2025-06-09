import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import { Popover, Text, Button, ActionIcon, Container, Divider, Card, CopyButton, Tooltip } from '@mantine/core';
import React, { MutableRefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ToolPopContext } from '../context/PopoverConext';
import { v4 as uuidv4 } from 'uuid';
import { PageToAnnotationsMap } from '../types/annotations';
import { DocumentContext, PageRenderContext, TransformContext } from '@allenai/pdf-components'
import { HLContext } from '../context/HLContext';
import { BoundingBox, BoundingBoxText, dVal, hltype } from '../types/hightlight';
import {
    IconAB2,
    IconHighlight,
    IconQuestionMark,
    IconCopy,
    IconCheck,
    IconTrashX,
    IconTrash,
    IconSparkles,
    IconPencil,
} from '@tabler/icons-react';
import { RefContext } from '../context/RefContext';
import useWindowSize from '../utils/useWindowSize';
import { winSizeContext } from '../context/winSizeContext';
import { NavItemContext } from '../context/NavContext';
import { PcContext } from '../context/PcContext';
import { action_Receive, action_Send, action_Ser_Loading, state_Receive } from './LeftWindow/msg_module';
import { msg_Emit } from './socketio';
import { NoteContext } from '../context/NoteContext';

type Props = {
    pageIndex: number,
    annotations: PageToAnnotationsMap,
    parentRef: React.RefObject<HTMLDivElement>,
};
const pageMargin = 24;

export const FloatingToolbar: React.FunctionComponent<Props> = ({
    pageIndex, annotations, parentRef
}: Props) => {
    //context
    const { ReaderPaneRef, ToolkitRef, ReaderScrollRef, InputRef, NotePopRef } = useContext(RefContext);
    const { pageDimensions } = useContext(DocumentContext);
    const { rotation, scale } = React.useContext(TransformContext);
    const { winSize, setWinSize } = useContext(winSizeContext);
    const { curID, setCurID, customHLcolor, setCustomHLcolor, hlList, hldispatch } = useContext(HLContext)
    const {
        textSelected,
        textPos,
        text,
        scrolltop,
        setTextSelected,
        setTextPos,
        setText,
        setScrolltop,
    } = React.useContext(ToolPopContext);
    const {
        notevis,
        setNotevis,
        notelist,
        notedispatch
    } = React.useContext(NoteContext);
    const {
        itemSelectedL: idL, setItemSelectedL: setIdL,
        itemSelectedR: idR, setItemSelectedR: setIdR,
    } = useContext(NavItemContext);
    //state
    const [boxlist, setBoxList] = useState<BoundingBox[]>([]);

    //Ref
    const IDRef = useRef<string>();
    IDRef.current = curID;

    const { width: w, height: h } = useWindowSize();
    const rightwin = document.getElementById("right-win-ctrl");
    const rightwin_w = rightwin?.clientWidth;
    const Reader_w = ReaderPaneRef.current ? ReaderPaneRef.current.offsetWidth : w;
    const total_w = Reader_w + (rightwin_w ? rightwin_w : 0);
    // console.log(`readerw:${Reader_w} rightw:${rightwin_w} totalw;${total_w}`);
    // if (ReaderPaneRef.current) {
    //     console.log(ReaderPaneRef.current.offsetWidth);
    //     console.log(w);
    // }
    // const pageleft = (w - pageDimensions.width * scale + winSize.leftwinSize.w) / 2 + 41.5;
    const pageleft = w - (rightwin_w ? rightwin_w : 0) - (Reader_w + pageDimensions.width * scale) / 2;
    // const scrolltop = ReaderScrollRef.current ? ReaderScrollRef.current?.scrollTop : 0;
    // console.log(scrolltop);
    useEffect(() => {
        const defaultTop = pageMargin + pageIndex * (2 * pageMargin + pageDimensions.height * scale);
        const handleSelection = (e: MouseEvent) => {
            e.preventDefault();
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0 && selection.toString() != "") {
                const range = selection.getRangeAt(0);
                const rects = Array.from(range.getClientRects());

                const pNode = range.startContainer.parentNode as HTMLElement;
                const gpNode = pNode?.parentNode?.parentNode as HTMLElement;
                const pageNumber = gpNode?.getAttribute('data-page-number');
                const curPage = parseInt(pageNumber === null ? "" : pageNumber) - 1;
                if (curPage === pageIndex) {
                    const rect = range.getBoundingClientRect();
                    const mouseX: number = e.clientX;
                    const mouseY: number = e.clientY;
                    let boxes: BoundingBox[] = [];
                    for (let i = 0; i < rects.length; i++) {
                        // console.log("rects:" + rects[i].top);
                        boxes.push({
                            page: curPage,
                            top: (rects[i].top - defaultTop + scrolltop) / scale,
                            left: (rects[i].left - pageleft) / scale,
                            height: rects[i].height / scale,
                            width: rects[i].width / scale
                        })
                    }
                    // console.log("top  " + rect.top);
                    // console.log("top  " + pageIndex + ":  " + (rect.top - defaultTop + scrolltop));
                    setTextPos({
                        page: curPage,
                        top: (rect.top - defaultTop + scrolltop) / scale,
                        left: (rect.left - pageleft) / scale,
                        height: rect.height / scale,
                        width: rect.width / scale,
                        x: mouseX,
                        y: mouseY,
                    })
                    setBoxList(boxes);
                    setTextSelected(true);
                    setText(selection.toString());
                }
            }
            else {
                if (IDRef.current === "-1") {
                    if (ToolkitRef.current) {
                        if (!ToolkitRef.current.contains(e.target as Node)) {
                            setTextSelected(false);
                            setText("");
                        }
                    }
                    else {
                        setTextSelected(false);
                        setText("");
                    }
                }
            }
        }
        const handleUnSelection = (e: MouseEvent) => {
            if (!(NotePopRef.current && !NotePopRef.current.contains(e.target as Node))) {
                if (ToolkitRef.current && !ToolkitRef.current.contains(e.target as Node)) {
                    if (IDRef.current === "-1") {
                        const selection = window.getSelection();
                        selection?.removeAllRanges();
                        setTextSelected(false);
                        setText("");
                    }
                }
            }
        }
        ReaderPaneRef.current?.addEventListener('mouseup', handleSelection);
        ReaderPaneRef.current?.addEventListener('mousedown', handleUnSelection);
        return () => {
            ReaderPaneRef.current?.removeEventListener('mouseup', handleSelection);
            ReaderPaneRef.current?.removeEventListener('mousedown', handleUnSelection);
        };
    }, [pageleft, scrolltop, scale]);

    function renderPopover(): React.ReactElement {
        const { msglist, msgdispatch } = useContext(PcContext);
        const { ViewportRef } = useContext(RefContext);
        const scrollToBottom = () => {
            if (ViewportRef.current && ViewportRef.current.scrollHeight) {
                ViewportRef.current.scrollTo({ top: ViewportRef.current.scrollHeight, behavior: 'smooth' });
            }
        }
        if (textSelected && textPos.page === pageIndex) {
            return (
                <div
                    ref={ToolkitRef}
                    style={{
                        "display": "flex",
                        "justifyContent": "center",
                        "position": "fixed",
                        "top": textPos.y + 10,
                        "left": textPos.x - 15,
                        "zIndex": 1000000,
                        "background": "white",
                        "borderRadius": 3,
                        "boxShadow": "8px 8px 15px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    {/* NoteTaking */}
                    <ActionIcon size="md" radius="md" variant="subtle"
                        onMouseDown={() => {
                            setNotevis(true);
                            setTextSelected(false);
                        }}
                    >
                        <IconPencil size="1.125rem" />
                    </ActionIcon>
                    {/* Translate */}
                    <ActionIcon size="md" radius="md" variant="subtle"
                        onMouseUp={() => {
                            setIdL(2);
                            const msgid = uuidv4();
                            const action = {
                                ...action_Send,
                                msgid: msgid,
                                select: text,
                                context: "翻译成中文。"
                            }
                            msgdispatch(action);
                            msgdispatch({
                                ...action_Ser_Loading,
                                msgid: msgid,
                            });
                            msg_Emit(action);
                            const selection = window.getSelection();
                            selection?.removeAllRanges();
                            setTextSelected(false);
                            setTimeout(() => {
                                setCurID("-1");
                                setText("");
                                InputRef.current?.focus();
                                scrollToBottom();
                            }, 10);
                        }}
                    >
                        <IconAB2 size="1.125rem" />
                    </ActionIcon>
                    {/* <Divider orientation="vertical" /> */}
                    {/* Highlight */}
                    {curID !== "-1" ? null :
                        <ActionIcon size="md" radius="md" variant="subtle"
                            onMouseUp={() => {
                                hldispatch({
                                    type: hltype.ADD,
                                    bbid: uuidv4(),
                                    content: text,
                                    color: customHLcolor,
                                    UniteBox: {
                                        page: textPos.page,
                                        height: textPos.height,
                                        width: textPos.width,
                                        top: textPos.top,
                                        left: textPos.left,
                                    },
                                    BoxList: boxlist
                                })
                                const selection = window.getSelection();
                                selection?.removeAllRanges();
                                setTextSelected(false);
                            }}
                        >
                            <IconSparkles size="1.125rem" />
                        </ActionIcon>}
                    {/* <Divider orientation="vertical" /> */}
                    {/* Explain */}
                    <ActionIcon size="md" radius="md" variant="subtle"
                        onMouseUp={() => {
                            setIdL(2);
                            const selection = window.getSelection();
                            selection?.removeAllRanges();
                            setTextSelected(false);
                            setTimeout(() => {
                                setCurID("-1");
                                InputRef.current?.focus();
                            }, 10);
                        }}
                    >
                        <IconQuestionMark size="1.125rem" />
                    </ActionIcon>
                    {/* <Divider orientation="vertical" pt={2} pb={2}/> */}
                    {/* Copy */}
                    <CopyButton value={text} >
                        {({ copied, copy }) => (
                            <ActionIcon size="md" radius="md" variant="subtle"
                                onMouseUp={() => {
                                    const selection = window.getSelection();
                                    selection?.removeAllRanges();
                                    copy();
                                    setCurID("-1");
                                    setTextSelected(false);
                                }}>
                                <IconCopy size="1.125rem" />
                            </ActionIcon>
                        )}
                    </CopyButton>

                    {curID === "-1" ? null :
                        <ActionIcon size="md" radius="md" variant="subtle"
                            color='red'
                            onMouseDown={() => {
                                hldispatch({
                                    ...dVal,
                                    type: hltype.DEL,
                                    bbid: curID,
                                })
                                setCurID("-1");
                                setText("");
                                setTextSelected(false);
                            }}>
                            <IconTrash size="1.125rem" />
                        </ActionIcon>}
                </div >
            );

        }
        return <React.Fragment />
    };
    return (
        <React.Fragment>
            {renderPopover()}
        </React.Fragment>
    );
}