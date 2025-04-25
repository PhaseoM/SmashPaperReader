import { useState, useContext, useEffect, useRef, createRef, useReducer, useMemo, MutableRefObject } from 'react';
import * as ReactDOM from 'react-dom';
import { NavItemContext } from '../context/NavContext';
import { ToolPopContext } from '../context/PopoverConext';
import React from 'react';
import { ActionIcon, AppShell, Button, ColorSwatch, Container, Divider, Menu, Overlay, ScrollArea, useMantineTheme } from '@mantine/core';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane';
import { Allotment, LayoutPriority } from 'allotment'
import "../node_modules/allotment/dist/style.css";
import { Route, RouteComponentProps } from 'react-router-dom';

import { Navigate } from './Navigation/Navigate';
import { LeftWinVisableCtrl } from './Navigation/L_WinVisableCtrl';
import { RightWinVisableCtrl } from './Navigation/R_WinVisableCtrl';

import { Digest } from './RightWindow/Digest';

import { Reader } from '../components/Reader';
import { ContextProvider, DocumentContext, PageNumberControl, TransformContext } from '@allenai/pdf-components';
import "../css/splitter.css"

import useWindowSize from '../utils/useWindowSize'


import { relative } from 'path';
import { PopoverUp } from './ToolPopover';
import { SimpleZoomControl } from '../components/SimpleZoomControl';

import { HLContext } from '../context/HLContext';
import hlReducer, { hlInitial } from '../myComponents/Highlight/hlReducer';
import { BoundingBoxText as BoxProp } from '../types/hightlight';
import { RefContext } from '../context/RefContext';
import { useResizeObserver, useWindowScroll } from '@mantine/hooks';
import { winSizeContext, winSizeState } from '../context/winSizeContext';
import msgReducer, { msginitiallist } from './LeftWindow/msgReducer';
import { PcContext } from '../context/PcContext';
import { RobContext } from '../context/RobContext';
import { IconAdjustments, IconSettings } from '@tabler/icons-react';
import { HighLightColors, HighLightColorsMap } from './Highlight/myBoundingBox';
import { VisibleContext } from '../context/VisibleContext';


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
        setMinSizeL(width * 0.225);
        setMaxSizeL(width * 0.4);

        setMinSizeR(width * 0.65);
        setMaxSizeR(width * 0.725);
    }, [width])


    const {
        textSelected,
        textPos,
        text,
        scrolltop,
        setTextSelected,
        setTextPos,
        setText,
        setScrolltop,
    } = React.useContext(ToolPopContext);
    const { visible, setVisible } = useContext(VisibleContext);
    function handleScrollend() {
        const st = ReaderScrollRef.current?.scrollTop;
        setScrolltop(st ? st : 0);
    }
    function handleScroll() {
        setVisible(false);
    }
    useEffect(() => {
        if (ReaderScrollRef.current) {
            ReaderScrollRef.current.addEventListener('scrollend', handleScrollend);
            ReaderScrollRef.current.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (ReaderScrollRef.current) {
                ReaderScrollRef.current.removeEventListener('scrollend', handleScrollend);
                ReaderScrollRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [])


    //context
    const {
        lastSelectedL: lastidL, lastSelectedR: lastidR,
        itemSelectedL: idL, setItemSelectedL: setIdL,
        itemSelectedR: idR, setItemSelectedR: setIdR,
    } = useContext(NavItemContext);
    const { ReaderPaneRef, ToolkitRef, ReaderScrollRef } = useContext(RefContext);
    const { curID, setCurID, customHLcolor, setCustomHLcolor, hlList, hldispatch } = useContext(HLContext)


    const [opened, setOpened] = useState(false);
    const swatches = Object.entries(HighLightColorsMap).map(([key, value]) => (
        <ActionIcon onClick={() => {
            setCustomHLcolor(key);
            setOpened(false);
        }}>
            <ColorSwatch key={key} color={value} size={14} />
        </ActionIcon>
    ));
    //impact
    const [imp, setImp] = useState(0);


    //bar_left_value
    const { pageDimensions } = useContext(DocumentContext);
    const { rotation, scale } = React.useContext(TransformContext);
    const { width: w, height: h } = useWindowSize();
    const rightwin = document.getElementById("right-win-ctrl");
    const rightwin_w = rightwin?.clientWidth;
    const Reader_w = ReaderPaneRef.current ? ReaderPaneRef.current.offsetWidth : w;
    const { ReaderRob } = useContext(RobContext);
    const paddingleft = 15;
    const pageright = (ReaderRob.rect.width + pageDimensions.width * scale) / 2 + paddingleft;
    // const pageright = useMemo(() => {
    //     return (Reader_w + pageDimensions.width * scale) / 2 + paddingleft;
    // }, [ReaderPaneRef.current?.offsetWidth, scale]);
    console.log(pageright);
    // console.log((Reader_w + pageDimensions.width * scale) / 2 + paddingleft);
    return (
        <Allotment
            onDragEnd={() => {
                setImp(1 - imp);
            }}
            onVisibleChange={(index, visible) => {
                if (visible === false) {
                    if (index === 0) {
                        setIdL(-1);
                    }
                    else if (index === 2) {
                        setIdR(-1);
                    }
                }
                else {
                    // console.log(`index:${index} visible:${visible}`)
                    if (index === 0) {
                        // console.log("*lastL:" + lastidL);
                        setIdL(2);
                    }
                    else if (index === 2) {
                        setIdR(0);
                    }
                }
            }}
        >
            <Allotment.Pane
                preferredSize={minSizeL}
                minSize={minSizeL - 1}
                maxSize={idR === -1 ? maxSizeL : minSizeL}
                visible={idL != -1 ? true : false}
                snap
            >
                <LeftWinVisableCtrl />
            </Allotment.Pane>
            <Allotment.Pane>
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
                    <div className='reader_right_bar'
                        style={{
                            left: pageright,
                        }}>
                        <Menu opened={opened}>
                            <Menu.Target>
                                <ActionIcon onClick={() => {
                                    setOpened(!opened)
                                }}>
                                    {/* <IconAdjustments size="1rem" /> */}
                                    <ColorSwatch key={customHLcolor} color={HighLightColorsMap[customHLcolor]} size={14} />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                {swatches}
                            </Menu.Dropdown>
                        </Menu>
                    </div>
                </ScrollArea>
            </Allotment.Pane>
            {idR === -1 ? null :
                <Allotment.Pane
                    minSize={minSizeL}
                    maxSize={minSizeL}
                    visible={idR != -1 ? true : false}
                >
                    <div id="right-win-ctrl">
                        <RightWinVisableCtrl w={minSizeL} />
                    </div>
                </Allotment.Pane>
            }
        </Allotment>
    );
}



export const ReaderUI: React.FunctionComponent<RouteComponentProps> = (routeprops) => {
    const [selectedIdL, setSelectedIdL] = useState(-1);
    const [selectedIdR, setSelectedIdR] = useState(-1);
    const [lastidL, setLastidL] = useState(-1);
    const [lastidR, setLastidR] = useState(-1);

    //ToolPopContext
    const [textSelected, setTextSelected] = useState(false);
    const [scrolltop, setScrolltop] = useState(0);
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
    const [customHLcolor, setCustomHLcolor] = useState("blue");
    const [hlList, hldispatch] = useReducer(hlReducer, hlInitial);
    const [msglist, msgdispatch] = useReducer(msgReducer, msginitiallist);
    const [winSize, setWinSize] = useState<winSizeState>({
        leftwinSize: { w: 0, h: 0 },
    });

    const ToolkitRef = useRef(null);
    const ReaderScrollRef = useRef(null);
    const InputRef = useRef(null);
    const ViewportRef = useRef(null);

    const [ReaderPaneRef, ReaderPaneRef_rect] = useResizeObserver<HTMLDivElement>();

    const [visible, setVisible] = useState(true);
    return (
        <VisibleContext.Provider value={{
            visible: visible,
            setVisible: setVisible,
        }}>
            <RobContext.Provider value={{
                ReaderRob: {
                    ref: ReaderPaneRef,
                    rect: ReaderPaneRef_rect
                }
            }}>
                <winSizeContext.Provider value={{
                    winSize: winSize,
                    setWinSize: setWinSize
                }}>
                    <RefContext.Provider value={{
                        ReaderPaneRef: ReaderPaneRef,
                        ToolkitRef: ToolkitRef,
                        ReaderScrollRef: ReaderScrollRef,
                        InputRef: InputRef,
                        ViewportRef: ViewportRef,
                    }}>
                        <ToolPopContext.Provider value={{
                            textSelected: textSelected,
                            textPos: textPos,
                            text: text,
                            scrolltop: scrolltop,
                            setTextSelected: setTextSelected,
                            setTextPos: setTextPos,
                            setText: setText,
                            setScrolltop: setScrolltop,
                        }}>
                            <HLContext.Provider value={{
                                curID: curID,
                                setCurID: setCurID,
                                customHLcolor: customHLcolor,
                                setCustomHLcolor: setCustomHLcolor,
                                hlList: hlList,
                                hldispatch: hldispatch,
                            }}>
                                <PcContext.Provider value={{
                                    msglist: msglist,
                                    msgdispatch: msgdispatch
                                }}>
                                    <NavItemContext.Provider value={{
                                        impact: 0,
                                        itemSelectedL: selectedIdL, setItemSelectedL: setSelectedIdL,
                                        itemSelectedR: selectedIdR, setItemSelectedR: setSelectedIdR,
                                        lastSelectedL: lastidL, setLastSelectedL: setLastidL,
                                        lastSelectedR: lastidR, setLastSelectedR: setLastidR,
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
                                </PcContext.Provider>
                            </HLContext.Provider>
                        </ToolPopContext.Provider>
                    </RefContext.Provider >
                </winSizeContext.Provider>
            </RobContext.Provider>
        </VisibleContext.Provider>
    );
}
