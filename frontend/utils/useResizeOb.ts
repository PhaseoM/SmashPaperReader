import { MutableRefObject, useEffect, useState } from 'react';

function useResizeObserver(ref: MutableRefObject<HTMLElement>) {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const resizeListener = (entries: ResizeObserverEntry[]) => {
            for (let entry of entries) {
                setWidth(entry.contentRect.width);
            }
        };

        const resizeObserver = new ResizeObserver(resizeListener);
        resizeObserver.observe(ref.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [ref.current]);

    return width;
}

export default useResizeObserver;