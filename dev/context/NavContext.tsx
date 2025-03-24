import { createContext, Context } from 'react';
import { RouteComponentProps } from 'react-router-dom';

interface IF_NavItemContext {
    impact: number,
    itemSelected: number;
    setItemSelected: (itemSelected: number) => void;
}

export const NavItemContext = createContext<IF_NavItemContext>({
    impact: 0,
    itemSelected: -1,
    setItemSelected: () => { }
});
