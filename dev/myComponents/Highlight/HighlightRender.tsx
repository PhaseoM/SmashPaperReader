import { BoundingBoxType, computeBoundingBoxStyle, DocumentContext, TransformContext, UiContext } from '@allenai/pdf-components';
import { BoundingBox } from './myBoundingBox';
import { BoundingBoxText as BoxTextProps, BoundingBox as BoxProps, hltype, dVal } from '../../types/hightlight';
import * as React from 'react';

import hlReducer from './hlReducer';
import { HighlightEventListener, socket } from '../socketio';
import { Button, CloseButton } from '@mantine/core';
import { HLContext } from '../../context/HLContext';
import { CSSProperties, useContext, useEffect, useRef, useState } from 'react';
import { ToolPopContext } from '../../context/PopoverConext';
type Props = {
  pageIndex: number;
};


type UboxProps = {
  id: number,
  content: string,
  bboxList: Array<React.ReactElement>,
} & BoxProps;

const Ubox: React.FunctionComponent<UboxProps> = ({
  id, content, bboxList, page, top, left, height, width
}: UboxProps) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const { pageDimensions } = React.useContext(DocumentContext);
  const { rotation, scale } = React.useContext(TransformContext);
  const boxSize = { top, left, height, width };
  const getBoundingBoxStyle = React.useCallback(() => {
    return computeBoundingBoxStyle(boxSize, pageDimensions, rotation, scale);
  }, [pageDimensions, rotation, scale]);

  const { curID, setCurID, hldispatch } = useContext(HLContext);
  const {
    textSelected,
    textPos,
    text,
    setTextSelected,
    setTextPos,
    setText,
  } = React.useContext(ToolPopContext);
  useEffect(() => {
    const handle_Sp_down = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        setCurID(-1);
      }
    }
    window.addEventListener('mousedown', handle_Sp_down);
    return () => {
      window.removeEventListener('mousedown', handle_Sp_down);
    }
  }, []);
  const { top: btop, left: bleft, height: bheight, width: bwidth } = getBoundingBoxStyle();

  return (
    <React.Fragment>
      {curID === id ?
        <React.Fragment>
          <div
            id={id.toString()}
            // className={`UniteBoxBorder ${curID === id ? "uniteClicked" : "uniteUnClicked"}`}
            className={`UniteBoxBorder uniteClicked`}
            ref={divRef}
            style={getBoundingBoxStyle()}
            role='button'
            onMouseDown={() => {
              setTextSelected(true);
              setText(content);
              setTextPos({
                ...textPos,
                page: page,
              })
            }}
          />
          {/* <CloseButton
            className='closebutton'
            style={{
              top: btop,
              left: bleft + bwidth,
            }}
            onMouseDown={() => {
              setCurID(-1);
              hldispatch({
                ...dVal,
                type: hltype.DEL,
                id: id,
              })
            }}
          /> */}
        </React.Fragment>
        : null}
      {bboxList}
    </React.Fragment>
  );
}



export const HighlightRender: React.FunctionComponent<Props> = ({ pageIndex }: Props) => {


  const { hlList, hldispatch } = React.useContext(HLContext);
  // const [hlList, dispatch] = React.useReducer(hlReducer, hlInitial);

  HighlightEventListener(hldispatch);
  function renderHighlightedBoundingBoxes(): Array<React.ReactElement> {
    const boxes: Array<React.ReactElement> = [];
    const oneBoxMaxCnt: number = 100000;
    hlList.map((hlItem, i) => {
      const { color, content, UniteBox, BoxList } = hlItem;
      if (UniteBox.page === pageIndex) {
        const onebox: Array<React.ReactElement> = [];
        BoxList.map((prop, j) => {
          if (prop.page === pageIndex) {
            const props = {
              ...prop,
              parentid: i,
              color: color,
              className: 'reader_highlight_bbox',
              isHighlighted: true,
              key: i * oneBoxMaxCnt + j,
            };
            onebox.push(<BoundingBox {...props} />);
          }
        });
        boxes.push(<Ubox {...UniteBox} id={i} bboxList={onebox} content={content} />);
      }
    });
    return boxes;
  }
  return (
    <React.Fragment>
      {renderHighlightedBoundingBoxes()}
    </React.Fragment>
  );
};
