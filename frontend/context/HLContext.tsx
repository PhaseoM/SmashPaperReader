import { BoundingBoxText, HLaction } from '../types/hightlight';
import { createContext, Context, createRef } from 'react';

interface HLContextElement {
    curID: string,
    customHLcolor: string,
    setCurID: (curID: string)=> void,
    setCustomHLcolor: (customHLcolor: string) => void,
    hlList: BoundingBoxText[],
    hldispatch: React.Dispatch<HLaction>
}

export let HLContext = createContext<HLContextElement>({
    curID: "-1",
    customHLcolor: 'blue',
    setCurID: () => { },
    setCustomHLcolor: () => { },
    hlList: [],
    hldispatch: () => { },
});
