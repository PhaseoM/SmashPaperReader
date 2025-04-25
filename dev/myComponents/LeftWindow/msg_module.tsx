import React, { useState, useContext, useReducer } from 'react';
import * as ReactDOM from 'react-dom';
import msgReducer from './msgReducer'
import { msgList, msgAction, msgact, spid, msgState } from '../../types/msgchat';
import { Text, Container } from '@mantine/core';

const usrid = "130";

let messageID: number = 0;

function getID(): string {
    return `ModuleID-${messageID++}`;
}


export const state_Send: msgState = {
    id: usrid,
    msgid: getID() + "-send",
    select: null,
    context: "defaultContext_u",
    isloading: false,
    HintList:[],
};

export const state_Receive: msgState = {
    id: spid.serverid,
    msgid: getID() + "-Receive",
    select: null,
    context: "defaultContext_s",
    isloading: false,
    HintList:[],

};

export const state_Ser_Loading: msgState = {
    id: spid.serverid,
    msgid: "42",
    select: null,
    context: "defaultContext_l",
    isloading: true,
    HintList:[],
};

export const state_Err: msgState = {
    id: spid.msgerror,
    msgid: "101",
    select: null,
    context: "defaultContext_e",
    isloading: false,
    HintList:[],
};


export const action_Send: msgAction = {
    type: msgact.USER_SEND,
    id: usrid,
    msgid: getID() + "-send",
    select: null,
    context: "defaultContext_u",
    HintList:[],
};

export const action_Receive: msgAction = {
    type: msgact.AI_SEND_NORMAL,
    id: spid.serverid,
    msgid: getID() + "-Receive",
    select: null,
    context: "defaultContext_s",
    HintList:[],
};

export const action_Ser_Loading: msgAction = {
    type: msgact.ADD_LOADING,
    id: spid.serverid,
    msgid: "42",
    select: null,
    context: "defaultContext_l",
    HintList:[],
};

// export const action_Err: msgAction = {
//     type:msgact.error
//     id: spid.msgerror,
//     msgid: "101",
//     select: null,
//     context: "defaultContext_e",
// };