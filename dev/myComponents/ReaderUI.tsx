import { useState, useContext, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { NavItemContext } from '../context/NavContext';
import React from 'react';
import { AppShell, Container, ScrollArea } from '@mantine/core';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane';
import { Allotment } from 'allotment'
import { Route, RouteComponentProps } from 'react-router-dom';

import { Navigate } from './Navigation/Navigate';
import { CompVisiableControl } from './Navigation/CompVisiableControl';

import { Digest } from './RightWindow/Digest';

import { Reader } from '../components/Reader';
import { ContextProvider } from '@allenai/pdf-components';
import "allotment/dist/style.css";
import "../css/splitter.css"


import useWindowSize from '../utils/useWindowSize'


import { relative } from 'path';
export const ReaderUI: React.FunctionComponent<RouteComponentProps> = (routeprops) => {
    const [imp, setImp] = useState(0);
    const [selectedIdL, setSelectedIdL] = useState(-1);
    const [selectedIdR, setSelectedIdR] = useState(-1);
    const { width, height } = useWindowSize();


    const [minSizeL, setMinSizeL] = useState(0);
    const [maxSizeL, setMaxSizeL] = useState(0);
    const [minSizeR, setMinSizeR] = useState(0);
    const [maxSizeR, setMaxSizeR] = useState(0);
    useEffect(() => {
        setMinSizeL(width * 0.235);
        setMaxSizeL(width * 0.425);

        setMinSizeR(width * 0.65);
        setMaxSizeR(width * 0.725);
    }, [width])
    return (
        <NavItemContext.Provider value={{
            impact: 0,
            itemSelectedL: selectedIdL, setItemSelectedL: setSelectedIdL,
            itemSelectedR: selectedIdR, setItemSelectedR: setSelectedIdR
        }}>
            <AppShell
                // layout='alt'
                navbar={<Navigate {...routeprops} />}
                padding={0}
            >

                {/* <Navigate {...routeprops} /> */}
                {/* <SelectView isSelected={selectedId != -1} {...routeprops} /> */}
                <ContextProvider>
                    <SplitPane
                        defaultSize={selectedIdR != -1 ? maxSizeR : width}
                        minSize={selectedIdR != -1 ? minSizeR : width}
                        maxSize={selectedIdR != -1 ? maxSizeR : width}
                        resizerStyle={
                            selectedIdR != -1 ? {
                                cursor: 'col-resize'
                            } : {
                                cursor: 'default'
                            }}
                    >
                        <SplitPane
                            // className='Resizer.vertical'
                            // split='vertical'
                            defaultSize={selectedIdL != -1 ? minSizeL : 0}
                            minSize={selectedIdL != -1 ? minSizeL : 0}
                            maxSize={selectedIdL != -1 ? maxSizeL : 0}

                            // resizerClassName={selectedId != -1 ? 'vertical' : 'horizontal'}
                            // onDragFinished={() => {
                            //     setC(c + 1);
                            //     setC(c - 1);
                            // }}
                            onDragFinished={() => {
                                setImp((imp + 1) % 10);
                            }}
                            resizerStyle={
                                selectedIdL != -1 ? {
                                    cursor: 'col-resize'
                                } : {
                                    cursor: 'default'
                                }}
                        >
                            <CompVisiableControl />
                            <ScrollArea h={height} type='hover' scrollHideDelay={500} >
                                <Reader {...routeprops} />
                            </ScrollArea>
                            {/* <Pane/> */}
                        </SplitPane>
                        {selectedIdR != -1 ?
                            <div>
                                <ScrollArea h={height} type='hover' offsetScrollbars scrollHideDelay={500} >
                                    <Digest />
                                </ScrollArea>
                            </div>
                            : null}
                    </SplitPane>
                </ContextProvider>
            </AppShell>
        </NavItemContext.Provider>
    );
}
interface SelectViewProps extends RouteComponentProps {
    isSelected: boolean
}

function SelectView({ isSelected, ...routeprops }: SelectViewProps) {
    return (
        <React.Fragment>
            <Splitter isSelected={isSelected} {...routeprops} />
            {/* <Myallo isSelected={isSelected} {...routeprops} /> */}
        </React.Fragment>
    );

}

function Splitter({ isSelected, ...routeprops }: SelectViewProps) {
    return (
        <SplitPane
            // className='Resizer.vertical'
            split='vertical'
            minSize={isSelected ? 600 : 0}
            maxSize={isSelected ? 1000 : 0}
        >
            <CompVisiableControl />
            <ContextProvider>
                <Reader {...routeprops} />
            </ContextProvider>
        </SplitPane>
    );
}



function Myallo({ isSelected, ...routeprops }: SelectViewProps) {
    return (
        <Allotment
            className='split-view-vertical'
            vertical={true}
        >
            <div>
                <CompVisiableControl />
            </div>
            <div>
                <ContextProvider>
                    <Reader {...routeprops} />
                </ContextProvider>
            </div>
        </Allotment>
    );
}