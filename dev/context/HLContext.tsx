import { BoundingBoxText, HLaction } from '../types/hightlight';
import { createContext, Context, createRef } from 'react';

interface HLContextElement {
    curID: number,
    customHLcolor: string,
    setCurID: (curID: number) => void,
    setCustomHLcolor: (customHLcolor: string) => void,
    hlList: BoundingBoxText[],
    hldispatch: React.Dispatch<HLaction>
}

export let HLContext = createContext<HLContextElement>({
    curID: -1,
    customHLcolor: 'blue',
    setCurID: () => { },
    setCustomHLcolor: () => { },
    hlList: [],
    hldispatch: () => { },
});
