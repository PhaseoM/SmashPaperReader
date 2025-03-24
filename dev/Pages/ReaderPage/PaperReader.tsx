import { Reader } from '../../components/Reader';
import { ContextProvider } from '@allenai/pdf-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { Navigate } from '../../myComponents/LeftWindow/Navigate';
import { AppShell } from '@mantine/core';
import { LeftUI } from '../../myComponents/LeftWindow/LeftUI'

export const SmashPaperReader: React.FunctionComponent<RouteComponentProps> = (props) => {
    return (
        < LeftUI {...props} />
    );
};
