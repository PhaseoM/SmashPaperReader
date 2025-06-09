import { DropDownProps } from 'antd';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { loadPDF_send } from '../../components/socketio';


export default function DragLocalDoc(props: RouteComponentProps) {
    // const [fileName, setFileName] = useState<string>('');
    const dragRef = useRef<HTMLFormElement>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isDroped, SetIsDroped] = useState<boolean>(false);
    //*WfoP
    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(true);
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
        handleSubmit(files)
    };

    const handleClick = (event: React.FormEvent) => {
        event.preventDefault();

    };

    const handleSubmit = (files: FileList) => {
        if (files.length > 0) {
            const file = files[0];
            if (file.type !== 'application/pdf') {
                alert("Please upload a valid PDF file.");
                return;
            }
            const formData = new FormData();
            formData.append('file', file);

            const reader = new FileReader();
            reader.onload = (e) => {
                const pdfData = e.target?.result as ArrayBuffer;
                const blob = new Blob([pdfData], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);

                const targetPageUrl = `/reader?type=${1}&url=${encodeURIComponent(url)}`;
                loadPDF_send({ type: 1, data: { filename: file.name, file: file } });
                props.history.push(targetPageUrl);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div>
            <div className='DragPrompt'>
                Drop your PaperDocument to Here:
            </div>
            <form
                className={`DragDocBox ${isDragging ? 'dragging' : ''}`}
                ref={dragRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragleave}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <div className='DragContent' />
                {/* <div className='DragDropInput'/> */}
            </form>
        </div>
    );
}
