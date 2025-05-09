import React, { useState, useContext } from 'react';
import * as ReactDOM from 'react-dom';
import { NavItemContext } from '../../context/NavContext';
import { AppShell, ScrollArea } from '@mantine/core';

import { Navigate } from './Navigate'
import { Thumbnail } from '../../components/Thumbnail';
import { ThumbnailList } from '@allenai/pdf-components';
import { Outline } from '@allenai/pdf-components';

import PaperCopilot from '../LeftWindow/PaperCopilot';
import useWindowSize from '../../utils/useWindowSize';



export const LeftWinVisableCtrl = () => {
    const { width, height } = useWindowSize();
    const {
        itemSelectedL: idL, setItemSelectedL: setIdL,
        itemSelectedR: idR, setItemSelectedR: setIdR,
    } = useContext(NavItemContext);
    if (idL === -1) {
        return null;
    }
    else {
        switch (idL) {
            case 0:
                return (
                    <div className="reader__outline-drawer">
                        <ScrollArea
                            h={height}
                            type='hover'
                            // offsetScrollbars
                            scrollHideDelay={500}
                            scrollbarSize={6}>
                            <Outline />;
                        </ScrollArea>
                    </div>
                );
            case 1:
                return (
                    <div className="reader__outline-drawer">
                        <ScrollArea
                            h={height}
                            type='hover'
                            scrollHideDelay={500}
                            scrollbarSize={6}>
                            <ThumbnailList />;
                        </ScrollArea>
                    </div >
                );
            case 2: {
                return (
                    <PaperCopilot />
                );
            }
            default: {
                console.error("unexpected itemID");
                return null;
            }
        }
    }
}