import { useState, useContext, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { NavItemContext } from '../../context/NavContext';
import React from 'react';
import { AppShell, Container, ScrollArea } from '@mantine/core';
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane';
import { Allotment } from 'allotment'
import { Route, RouteComponentProps } from 'react-router-dom';

import { Navigate } from './Navigate';
import { CompVisiableControl } from './CompVisiableControl';
import { Reader } from '../../components/Reader';
import { ContextProvider } from '@allenai/pdf-components';
import "allotment/dist/style.css";
import "../../css/splitter.css"


import useWindowSize from '../../utils/useWindowSize'
import { relative } from 'path';
export const LeftUI: React.FunctionComponent<RouteComponentProps> = (routeprops) => {
    const [imp, setImp] = useState(0);
    const [selectedId, setSelectedId] = useState(-1);
    const { width, height } = useWindowSize();
    const [minSize, setMinSize] = useState(0);
    const [maxSize, setMaxSize] = useState(0);
    useEffect(() => {
        setMinSize(width * 0.3);
        setMaxSize(width * 0.6);
    }, [width])
    return (
        <NavItemContext.Provider value={{ impact: 0, itemSelected: selectedId, setItemSelected: setSelectedId }}>
            <AppShell
                // layout='alt'
                navbar={<Navigate {...routeprops} />}
                padding={0}
            >

                {/* <Navigate {...routeprops} /> */}
                {/* <SelectView isSelected={selectedId != -1} {...routeprops} /> */}
                <ContextProvider>
                    <SplitPane
                        // className='Resizer.vertical'
                        // split='vertical'
                        // defaultSize={selectedId != -1 ? 600 : 0}
                        minSize={selectedId != -1 ? minSize : 0}
                        maxSize={selectedId != -1 ? maxSize : 0}
                        // resizerClassName={selectedId != -1 ? 'vertical' : 'horizontal'}
                        // onDragFinished={() => {
                        //     setC(c + 1);
                        //     setC(c - 1);
                        // }}
                        onDragFinished={() => {
                            setImp((imp + 1) % 10);
                        }}
                        resizerStyle={
                            selectedId != -1 ? {
                                cursor: 'col-resize'
                            } : {
                                cursor: 'default'
                            }}
                    >
                        <CompVisiableControl />
                        <ScrollArea h={height} type='hover' offsetScrollbars scrollHideDelay={500} >
                            <Reader {...routeprops} />
                        </ScrollArea>
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