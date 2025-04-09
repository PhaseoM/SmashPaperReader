import { BoundingBoxType, UiContext } from '@allenai/pdf-components';
import { BoundingBox } from '../myComponents/Highlight/myBoundingBox';
import { BoundingBox as BoxProp } from '../types/hightlight';
import * as React from 'react';

import hlReducer from '../myComponents/Highlight/hlReducer';
import { HighlightEventListener, socket } from '../myComponents/socketio';
import { Button } from '@mantine/core';

type Props = {
  pageIndex: number;
};

const hlInitial: Array<BoxProp> = [
  {
    page: 0,
    top: 170,
    left: 415,
    height: 30,
    width: 110,
    color: 'yellow',
  },
  {
    page: 0,
    top: 421,
    left: 283,
    height: 15,
    width: 55,
    color: 'green',
  },
  // {
  //   page: 0,
  //   top: 830,
  //   left: 387,
  //   height: 15,
  //   width: 56,
  //   color: 'blue',
  // },
  // {
  //   page: 1,
  //   top: 213,
  //   left: 315,
  //   height: 15,
  //   width: 55,
  //   color: 'red',
  // },
  // {
  //   page: 1,
  //   top: 477,
  //   left: 395,
  //   height: 15,
  //   width: 55,
  //   color: 'yellow',
  // },
  // {
  //   page: 1,
  //   top: 844,
  //   left: 618,
  //   height: 15,
  //   width: 55,
  //   color: 'purple',
  // },
];



export const TextHighlightDemo: React.FunctionComponent<Props> = ({ pageIndex }: Props) => {
  // const { isShowingTextHighlight } = React.useContext(UiContext);
  // if (!isShowingTextHighlight) {
  //   return null;
  // }

  const [hlList, dispatch] = React.useReducer(hlReducer, hlInitial);

  HighlightEventListener(dispatch);

  function renderHighlightedBoundingBoxes(): Array<React.ReactElement> {
    const boxes: Array<React.ReactElement> = [];
    hlList.map((prop, i) => {
      if (prop.page === pageIndex) {
        const props = {
          ...prop,
          className: 'reader_highlight_bbox',
          isHighlighted: true,
          key: i,
        };

        boxes.push(<BoundingBox {...props} />);
      }
    });
    return boxes;
  }
  return (
    <div>
      <Button
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
      >dispatchHL</Button>
      <React.Fragment>{renderHighlightedBoundingBoxes()}</React.Fragment>
    </div>
  );
};
