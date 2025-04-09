import { useDisclosure } from '@mantine/hooks';
import { Popover, Text, Button } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { ToolPopContext } from '../context/PopoverConext';
import { PageToAnnotationsMap } from '../types/annotations';
import { DocumentContext, PageRenderContext } from '@allenai/pdf-components'


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

    useEffect(() => {
        const handleSelection = (e: MouseEvent) => {
            e.preventDefault();
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0 && selection.toString() != "") {
                const range = selection.getRangeAt(0);
                const pNode = range.startContainer.parentNode as HTMLElement;
                const gpNode = pNode?.parentNode?.parentNode as HTMLElement;
                const pageNumber = gpNode?.getAttribute('data-page-number');

                const rect = range.getBoundingClientRect();
                const mouseX: number = e.clientX;
                const mouseY: number = e.clientY;
                setTextSelected(true);
                setTextPos({
                    page: parseInt(pageNumber === null ? "" : pageNumber) - 1,
                    height: rect.height,
                    width: rect.width,
                    top: rect.top,
                    left: rect.left,
                    x: mouseX,
                    y: mouseY,
                })
                setText(selection.toString());
                // console.log(`****${selection.rangeCount}********`)
                // console.log(`****${selection.toString()}********`)
                // console.log(`****${rect.top}*****${rect.left}***`)
                // console.log(`****${rect.bottom}*****${rect.right}***`)
                // console.log(`****${mouseX}*****${mouseY}***`)
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
                        "position": "fixed",
                        "top": textPos.y + 10,
                        "left": textPos.x - 15,
                        "zIndex": 10000
                    }}
                >
                    <Button
                        onMouseDown={() => {
                        }}

                    >Highlight</Button>
                    <Button
                        onMouseDown={() => {
                        }}
                    >translate</Button>
                    <Button
                        onMouseDown={() => {
                        }}
                    >explain</Button>
                    <Button
                        onMouseDown={() => {
                        }}
                    >copy</Button>
                    <Button
                        onMouseDown={() => {
                        }}
                    >select</Button>
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