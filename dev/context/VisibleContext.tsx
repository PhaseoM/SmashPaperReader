import { BoundingBoxText, HLaction } from '../types/hightlight';
import { createContext, Context, createRef, MutableRefObject, ReactElement, createElement } from 'react';


interface VisibleContextElement {
    visible: boolean,
    setVisible: (visible: boolean) => void
}

export let VisibleContext = createContext<VisibleContextElement>({
    visible: true,
    setVisible: () => { },
});
