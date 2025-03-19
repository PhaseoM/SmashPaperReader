import { ContextProvider } from '@allenai/pdf-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';


import { Reader } from '../components/Reader';


export const SmashPaperReader: React.FunctionComponent<RouteComponentProps> = (props) => {
    return (
        <ContextProvider>
            <Reader {...props} />
        </ContextProvider>
    );
};
