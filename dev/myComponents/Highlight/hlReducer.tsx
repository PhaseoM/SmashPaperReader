import React, { useState, useContext, ReducerAction } from 'react';
import * as ReactDOM from 'react-dom';
import { BoundingBoxText as Props, HLaction, hltype } from '../../types/hightlight';
import { v4 as uuidv4 } from 'uuid';


export const hlInitial: Array<Props> = [
    // {
    //     color: 'yellow',
    //     content: "",
    //     UniteBox: {
    //         page: 0,
    //         top: 150,
    //         left: 415,
    //         height: 100,
    //         width: 210,
    //     },
    //     BoxList: [
    //         {
    //             page: 0,
    //             top: 170,
    //             left: 415,
    //             height: 30,
    //             width: 110,
    //         },
    //         {
    //             page: 0,
    //             top: 421,
    //             left: 283,
    //             height: 15,
    //             width: 55,
    //         },
    //     ]
    // },
];


export default function hlReducer(boxlist: Props[], action: HLaction): Props[] {
    let oldstate = [...boxlist];
    switch (action.type) {
        case hltype.ADD: {
            console.log(action);
            oldstate.push({
                color: action.color,
                content: action.content,
                UniteBox: action.UniteBox,
                BoxList: action.BoxList
            });
            return oldstate;
        }
        case hltype.DEL: {
            return oldstate.filter((_, index) =>
                index !== action.id
            );
        }
        default: {
            console.error("hlReducer ActionTriggerError")
            return oldstate;
        }
    }
}

