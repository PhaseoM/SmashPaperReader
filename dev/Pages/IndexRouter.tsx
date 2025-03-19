import { ContextProvider } from '@allenai/pdf-components';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { SmashPaperReader } from './PaperReader';
import { StartPage } from './StartPage/Start'
import NotFound from './NotFoundPage';

export default function IndexOfPage() {
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    <Route path="/start" component={StartPage} />
                    <Route path="/reader" component={SmashPaperReader} />
                    <Redirect from="/" to="/start" exact />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </div>
    );
};
