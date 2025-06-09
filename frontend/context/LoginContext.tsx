import { createContext, Context, createRef } from 'react';

interface LoginContextElement {
    isLogin: boolean,
    setIsLogin: (isLogin: boolean) => void,
}

export let LoginContext = createContext<LoginContextElement>({
    isLogin: false,
    setIsLogin: () => { },
});
