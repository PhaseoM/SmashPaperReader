import { BoundingBox } from '@allenai/pdf-components/src/components/types/boundingBox';
import { createContext, Context, createRef } from 'react';

type mousePosition = {
    x: number,
    y: number,
}
type PosProps = BoundingBox & mousePosition;


interface ToolPopContextElement {
    textSelected: boolean;
    textPos: PosProps;
    text: string;
    scrolltop: number;
    setTextSelected: (textSelected: boolean) => void;
    setTextPos: (textPos: PosProps) => void;
    setText: (text: string) => void;
    setScrolltop: (texscrolltopt: number) => void;
}

export let ToolPopContext = createContext<ToolPopContextElement>({
    textSelected: false,
    textPos: {
        page: 0,
        height: 0,
        width: 0,
        top: 0,
        left: 0,
        x: 0,
        y: 0
    },
    text: "",
    scrolltop: 0,
    setTextSelected: () => { },
    setTextPos: () => { },
    setText: () => { },
    setScrolltop: () => { }
});
