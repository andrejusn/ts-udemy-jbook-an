import './resizable.css';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import { useState, useEffect } from 'react';

interface ResizableProps {
    direction: 'horizontal' | 'vertical',
    vHeight?: number;
    vHeightRegister?: (height: number) => void;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children, vHeight, vHeightRegister }) => {

    let resizableProps: ResizableBoxProps;

    const [innerHeight, setInnerHeight] = useState(window.innerHeight);
    const [innerWidth, setInnerWidth] = useState(window.innerWidth);
    const [width, setWidth] = useState(window.innerWidth * 0.75);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const listener = () => {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                setInnerHeight(window.innerHeight);
                setInnerWidth(window.innerWidth);
                if (window.innerWidth * 0.75 < width) {
                    setWidth(window.innerWidth * 0.75);
                }
            }, 100);
        };
        window.addEventListener('resize', listener);

        return () => {
            window.removeEventListener('resize', listener)
        }
    }, [width]);

    if (direction === 'horizontal') {
        resizableProps = {
            className: 'resize-horizontal',
            minConstraints: [innerWidth * 0.2, Infinity],
            maxConstraints: [innerWidth * 0.75, Infinity],
            height: Infinity,
            width,
            resizeHandles: ['e'],
            onResizeStop: (event, data) => {
                setWidth(data.size.width);
            },
        };
    } else {
        resizableProps = {
            minConstraints: [Infinity, 24],
            maxConstraints: [Infinity, innerHeight * 0.9],
            height: vHeight || 200,
            width: Infinity,
            resizeHandles: ['s'],
            className: 'v-resize',
            onResizeStop: (event, data) => {
                if (vHeightRegister) { vHeightRegister(data.size.height); }
            },
        };
    }

    return <ResizableBox {...resizableProps}>{children}</ResizableBox>
}

export default Resizable;
