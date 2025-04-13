import { BoundingBoxText, HLaction } from '../types/hightlight';
import { createContext, Context, createRef, MutableRefObject, ReactElement, createElement } from 'react';

interface RefContextElement {
    ReaderPaneRef: MutableRefObject<HTMLDivElement | null>,
    ToolkitRef: MutableRefObject<HTMLDivElement | null>,
    ReaderScrollRef: MutableRefObject<HTMLDivElement | null>,
    InputRef: MutableRefObject<HTMLTextAreaElement | null>,
}

export let RefContext = createContext<RefContextElement>({
    ReaderPaneRef: { current: null },
    ToolkitRef: { current: null },
    ReaderScrollRef: { current: null },
    InputRef: { current: null },
});
