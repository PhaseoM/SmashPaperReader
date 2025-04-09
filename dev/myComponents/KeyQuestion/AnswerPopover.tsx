// import { Popover } from "@mantine/core"
// import React, { useContext } from "react"
// import { AnswerContext } from "../../context/AnswerContext"

// export const AnswerPopover: React.FunctionComponent = () => {
//     const {
//         selectedAnswerPopover: isPopoverVisible,
//         setSelectedAnswerPopover: handleVisibleChange
//     } = useContext(AnswerContext);
//     return (
//         <React.Fragment>
//             <Popover
//                 opened={isPopoverVisible} // is only visible if this is the selected answer
//                 onVisibleChange={handleVisibleChange}>
//                 <React.Fragment>...BoundingBox for the answer...</React.Fragment>
//             </Popover>
//         </React.Fragment >
//     )
// }