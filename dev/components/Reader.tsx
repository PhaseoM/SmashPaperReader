import {
  DocumentContext,
  DocumentWrapper,
  Overlay,
  PageRenderContext,
  PageWrapper,
  RENDER_TYPE,
  ScrollContext,
  TransformContext,
} from '@allenai/pdf-components';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BrowserRouter, Route, useParams } from 'react-router-dom';

import { DemoHeaderContextProvider } from '../context/DemoHeaderContext';
import { Annotations, generateCitations, PageToAnnotationsMap } from '../types/annotations';
import { RawCitation } from '../types/citations';
import { CitationsDemo } from './CitationsDemo';
import { Header } from './Header';
import { HighlightOverlayDemo } from './HighlightOverlayDemo';
import { NoteTakingDemo } from './NoteTakingDemo';
import { Outline } from './Outline';
import { ScrollToDemo } from './ScrollToDemo';
import { TextHighlightDemo } from './TextHighlightDemo';
import { Thumbnail } from './Thumbnail';
import SplitPane from 'react-split-pane';
import { CompVisiableControl } from '../myComponents/Navigation/CompVisiableControl';


import { NavItemContext } from '../context/NavContext';
import { ScrollArea, Menu, Button, Text } from '@mantine/core';
import useWindowSize from '../utils/useWindowSize';
import { useEffect, useRef, useState } from 'react';
import { IconArrowsLeftRight, IconMessageCircle, IconPhoto, IconSearch, IconSettings, IconTrash } from '@tabler/icons-react';
import { SimpleZoomControl } from './SimpleZoomControl';
import { PopoverUp } from '../myComponents/ToolPopover';
import { ToolPopContext } from '../context/PopoverConext';
import { generatePageIdFromIndex } from '@allenai/pdf-components/src/utils/scroll';
import { socket } from '../myComponents/socketio';


export const Reader: React.FunctionComponent<RouteComponentProps> = (props) => {
  const { pageDimensions, numPages } = React.useContext(DocumentContext);
  const { setScrollRoot } = React.useContext(ScrollContext);
  const [annotations, setAnnotations] = React.useState<PageToAnnotationsMap>(
    new Map<number, Annotations>()
  );
  const [rawCitations, setRawCitations] = React.useState<RawCitation[]>();

  // ref for the div in which the Document component renders
  const pdfContentRef = React.createRef<HTMLDivElement>();

  // ref for the scrollable region where the pages are rendered
  const pdfScrollableRef = React.createRef<HTMLDivElement>();


  const queryParams = new URLSearchParams(location.search);
  const type: number | null = Number(queryParams.get('type'));
  const urlparam: string | null = queryParams.get('url');

  const samplePdfUrl = React.useMemo(() => {
    const url: string = urlparam === null ? '' : urlparam;
    const decodeurl: string = decodeURIComponent(url);
    return decodeurl;
  }, [urlparam]);

  // const { urlOfpaper } = useParams<{ type: number urlOfpaper: string }>();
  // console.log(location);
  // console.log(queryParams);
  // console.log("`````type:" + type);
  // console.log(samplePdfUrl)

  const sampleS2airsUrl =
    'http://s2airs.prod.s2.allenai.org/v1/pdf_data?pdf_sha=9b79eb8d21c8a832daedbfc6d8c31bebe0da3ed5';

  React.useEffect(() => {
    // If data has been loaded then return directly to prevent sending multiple requests
    if (rawCitations) {
      return;
    }

    fetch(sampleS2airsUrl, { referrer: '' })
      .then(response => response.json())
      .then(data => {
        setRawCitations(data[0].citations);
      });
  }, [pageDimensions]);

  React.useEffect(() => {
    setScrollRoot(null);
  }, []);

  // Attaches annotation data to paper
  React.useEffect(() => {
    // Don't execute until paper data and PDF document have loaded
    if (!rawCitations || !pageDimensions.height || !pageDimensions.width) {
      return;
    }

    setAnnotations(generateCitations(rawCitations, pageDimensions));
  }, [rawCitations, pageDimensions]);
  // console.log(`----------${numPages}------------`)




  // useEffect(() => {
  //   socket.emit('downloadpdf', { url: samplePdfUrl });
  //   const RecieveMsg = (event: { data: { filename: string } }) => {
  //     console.log(event.data.filename);
  // }
  //   socket.on('download_end', RecieveMsg);
  //   return () => {
  //     socket.off('download_end', RecieveMsg);
  //   };
  // }, [])


  useEffect(() => {
    const element = pdfContentRef.current;

    const sendEvent = () => {
      console.log("=========sendhl success=========");
      socket.emit('hl_poll_request');
    }

    // if (element) {
    console.log("????????????????????")
    window.addEventListener('load', sendEvent);
    // }

    return () => {
      // if (element) {
      window.removeEventListener('load', sendEvent);
      // }
    };
  }, [])


  const dRef = useRef(null);
  return (
    // <BrowserRouter>
    //   <Route path="/">
    <div
      className="reader__container"
      ref={dRef}
    >
      {/* <DemoHeaderContextProvider> */}
      {/* <Header pdfUrl={samplePdfUrl} /> */}
      <DocumentWrapper
        className="reader__main"
        file={samplePdfUrl}
        inputRef={pdfContentRef}
        renderType={RENDER_TYPE.SINGLE_CANVAS}
      >
        {/* <Outline parentRef={pdfContentRef} />
        <Thumbnail parentRef={pdfContentRef} /> */}
        <div className="reader__page-list" ref={pdfScrollableRef}>
          {Array.from({ length: numPages }).map((_, i) => (
            <PageWrapper key={i} pageIndex={i} renderType={RENDER_TYPE.SINGLE_CANVAS}>
              <Overlay>
                {/* <HighlightOverlayDemo pageIndex={i} /> */}
                <TextHighlightDemo pageIndex={i} />
                <ScrollToDemo pageIndex={i} />
                <CitationsDemo
                  annotations={annotations}
                  pageIndex={i}
                  parentRef={pdfScrollableRef}
                />
                <PopoverUp
                  annotations={annotations}
                  pageIndex={i}
                  parentRef={pdfScrollableRef}
                />
              </Overlay>
            </PageWrapper>
          ))}
        </div>
      </DocumentWrapper>
      {/* <NoteTakingDemo /> */}
      {/* </DemoHeaderContextProvider> */}
    </div>
    //   </Route>
    // </BrowserRouter>
  );
};
