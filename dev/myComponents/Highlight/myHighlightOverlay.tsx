import * as React from 'react';

import { DocumentContext } from '@allenai/pdf-components';
import { TransformContext } from '@allenai/pdf-components';
import { computeBoundingBoxStyle, computePageStyle } from '@allenai/pdf-components';
import { BoundingBoxProps } from '@allenai/pdf-components';

export type Props = {
  children?: React.ReactElement<BoundingBoxProps> | Array<React.ReactElement<BoundingBoxProps>>;
  pageIndex: number;
};

export const HighlightOverlay: React.FunctionComponent<Props> = ({
  children,
  pageIndex,
  ...extraProps
}: Props) => {
  const { pageDimensions } = React.useContext(DocumentContext);
  const { rotation, scale } = React.useContext(TransformContext);
  const maskId = `highlight-overlay-mask-${pageIndex}`;

  const getPageStyle = React.useCallback(() => {
    return computePageStyle(pageDimensions, rotation, scale);
  }, [pageDimensions, rotation, scale]);

  const getUnmaskedArea = React.useCallback(
    (
      boundingBoxes:
        | React.ReactElement<BoundingBoxProps>
        | Array<React.ReactElement<BoundingBoxProps>>
    ) => {
      const boxes = Array.isArray(boundingBoxes) ? boundingBoxes : [boundingBoxes];
      return boxes.map((box, i) => {
        const boxStyle = computeBoundingBoxStyle(box.props, pageDimensions, rotation, scale);
        return (
          <rect style={boxStyle} x={boxStyle.left} y={boxStyle.top} key={i} fill="black" ></rect>
        );
      });
    },
    [pageDimensions, rotation, scale]
  );

  return (
    <div className="pdf-reader__page-highlight-overlay" style={getPageStyle()} {...extraProps}>
      <svg className="page-mask" style={getPageStyle()}>
        <mask id={maskId}>
          <rect style={getPageStyle()} fill="white"></rect>
          {children && getUnmaskedArea(children)}
        </mask>
        <rect style={getPageStyle()} fill="white" opacity="0.6" mask={`url(#${maskId})`}></rect>
      </svg>
    </div>
  );
};
