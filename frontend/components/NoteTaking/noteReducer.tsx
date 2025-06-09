import React, { useState, useContext, ReducerAction } from 'react';
import * as ReactDOM from 'react-dom';
import { noteState, noteAction, noteActionType } from '../../types/notetaking';
import { v4 as uuidv4 } from 'uuid';


export const noteInitial: Array<noteState> = [

];


export default function noteReducer(notelist: noteState[], action: noteAction): noteState[] {
    let oldstate = [...notelist]
    switch (action.type) {
        case noteActionType.add: {
            oldstate.push({
                noteid: action.noteid,
                bboxid: action.bboxid,
                context: action.context,
                content: action.content,
            });
            return oldstate;
        }
        case noteActionType.del: {
            return oldstate.filter(item =>
                item.noteid !== action.noteid
            );
        }
        case noteActionType.modify: {
            oldstate.forEach(item => {
                if (item.noteid === action.noteid) {
                    item.content = action.content
                }
            });
            return oldstate
        }
        default: {
            console.error("ntReducer ActionTriggerError")
            return oldstate;
        }
    }
}

