import { BoundingBoxText, HLaction } from '../types/hightlight';
import { createContext, Context, createRef } from 'react';

interface HLContextElement {
    customHLcolor: string,
    setCustomHLcolor: (color: string) => void,
    hlList: BoundingBoxText[],
    hldispatch: React.Dispatch<HLaction>
}

export let HLContext = createContext<HLContextElement>({
    customHLcolor: 'yellow',
    setCustomHLcolor: () => { },
    hlList: [],
    hldispatch: () => { },
});
