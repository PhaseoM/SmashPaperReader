import { BoundingBoxText, HLaction } from '../types/hightlight';
import { createContext, Context, createRef, MutableRefObject, ReactElement, createElement } from 'react';

type RobType<T> = {
    ref: MutableRefObject<T | null>;
    rect: {
        x: number;
        y: number;
        top: number;
        left: number;
        right: number;
        bottom: number;
        height: number;
        width: number;
    }
}

const initialVal: RobType<HTMLDivElement> = {
    ref: { current: null },
    rect: {
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: 0,
        width: 0,
    }
}

interface RobContextElement {
    ReaderRob: RobType<HTMLDivElement>,
}

export let RobContext = createContext<RobContextElement>({
    ReaderRob: initialVal,
});
