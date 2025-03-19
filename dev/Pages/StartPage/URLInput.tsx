import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { useEffect, useRef, useState } from 'react';

export default function PaperURLInput(props: RouteComponentProps) {
    const inRef = useRef<HTMLInputElement>(null);
    let isFocus: Boolean = false;
    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (isFocus) {
            if (event.key === 'Enter')
                if (inRef.current) {
                    if (inRef.current.value) {
                        const url: string = inRef.current.value;
                        const encodeurl: string = encodeURIComponent(url);
                        props.history.push(`/reader?type=${0}&url=${encodeurl}`);
                    }
                    else {
                        // const url: string = "https://arxiv.org/pdf/2310.07581";
                        // const encodeurl: string = encodeURIComponent(url);
                        // props.history.push('/reader/' + encodeurl);
                        alert("The Paper URL is NULL, Please Enter!")
                    }
                }
                else {
                    console.error("inRef NULLError!")
                }
        }
    };
    return (
        <div>
            <input className='PaperURLInput'
                type="text"
                ref={inRef}
                placeholder='Please Enter the Paper URL'
                onKeyPress={handleKeyPress}
                onBlur={() => {
                    isFocus = false;
                }}
                onFocus={() => {
                    isFocus = true;
                }}
            />
        </div>
    );
}