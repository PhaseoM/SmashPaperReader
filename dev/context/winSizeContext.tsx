import { BoundingBoxText, HLaction } from '../types/hightlight';
import { createContext, Context, createRef, MutableRefObject, ReactElement, createElement } from 'react';

type winsizeType = {
    w: number,
    h: number
}

export type winSizeState = {
    leftwinSize: winsizeType,
};

interface winSizeContextElement {
    winSize: winSizeState,
    setWinSize: (winSize: winSizeState) => void,
}

export let winSizeContext = createContext<winSizeContextElement>({
    winSize: {
        leftwinSize: { w: 0, h: 0 },
    },
    setWinSize: () => { },
});
