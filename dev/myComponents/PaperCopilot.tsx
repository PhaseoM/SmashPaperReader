import React, { useState } from 'react';
import './App.css';

function Window(props: { title: string, content: string }) {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e:HTMLDivElement) => {
        setIsDragging(true);
        setPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newX = e.clientX - position.x;
            const newY = e.clientY - position.y;
            setPosition({ x: newX, y: newY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div
            className="window"
            style={{
                position: 'absolute',
                top: position.y + 'px',
                left: position.x + 'px',
                width: '300px',
                height: '200px',
                border: '1px solid #000',
                backgroundColor: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="window-header">
                {title}
            </div>
            <div className="window-content">
                {content}
            </div>
        </div>
    );
}

function App() {
    return (
        <div className="app">
            <Window title="Window 1" content="Content 1" />
            <Window title="Window 2" content="Content 2" />
        </div>
    );
}

export default App;