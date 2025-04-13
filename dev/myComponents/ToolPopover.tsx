import { useDisclosure, useWindowScroll } from '@mantine/hooks';
import { Popover, Text, Button, ActionIcon, Container, Divider, Card, CopyButton, Tooltip } from '@mantine/core';
import React, { MutableRefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ToolPopContext } from '../context/PopoverConext';
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
    IconTrash
} from '@tabler/icons-react';
import { RefContext } from '../context/RefContext';
import useWindowSize from '../utils/useWindowSize';
import { winSizeContext } from '../context/winSizeContext';
import { NavItemContext } from '../context/NavContext';

type Props = {
    pageIndex: number,
    annotations: PageToAnnotationsMap,
    parentRef: React.RefObject<HTMLDivElement>,
};
const pageMargin = 24;

export const PopoverUp: React.FunctionComponent<Props> = ({
    pageIndex, annotations, parentRef
}: Props) => {
    //context
    const { ReaderPaneRef, ToolkitRef, ReaderScrollRef, InputRef } = useContext(RefContext);
    const { pageDimensions } = useContext(DocumentContext);
    const { rotation, scale } = React.useContext(TransformContext);
    const { winSize, setWinSize } = useContext(winSizeContext);
    const { curID, setCurID, customHLcolor, setCustomHLcolor, hlList, hldispatch } = useContext(HLContext)
    const {
        textSelected,
        textPos,
        text,
        setTextSelected,
        setTextPos,
        setText,
    } = React.useContext(ToolPopContext);
    const {
        itemSelectedL: idL, setItemSelectedL: setIdL,
        itemSelectedR: idR, setItemSelectedR: setIdR,
    } = useContext(NavItemContext);
    //state
    const [boxlist, setBoxList] = useState<BoundingBox[]>([]);

    //Ref
    const IDRef = useRef<number>();
    IDRef.current = curID;

    const { width: w, height: h } = useWindowSize();
    const Reader_w = ReaderPaneRef.current ? ReaderPaneRef.current.offsetWidth : w;
    if (ReaderPaneRef.current) {
        console.log(ReaderPaneRef.current.offsetWidth);
        console.log(w);
    }
    // const pageleft = (w - pageDimensions.width * scale + winSize.leftwinSize.w) / 2 + 41.5;
    const pageleft = w - (Reader_w + pageDimensions.width * scale) / 2;
    const scrolltop = ReaderScrollRef.current ? ReaderScrollRef.current?.scrollTop : 0;
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
                        console.log("rects:" + rects[i].top);
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
                if (IDRef.current === -1) {
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
            if (ToolkitRef.current && !ToolkitRef.current.contains(e.target as Node)) {
                if (IDRef.current === -1) {
                    const selection = window.getSelection();
                    selection?.removeAllRanges();
                    setTextSelected(false);
                    setText("");
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
                    {/* Translate */}
                    <ActionIcon size="md" radius="md" variant="subtle"
                        onMouseDown={() => {

                            const selection = window.getSelection();
                            selection?.removeAllRanges();
                            setCurID(-1);
                            setTextSelected(false);
                        }}
                    >
                        <IconAB2 size="1.125rem" />
                    </ActionIcon>
                    {/* <Divider orientation="vertical" /> */}
                    {/* Highlight */}
                    {curID !== -1 ? null :
                        <ActionIcon size="md" radius="md" variant="subtle"
                            onMouseDown={() => {
                                hldispatch({
                                    type: hltype.ADD,
                                    id: 0,
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
                            <IconHighlight size="1.125rem" />
                        </ActionIcon>}
                    {/* <Divider orientation="vertical" /> */}
                    {/* Explain */}
                    <ActionIcon size="md" radius="md" variant="subtle"
                        onMouseDown={() => {
                            // setCurID(-1);
                            setIdL(2);
                            setTimeout(() => {
                                const selection = window.getSelection();
                                selection?.removeAllRanges();
                                setTextSelected(false);
                                InputRef.current?.focus();
                            }, 100);
                        }}
                    >
                        <IconQuestionMark size="1.125rem" />
                    </ActionIcon>
                    {/* <Divider orientation="vertical" pt={2} pb={2}/> */}
                    {/* Copy */}
                    <CopyButton value={text} >
                        {({ copied, copy }) => (
                            <ActionIcon size="md" radius="md" variant="subtle"
                                onMouseDown={() => {
                                    copy();
                                    setCurID(-1);
                                    setTextSelected(false);
                                }}>
                                <IconCopy size="1.125rem" />
                            </ActionIcon>
                        )}
                    </CopyButton>

                    {curID === -1 ? null :
                        <ActionIcon size="md" radius="md" variant="subtle"
                            color='red'
                            onMouseDown={() => {
                                hldispatch({
                                    ...dVal,
                                    type: hltype.DEL,
                                    id: curID,
                                })
                                setCurID(-1);
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