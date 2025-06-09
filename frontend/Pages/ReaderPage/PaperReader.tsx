import { Reader } from '../../components/PdfRender/Reader';
import { ContextProvider } from '@allenai/pdf-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { Navigate } from '../../components/Navigation/Navigate';
import { AppShell } from '@mantine/core';
import { ReaderUI } from '../../components/ReaderUI'

export const SmashPaperReader: React.FunctionComponent<RouteComponentProps> = (props) => {
    return (
        < ReaderUI {...props} />
    );
};
