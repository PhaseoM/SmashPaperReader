import { createContext, Context } from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface IF_NavItemContext {
    impact: number,
    lastSelectedL: number;
    lastSelectedR: number;
    itemSelectedL: number;
    itemSelectedR: number;
    setLastSelectedL: (lastSelectedL: number) => void;
    setLastSelectedR: (lastSelectedR: number) => void;
    setItemSelectedL: (itemSelectedL: number) => void;
    setItemSelectedR: (itemSelectedR: number) => void;
}

export const NavItemContext = createContext<IF_NavItemContext>({
    impact: 0,
    lastSelectedL: -1,
    lastSelectedR: -1,
    itemSelectedL: -1,
    itemSelectedR: -1,
    setLastSelectedL: () => { },
    setLastSelectedR: () => { },
    setItemSelectedL: () => { },
    setItemSelectedR: () => { },
});
