import React, { useState, useContext, useReducer } from 'react';
import * as ReactDOM from 'react-dom';
import msgReducer from './msgReducer'
import { msgList, msgAction, msgact, spid, msgState } from '../../types/msgchat';
import { v4 as uuidv4 } from 'uuid';
import { Text, Container } from '@mantine/core';

const usrid = "130";
export function msg_Usr(): msgState {
    return ({
        id: usrid,
        msgid: uuidv4(),
        select: null,
        context: "defaultContext_u",
        isloading: false
    });
}

export function msg_Ser(): msgState {
    return ({
        id: spid.serverid,
        msgid: uuidv4(),
        select: null,
        context: "defaultContext_s",
        isloading: false
    });
}

export function msg_Ser_Loading(): msgState {
    return ({
        id: spid.serverid,
        msgid: "42",
        select: null,
        context: "defaultContext_l",
        isloading: true
    });
}

export function msg_Err(): msgState {
    return ({
        id: spid.msgerror,
        msgid: "101",
        select: null,
        context: "defaultContext_e",
        isloading: false
    });
}
