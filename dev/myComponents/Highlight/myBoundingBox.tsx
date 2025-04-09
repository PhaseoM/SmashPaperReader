import classNames from 'classnames';
import * as React from 'react';

import { DocumentContext } from '@allenai/pdf-components';
import { TransformContext } from '@allenai/pdf-components';
import { computeBoundingBoxStyle } from '@allenai/pdf-components';
import { BoundingBoxType } from '@allenai/pdf-components';

export type Props = {
    className?: string;
    underlineClassName?: string;
    color?: string;
    id?: string;
    isHighlighted?: boolean;
    onClick?: () => void;
    voiceOverLabel?: string;
} & BoundingBoxType;

export const BoundingBox: React.FunctionComponent<Props> = ({
    top,
    left,
    height,
    width,
    className,
    underlineClassName,
    id,
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

    const getBoundingBoxStyle = React.useCallback(() => {
        return computeBoundingBoxStyle(boxSize, pageDimensions, rotation, scale);
    }, [pageDimensions, rotation, scale]);

    const rotationClassName = React.useCallback(() => {
        return `rotate${rotation}`;
    }, [rotation]);

    let colorValue = "yellow";
    const enum Col {
        blue = '#92c1ff',
        yellow = 'rgb(255, 252, 105)',
        red = 'rgb(255, 76, 76)',
        purple = 'rgb(182, 105, 255)',
        green = '#00d100',
        pink = 'rgb(255, 123, 196)'
    };
    switch (color) {
        case 'red':
            colorValue = Col.red;
            break;
        case 'yellow':
            colorValue = Col.yellow;
            break;
        case 'purple':
            colorValue = Col.purple;
            break;
        case 'blue':
            colorValue = Col.blue;
            break;
        case 'green':
            colorValue = Col.green;
            break;
        default:
            colorValue = Col.pink;
    }
    // console.log(`----color : ${color} , colorValue : ${colorValue}-----`);
    return (
        <React.Fragment>
            <div
                className={`pdf-reader_backgroundLight --rect-color:@green`}
                style={{
                    ...getBoundingBoxStyle(),
                    '--rect-color': colorValue,
                    // "background": "blue",
                } as React.CSSProperties}
            />
            {/* <div
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
            /> */}
            <div
                id={id}
                className={`${componentClassName} ${rotationClassName()}`}
                style={getBoundingBoxStyle()}
                onClick={onClick}
                role="button"
                tabIndex={0}
                aria-label={voiceOverLabel}
                {...extraProps}
            />
        </React.Fragment>
    );
};
