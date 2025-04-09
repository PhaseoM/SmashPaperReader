import React, { useState, useContext, ReducerAction } from 'react';
import * as ReactDOM from 'react-dom';
import { BoundingBox as Props, HLaction, hltype } from '../../types/hightlight';
import { v4 as uuidv4 } from 'uuid';


export default function hlReducer(boxlist: Props[], action: HLaction): Props[] {
    let oldstate = [...boxlist];
    switch (action.type) {
        case hltype.ADD: {
            oldstate.push({
                page: action.page,
                color: action.color,
                top: action.top,
                left: action.left,
                height: action.height,
                width: action.width
            });
            return oldstate;
        }
        case hltype.DEL: {
            return oldstate.filter((item, index) =>
                index != action.id
            );

        }
        default: {
            console.error("hlReducer ActionTriggerError")
            return oldstate;
        }
    }
}

