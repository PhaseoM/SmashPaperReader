import { BoundingBoxType, UiContext } from '@allenai/pdf-components';
import { BoundingBox } from './myBoundingBox';
import { BoundingBoxText as BoxProp } from '../../types/hightlight';
import * as React from 'react';

import hlReducer from './hlReducer';
import { HighlightEventListener, socket } from '../socketio';
import { Button } from '@mantine/core';
import { HLContext } from '../../context/HLContext';
type Props = {
  pageIndex: number;
};

export const HighlightRender: React.FunctionComponent<Props> = ({ pageIndex }: Props) => {


  const { hlList, hldispatch } = React.useContext(HLContext);
  // const [hlList, dispatch] = React.useReducer(hlReducer, hlInitial);

  HighlightEventListener(hldispatch);

  function renderHighlightedBoundingBoxes(): Array<React.ReactElement> {
    const boxes: Array<React.ReactElement> = [];
    const oneBoxMaxCnt: number = 100000;
    hlList.map((hlItem, i) => {
      const { color, content, BoxList } = hlItem;
      BoxList.map((prop, j) => {
        if (prop.page === pageIndex) {
          const props = {
            ...prop,
            color: color,
            className: 'reader_highlight_bbox',
            isHighlighted: true,
            key: i * oneBoxMaxCnt + j,
          };
          boxes.push(<BoundingBox {...props} />);
        }
      });
    });
    return boxes;
  }
  return (
    <div>
      {/* <Button
        style={{
          'zIndex': 1000,
        }}
        onClick={() => {
          console.log(hlList);
        }}
      >displayList</Button>
      <Button
        style={{
          'zIndex': 1000,
        }}
        onClick={() => {
          console.log('sendhl_pollreq');
          const msgjson = JSON.stringify({
            msg: "hellotsda"
          });
          socket.emit('hl_poll_request', msgjson);
          // dispatch({
          //   'type': 'addbox',
          //   'id': 0,
          //   'page': 0,
          //   'top': 200,
          //   'left': 200,
          //   'width': 100,
          //   'height': 100,
          //   'color': 'purple',
          // });
        }}
      >dispatchHL</Button> */}
      <React.Fragment>{renderHighlightedBoundingBoxes()}</React.Fragment>
    </div>
  );
};
