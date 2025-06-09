import { noteState, noteAction, noteActionType } from '../types/notetaking';
import { createContext, Context, createRef } from 'react';

interface NoteContextElement {
    notevis: boolean,
    setNotevis: (notevis: boolean) => void,
    notelist: noteState[],
    notedispatch: React.Dispatch<noteAction>
}

export let NoteContext = createContext<NoteContextElement>({
    notevis: false,
    setNotevis: () => { },
    notelist: [],
    notedispatch: () => { },
});
