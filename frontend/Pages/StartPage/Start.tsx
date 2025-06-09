import { DropDownProps } from 'antd';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { BrowserRouter, Route, useHistory } from 'react-router-dom';

import PaperURLInput from './URLInput';
import DragLocalDoc from './DragDropDoc';

export const StartPage: React.FunctionComponent<RouteComponentProps> = (props) => {
    return (
        <div>
            <div className='startTitle'>
                Read paper with Paper Copilot
            </div>
            <PaperURLInput {...props} />
            <DragLocalDoc {...props} />
        </div >
    )
}

