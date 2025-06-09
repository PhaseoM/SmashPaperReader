import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { SmashPaperReader } from './ReaderPage/PaperReader';
import { StartPage } from './StartPage/Start'
import { NotFound } from './NotFoundPage/NotFoundPage';
import { LoginPage } from './LoginPage/Login';
import { LoginContext } from '../context/LoginContext';
import { useContext } from 'react';

export default function IndexOfPage() {
    const { isLogin, setIsLogin } = useContext(LoginContext);
    setIsLogin(false);
    return (
        <div>
            <BrowserRouter>
                <Switch>
                    {/* {isLogin ? null : <Redirect to="/login" />} */}
                    <Route path="/login" component={LoginPage} />
                    <Route path="/start" component={StartPage} />
                    <Route path="/reader" component={SmashPaperReader} />
                    <Redirect from="/" to="/start" exact />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </div>
    );
};
