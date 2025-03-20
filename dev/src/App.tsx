import * as React from 'react';
import * as ReactDOM from 'react-dom';
import IndexOfPage from '../Pages/IndexRouter'
import { MantineProvider } from '@mantine/core';

export default function App() {
    return (
        <div>
            <MantineProvider withGlobalStyles withNormalizeCSS>
                <IndexOfPage />
            </MantineProvider>
        </div>
    )
}
