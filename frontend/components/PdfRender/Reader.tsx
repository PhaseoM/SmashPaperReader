import {
  DocumentContext,
  DocumentWrapper,
  Overlay,
  PageRenderContext,
  PageWrapper,
  RENDER_TYPE,
  ScrollContext,
  scrollToId,
  TransformContext,
} from '@allenai/pdf-components';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BrowserRouter, Route, useParams } from 'react-router-dom';

import { DemoHeaderContextProvider } from '../../context/DemoHeaderContext';
import { Annotations, generateCitations, PageToAnnotationsMap } from '../../types/annotations';
import { RawCitation } from '../../types/citations';
import { HighlightRender } from '../Highlight/HighlightRender';
import { FloatingToolbar } from '../FloatingToolbar';
import { ToolPopContext } from '../../context/PopoverConext';
import { generatePageIdFromIndex } from '@allenai/pdf-components/src/utils/scroll';
import { socketIO } from '../socketio';
import { RefContext } from '../../context/RefContext';
import { NoteTakingPop } from '../NoteTaking/NoteTakingPop';


export const Reader: React.FunctionComponent<RouteComponentProps> = (props) => {
  const { pageDimensions, numPages } = React.useContext(DocumentContext);
  const { setScrollRoot } = React.useContext(ScrollContext);
  const { ReaderPaneRef } = React.useContext(RefContext);
  const [annotations, setAnnotations] = React.useState<PageToAnnotationsMap>(
    new Map<number, Annotations>()
  );
  const [rawCitations, setRawCitations] = React.useState<RawCitation[]>();

  const pdfContentRef = React.createRef<HTMLDivElement>();
  const pdfScrollableRef = React.createRef<HTMLDivElement>();

  const queryParams = new URLSearchParams(location.search);
  const type: number | null = Number(queryParams.get('type'));
  const urlparam: string | null = queryParams.get('url');

  const PdfUrl = React.useMemo(() => {
    const url: string = urlparam === null ? '' : urlparam;
    const decodeurl: string = decodeURIComponent(url);
    return decodeurl;
  }, [urlparam]);

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

  return (
    <div
      className="reader__container"
      ref={ReaderPaneRef}
    >
      <DocumentWrapper
        className="reader__main"
        file={PdfUrl}
        inputRef={pdfContentRef}
        renderType={RENDER_TYPE.SINGLE_CANVAS}
      >
        <div className="reader__page-list" ref={pdfScrollableRef}>
          {Array.from({ length: numPages }).map((_, i) => (
            <PageWrapper key={i} pageIndex={i} renderType={RENDER_TYPE.SINGLE_CANVAS}>
              <Overlay>
                <FloatingToolbar
                  annotations={annotations}
                  pageIndex={i}
                  parentRef={pdfScrollableRef}
                />
                <NoteTakingPop />
                <HighlightRender pageIndex={i} pdfScrollableRef={pdfScrollableRef} />
              </Overlay>
            </PageWrapper>
          ))}
        </div>
      </DocumentWrapper>
    </div>
  );
};
