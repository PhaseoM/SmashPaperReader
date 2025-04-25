import classNames from 'classnames';
import * as React from 'react';

import { DocumentContext } from '@allenai/pdf-components';
import { TransformContext } from '@allenai/pdf-components';
import { computeBoundingBoxStyle } from '@allenai/pdf-components';
import { BoundingBoxType } from '@allenai/pdf-components';
import { useContext } from 'react';
import { HLContext } from '../../context/HLContext';
import { ToolPopContext } from '../../context/PopoverConext';

export type Props = {
    className?: string;
    underlineClassName?: string;
    color?: string;
    id?: string;
    parentid?: number;
    content?: string;
    isHighlighted?: boolean;
    onClick?: () => void;
    voiceOverLabel?: string;
} & BoundingBoxType;

export const enum HighLightColors {
    blue = '#cfe0ff',
    yellow = '#fffd70',
    red = '#ff9189',
    purple = '#e8d0ff',
    green = '#c1ffa9',
    pink = '#ffc2e4'
};

export const HighLightColorsMap: { [key: string]: string } = {
    blue: '#cfe0ff',
    yellow: '#fffd70',
    red: '#ffb5b5',
    purple: '#e8d0ff',
    green: '#c1ffa9',
    pink: '#ffc2e4'
};

export const BoundingBox: React.FunctionComponent<Props> = ({
    top,
    left,
    height,
    width,
    className,
    underlineClassName,
    id,
    parentid,
    content,
    isHighlighted,
    onClick,
    color,
    voiceOverLabel,
    ...extraProps
}: Props) => {
    const { pageDimensions } = React.useContext(DocumentContext);
    const { rotation, scale } = React.useContext(TransformContext);
    const boxSize = { top, left, height, width };
    const componentClassName = classNames(
        'pdf-reader__overlay-bounding-box',
        isHighlighted === true ? 'pdf-reader__overlay-bounding-box-highlighted' : '',
        className
    );

    const { curID, setCurID } = useContext(HLContext);
    const {
        textSelected,
        textPos,
        text,
        setTextSelected,
        setTextPos,
        setText,
    } = React.useContext(ToolPopContext);
    const getBoundingBoxStyle = React.useCallback(() => {
        return computeBoundingBoxStyle(boxSize, pageDimensions, rotation, scale);
    }, [pageDimensions, rotation, scale]);

    const rotationClassName = React.useCallback(() => {
        return `rotate${rotation}`;
    }, [rotation]);

    let colorValue = "yellow";
    switch (color) {
        case 'red':
            colorValue = HighLightColors.red;
            break;
        case 'yellow':
            colorValue = HighLightColors.yellow;
            break;
        case 'purple':
            colorValue = HighLightColors.purple;
            break;
        case 'blue':
            colorValue = HighLightColors.blue;
            break;
        case 'green':
            colorValue = HighLightColors.green;
            break;
        default:
            colorValue = HighLightColors.pink;
    }
    return (
        <React.Fragment>
            <div
                className={`pdf-reader_backgroundLight`}
                style={{
                    ...getBoundingBoxStyle(),
                    '--rect-color': colorValue,
                } as React.CSSProperties}
            />
            <div
                id={id}
                className={`${componentClassName} ${rotationClassName()}`}
                style={getBoundingBoxStyle()}
                onClick={(event) => {
                    setText(content === undefined ? "" : content);
                    setCurID(parentid === undefined ? -1 : parentid);
                    setTextSelected(true);
                    const mouseX: number = event.clientX;
                    const mouseY: number = event.clientY;
                    setTextPos({
                        ...textPos,
                        x: mouseX,
                        y: mouseY,
                    })
                }}
                role="button"
                tabIndex={0}
                aria-label={voiceOverLabel}
                {...extraProps}
            />
        </React.Fragment>
    );
};


/* <div
    className={`pdf-reader__overlay-bounding-box-underline `
        // ${underlineClassName || rotationClassName()}`
    }
    // className={`reader__page-overlay__bounding-box 
    // reader__page-overlay__bounding-box-highlighted 
    // reader__text-highlight__bbox
    // ${rotationClassName()}`}
    style={{
        ...getBoundingBoxStyle(),
    }}
/> */