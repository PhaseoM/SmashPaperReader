import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ToolPopContext } from '../../context/PopoverConext';
import { NoteContext } from '../../context/NoteContext';
import { ActionIcon, Button, Textarea, TextInput } from '@mantine/core';
import {
    IconCirclePlus2,
} from '@tabler/icons-react';
import { RefContext } from '../../context/RefContext';
import { HLContext } from '../../context/HLContext';

export const NoteTakingPop: React.FC = (
) => {
    const {
        notevis,
        setNotevis,
        notelist,
        notedispatch
    } = React.useContext(NoteContext);
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
    const { ReaderPaneRef, ToolkitRef, ReaderScrollRef, InputRef, NotePopRef } = React.useContext(RefContext);
    const { setCurID } = React.useContext(HLContext)
    return (
        <React.Fragment>
            {notevis ? <div ref={NotePopRef}
                style={{
                    "display": "flex",
                    "justifyContent": "center",
                    "position": "fixed",
                    "flexDirection": "column",
                    "top": textPos.y + 10,
                    "left": textPos.x - 15,
                    "zIndex": 1000000,
                    "background": "white",
                    "borderRadius": 4,
                    "boxShadow": "4px 4px 8px rgba(100, 100, 100, 0.05)",
                }}>
                <Textarea
                    placeholder="Note Content"
                    autosize
                    minRows={2}
                    maxRows={4}
                    size="xs"
                />
                <ActionIcon size="md" radius="md" variant="subtle"
                    style={{
                        bottom: "25%",
                        right: 5,
                        display: "flex",
                        position: "absolute",
                        justifySelf: "flex-end",
                        zIndex: 1,
                    }}
                    onClick={() => {
                        setCurID("-1")
                        setNotevis(false);
                    }}
                >
                    <IconCirclePlus2 size="1.125rem" />
                </ActionIcon>
            </div > : <React.Fragment />}
        </React.Fragment>
    )
}
