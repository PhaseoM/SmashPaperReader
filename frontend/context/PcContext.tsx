import { BoundingBoxText, HLaction } from '../types/hightlight';
import { createContext, Context, createRef } from 'react';
import { msgAction, msgList } from '../types/msgchat';

interface PcContextElement {
    msglist: msgList,
    msgdispatch: React.Dispatch<msgAction>,
}

export let PcContext = createContext<PcContextElement>({
    msglist: [],
    msgdispatch: () => { },
});
