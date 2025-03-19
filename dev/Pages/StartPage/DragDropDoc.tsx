import { DropDownProps } from 'antd';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';


export default function DragLocalDoc(prop: RouteComponentProps) {
    // const [fileName, setFileName] = useState<string>('');
    const dragRef = useRef<HTMLFormElement>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isDroped, SetIsDroped] = useState<boolean>(false);
    //*WfoP
    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(true);
        // console.log("dragging");
    };
    const handleDragleave = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
    };
    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        const files = event.dataTransfer.files;
        
        if (files.length >0) {
            const file = files[0];

            const reader = new FileReader();
            reader.onload = (e) => {
                const pdfData = e.target?.result as ArrayBuffer; 
                const blob = new Blob([pdfData], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                window.open(url, '_blank');
            };
            reader.readAsArrayBuffer(file);
        }
        // console.log("Drop");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div>
            <div className='DragPrompt'>
                Drop your PaperDocument to Here:
            </div>
            <form
                className={`DragDocBox ${isDragging ? 'dragging' : ''}`}
                onSubmit={handleSubmit}
                ref={dragRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragleave}
                onDrop={handleDrop}
            >
                <div className='DragContext' />
                {/* <div className='DragDropInput'/> */}
            </form>
        </div>
    );
}
