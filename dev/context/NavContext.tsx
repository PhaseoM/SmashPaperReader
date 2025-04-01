import { createContext, Context } from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface IF_NavItemContext {
    impact: number,
    itemSelectedL: number;
    itemSelectedR: number;
    setItemSelectedL: (itemSelectedL: number) => void;
    setItemSelectedR: (itemSelectedR: number) => void;
}

export const NavItemContext = createContext<IF_NavItemContext>({
    impact: 0,
    itemSelectedL: -1,
    itemSelectedR: -1,
    setItemSelectedL: () => { },
    setItemSelectedR: () => { }
});
