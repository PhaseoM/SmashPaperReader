import { BoundingBoxText, HLaction } from '../types/hightlight';
import { createContext, Context, createRef, MutableRefObject, ReactElement, createElement } from 'react';


interface LoadingContextElement {
    rploading: boolean,
    setRploading: (rploading: boolean) => void,
}

export let LoadingContext = createContext<LoadingContextElement>({
    rploading: true,
    setRploading: () => { },
});
