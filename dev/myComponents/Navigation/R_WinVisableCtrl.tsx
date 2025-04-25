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
import { Digest } from '../RightWindow/Digest';
import { HighlightList } from '../RightWindow/HighlightList';

type winProps = {
    w: number,
}

export const RightWinVisableCtrl: React.FC<winProps> = ({ w }: winProps) => {
    const { width, height } = useWindowSize();
    const {
        itemSelectedL: idL, setItemSelectedL: setIdL,
        itemSelectedR: idR, setItemSelectedR: setIdR,
    } = useContext(NavItemContext);
    if (idR === -1) {
        return <React.Fragment />;
    }
    else {
        switch (idR) {
            case 0:
                return (
                    <Digest w={w} />
                );
            case 1:
                return (
                    <HighlightList />
                );
            default: {
                console.error("unexpected itemID");
                return null;
            }
        }
    }
}