import React, { useState, useContext } from 'react';
import * as ReactDOM from 'react-dom';
import { NavItemContext } from '../../context/NavContext';
import useWindowSize from '../../utils/useWindowSize';
import { NoteContext } from '../../context/NoteContext';

const NoteItem: React.FC = () => {
    return (
        <div>
        </div>
    );
}

export const NoteList: React.FC = () => {
    const {
        notelist,
        notedispatch
    } = React.useContext(NoteContext);
    return (
        <div>
            this is NoteList Area.
        </div>
    );
}