import { Reader } from '../../components/Reader';
import { ContextProvider } from '@allenai/pdf-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { Navigate } from '../../myComponents/Navigate';
import { AppShell } from '@mantine/core';

export const SmashPaperReader: React.FunctionComponent<RouteComponentProps> = (props) => {
    return (
        <div>
            <AppShell>
                < Navigate />
                {() => {
                    switch (props) {
                        case null:
                            return <></>
                        default:
                            return null
                    }
                }
                }


                <ContextProvider>
                    <Reader {...props} />
                </ContextProvider>
            </AppShell>
        </div>
    );
};
