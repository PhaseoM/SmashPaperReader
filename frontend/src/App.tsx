import * as React from 'react';
import * as ReactDOM from 'react-dom';
import IndexOfPage from '../Pages/IndexRouter'
import { MantineProvider } from '@mantine/core';
import useWindowSize from '../utils/useWindowSize';
import { LoginContext } from '../context/LoginContext'
import { useState } from 'react';




export default function App() {
    const [isLogin, setIsLogin] = useState(false);
    return (
        <LoginContext.Provider value={{
            isLogin: isLogin,
            setIsLogin: setIsLogin
        }}>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <IndexOfPage />
            </MantineProvider>
        </LoginContext.Provider >
    )
}
