import { useState, useContext, useEffect, useRef, createRef, useReducer } from 'react';
import * as ReactDOM from 'react-dom';
import { NavItemContext } from '../context/NavContext';
import { ToolPopContext } from '../context/PopoverConext';
import React from 'react';
import { AppShell, Container, Divider, Overlay, ScrollArea } from '@mantine/core';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane';
import { Allotment } from 'allotment'
import { Route, RouteComponentProps } from 'react-router-dom';

import { Navigate } from './Navigation/Navigate';
import { LeftWinVisableCtrl } from './Navigation/L_WinVisableCtrl';
import { RightWinVisableCtrl } from './Navigation/R_WinVisableCtrl';

import { Digest } from './RightWindow/Digest';

import { Reader } from '../components/Reader';
import { ContextProvider, PageNumberControl } from '@allenai/pdf-components';
import "allotment/dist/style.css";
import "../css/splitter.css"


import useWindowSize from '../utils/useWindowSize'


import { relative } from 'path';
import { PopoverUp } from './ToolPopover';
import { SimpleZoomControl } from '../components/SimpleZoomControl';

import { HLContext } from '../context/HLContext';
import hlReducer, { hlInitial } from '../myComponents/Highlight/hlReducer';
import { BoundingBoxText as BoxProp } from '../types/hightlight';
import { RefContext } from '../context/RefContext';
import { useWindowScroll } from '@mantine/hooks';
import { winSizeContext, winSizeState } from '../context/winSizeContext';


const MainPanes: React.FunctionComponent<RouteComponentProps> = (routeprops) => {
    //handle the value of w,h 
    const { width: w_win, height: h_win } = useWindowSize();
    const AppMainSelector = document.querySelector(".mantine-AppShell-main");
    // const width = AppMainSelector ? AppMainSelector.clientWidth : w_win;
    const width = AppMainSelector ? AppMainSelector.clientWidth : w_win;
    const height = AppMainSelector ? AppMainSelector.clientHeight : h_win;
    // console.log("-------")
    // console.log(AppMainSelector)
    // console.log(w_win)
    // console.log("-------")
    const [minSizeL, setMinSizeL] = useState(0);
    const [maxSizeL, setMaxSizeL] = useState(0);
    const [minSizeR, setMinSizeR] = useState(0);
    const [maxSizeR, setMaxSizeR] = useState(0);

    useEffect(() => {
        setMinSizeL(width * 0.235);
        setMaxSizeL(width * 0.4);

        setMinSizeR(width * 0.65);
        setMaxSizeR(width * 0.725);
    }, [width])

    //context
    const {
        itemSelectedL: idL, setItemSelectedL: setIdL,
        itemSelectedR: idR, setItemSelectedR: setIdR,
    } = useContext(NavItemContext);
    const { ReaderPaneRef, ToolkitRef, ReaderScrollRef } = useContext(RefContext);


    //impact
    const [imp, setImp] = useState(0);

    return (
        <SplitPane
            minSize={idL != -1 ? minSizeL : 0}
            maxSize={idL != -1 ? maxSizeL : 0}
            onDragFinished={() => {
                setImp((imp + 1) % 10);
            }}
            resizerStyle={
                idL != -1 ? {
                    cursor: 'col-resize'
                } : {
                    cursor: 'default'
                }}
        >
            <LeftWinVisableCtrl />
            <ScrollArea h={height} type='hover' scrollHideDelay={500} viewportRef={ReaderScrollRef} >
                <Reader {...routeprops} />
                <Overlay className='readerUI_Overlay'>
                    <div className='reader_PageNumberControl'>
                        <PageNumberControl />
                    </div>
                    <Divider className='readerUI_Divider' orientation="vertical" h={25} />
                    <div className='reader_ZoomControl'>
                        <SimpleZoomControl />
                    </div>
                </Overlay>
            </ScrollArea>
            <RightWinVisableCtrl />
        </SplitPane>
    );
}



export const ReaderUI: React.FunctionComponent<RouteComponentProps> = (routeprops) => {
    const [selectedIdL, setSelectedIdL] = useState(-1);
    const [selectedIdR, setSelectedIdR] = useState(-1);

    //ToolPopContext
    const [textSelected, setTextSelected] = useState(false);
    const [textPos, setTextPos] = useState({
        page: 0,
        height: 0,
        width: 0,
        top: 0,
        left: 0,
        x: 0,
        y: 0
    });
    const [text, setText] = useState("");

    const [curID, setCurID] = useState(-1);
    const [customHLcolor, setCustomHLcolor] = useState("yellow");
    const [hlList, dispatch] = useReducer(hlReducer, hlInitial);
    const [winSize, setWinSize] = useState<winSizeState>({
        leftwinSize: { w: 0, h: 0 },
    });

    const ReaderPaneRef = useRef(null);
    const ToolkitRef = useRef(null);
    const ReaderScrollRef = useRef(null);
    const InputRef = useRef(null);
    return (
        <winSizeContext.Provider value={{
            winSize: winSize,
            setWinSize: setWinSize
        }}>
            <RefContext.Provider value={{
                ReaderPaneRef: ReaderPaneRef,
                ToolkitRef: ToolkitRef,
                ReaderScrollRef: ReaderScrollRef,
                InputRef: InputRef,
            }}>
                <ToolPopContext.Provider value={{
                    textSelected: textSelected,
                    textPos: textPos,
                    text: text,
                    setTextSelected: setTextSelected,
                    setTextPos: setTextPos,
                    setText: setText,
                }}>
                    <HLContext.Provider value={{
                        curID: curID,
                        setCurID: setCurID,
                        customHLcolor: customHLcolor,
                        setCustomHLcolor: setCustomHLcolor,
                        hlList: hlList,
                        hldispatch: dispatch
                    }}>
                        <NavItemContext.Provider value={{
                            impact: 0,
                            itemSelectedL: selectedIdL, setItemSelectedL: setSelectedIdL,
                            itemSelectedR: selectedIdR, setItemSelectedR: setSelectedIdR
                        }}>
                            <ContextProvider>
                                <AppShell
                                    // layout='alt'
                                    navbar={<Navigate {...routeprops} />}
                                    padding={0}
                                >

                                    {/* <Navigate {...routeprops} /> */}
                                    {/* <SelectView isSelected={selectedId != -1} {...routeprops} /> */}
                                    <MainPanes {...routeprops} />
                                </AppShell>
                            </ContextProvider>
                        </NavItemContext.Provider>
                    </HLContext.Provider>
                </ToolPopContext.Provider>
            </RefContext.Provider >
        </winSizeContext.Provider>
    );
}
