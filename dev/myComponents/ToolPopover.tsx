import { useDisclosure } from '@mantine/hooks';
import { Popover, Text, Button, ActionIcon, Container, Divider, Card, CopyButton, Tooltip } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { ToolPopContext } from '../context/PopoverConext';
import { PageToAnnotationsMap } from '../types/annotations';
import { DocumentContext, PageRenderContext } from '@allenai/pdf-components'
import { HLContext } from '../context/HLContext';
import { BoundingBox, BoundingBoxText, hltype } from '../types/hightlight';
import {
    IconAB2,
    IconHighlight,
    IconQuestionMark,
    IconCopy,
    IconCheck
} from '@tabler/icons-react';

type Props = {
    pageIndex: number,
    annotations: PageToAnnotationsMap,
    parentRef: React.RefObject<HTMLDivElement>,
};


export const PopoverUp: React.FunctionComponent<Props> = ({
    pageIndex, annotations, parentRef
}: Props) => {
    const {
        textSelected,
        textPos,
        text,
        setTextSelected,
        setTextPos,
        setText,
    } = React.useContext(ToolPopContext);

    const { customHLcolor, setCustomHLcolor, hlList, hldispatch } = useContext(HLContext)
    const [boxlist, setBoxList] = useState<BoundingBox[]>([]);

    useEffect(() => {
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


                const rect = range.getBoundingClientRect();
                const mouseX: number = e.clientX;
                const mouseY: number = e.clientY;



                const docFrag = range.cloneContents();
                const childSpan = docFrag.querySelectorAll("span");
                // for (let i = 0; i < childSpan.length; i++) {
                //     // console.log(childSpan[i]);

                //     // console.log(childSpan[i].style.top);
                //     // console.log(childSpan[i].style.left);
                //     console.log(childSpan[i].getClientRects());
                //     // console.log(childSpan[i].style.width);
                // }
                let boxes: BoundingBox[] = [];
                for (let i = 0; i < rects.length; i++) {
                    boxes.push({
                        page: curPage,
                        top: rects[i].top,
                        left: rects[i].left,
                        height: rects[i].height,
                        width: rects[i].width
                    })
                }
                setBoxList(boxes);
                setTextSelected(true);
                setTextPos({
                    page: curPage,
                    height: rect.height,
                    width: rect.width,
                    top: rect.top,
                    left: rect.left,
                    x: mouseX,
                    y: mouseY,
                })
                setText(selection.toString());
            }
        };
        const handleUnSelection = () => {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            setTextSelected(false);
        };

        window.addEventListener('mouseup', handleSelection);
        window.addEventListener('mousedown', handleUnSelection);

        return () => {
            window.removeEventListener('mouseup', handleSelection);
            window.removeEventListener('mousedown', handleUnSelection);

        };
    }, []);

    function renderPopover(): React.ReactElement {
        if (textPos.page === pageIndex && textSelected) {
            return (
                <div
                    style={{
                        "display": "flex",
                        "justifyContent": "center",
                        "position": "fixed",
                        "top": textPos.y + 10,
                        "left": textPos.x - 15,
                        "zIndex": 10000,
                        "background": "white",
                        "borderRadius": 8,
                        "boxShadow": "8px 8px 15px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    {/* Translate */}
                    <ActionIcon size="md" radius="md" variant="subtle"
                        onMouseDown={() => {
                        }}
                    >
                        <IconAB2 size="1.125rem" />
                    </ActionIcon>
                    {/* <Divider orientation="vertical" /> */}
                    {/* Highlight */}
                    <ActionIcon size="md" radius="md" variant="subtle"
                        onMouseDown={() => {
                            console.log("```````````highlighted``````");
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
                        }}
                    >
                        <IconHighlight size="1.125rem" />
                    </ActionIcon>
                    {/* <Divider orientation="vertical" /> */}
                    {/* Explain */}
                    <ActionIcon size="md" radius="md" variant="subtle"
                        onMouseDown={() => {

                        }}
                    >
                        <IconQuestionMark size="1.125rem" />
                    </ActionIcon>
                    {/* <Divider orientation="vertical" pt={2} pb={2}/> */}
                    {/* Copy */}
                    <CopyButton value={text} >
                        {({ copied, copy }) => (
                            <ActionIcon size="md" radius="md" variant="subtle"
                                onMouseDown={copy}>
                                <IconCopy size="1.125rem" />
                            </ActionIcon>
                        )}
                    </CopyButton>
                </div >
            );
        }
        else {
            return (
                <React.Fragment />
            )
        }
    };
    return (
        <React.Fragment>
            {renderPopover()}
        </React.Fragment>
    );
}