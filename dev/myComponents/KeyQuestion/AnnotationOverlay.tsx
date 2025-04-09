// import React from 'react';
// import { PageToAnnotationsMap } from '../../types/annotations';
// import { AnswerContext } from '../../context/AnswerContext';

// type Props = {
//   annotations: PageToAnnotationsMap;
//   pageIndex: number;
//   parentRef: React.RefObject<HTMLDivElement>;
// };


// export const AnnotationsOverlay: React.FunctionComponent<Props> = ({
//     annotations,
//     pageIndex,
//     parentRef,
// }: Props) => {
//     function renderAnnotations(): Array<React.ReactElement> {
//         // create list of popovers to populate
//         const popovers: Array<React.ReactElement> = [];

//         // get the currently selected answer from the AnswerContext
//         const { selectedAnswer } = React.useContext(AnswerContext);
//         const { selectedAnswerPopover, setSelectedAnswerPopover } = React.useContext(AnswerContext);

//         const entitiesForPage = annotations.get(pageIndex);
//         if (entitiesForPage) {
//             const answers = entitiesForPage.answers;
//             // for all answer annotations on the current page, push to the popovers list
//             answers.map(answer => {
//                 popovers.push(
//                     <AnswerPopover
//                         key={`answer-${answer.id}`}
//                         answer={answer}
//                         parentRef={parentRef}
//                         isActive={selectedAnswer == `answer-${answer.id}`} // set the current active popover only, the rest are hidden
//                         isPopoverVisible={selectedAnswerPopover == `answer-${answer.id}`}
//                         setIsPopoverVisible={(isVisible: boolean) =>
//                             handlePopoverVisibleChange(isVisible, `answer-${answer.id}`) // handle when the active popover is clicked off from
//                         }
//                     />
//                 );
//             });
//         }
//         return popovers;
//     }

//     return <React.Fragment>{annotations.get(pageIndex) && renderAnnotations()}</React.Fragment>;
// };