import React, { useState, useContext } from 'react';
import * as ReactDOM from 'react-dom';
import { NavItemContext } from '../../context/NavContext';
import { AppShell, ScrollArea } from '@mantine/core';

import { Navigate } from './Navigate'
import { ThumbnailList } from '@allenai/pdf-components';
import { Outline } from '@allenai/pdf-components';

import PaperCopilot from '../LeftWindow/PaperCopilot';
import useWindowSize from '../../utils/useWindowSize';
import { Digest } from '../RightWindow/Digest';
import { NoteList } from '../RightWindow/NoteList';

type winProps = {
    w: number,
}

export const RightWinVisableCtrl: React.FC<winProps> = ({ w }: winProps) => {
    const { width, height } = useWindowSize();
    const [loading, setLoading] = useState(false)
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
                    <Digest w={w} isloading={loading} />
                );
            case 1:
                return (
                    <NoteList />
                );
            default: {
                console.error("unexpected itemID");
                return null;
            }
        }
    }
}