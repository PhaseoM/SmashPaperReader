import { createContext } from "react";

interface AnswerContextElement {
    selectedAnswer: string;
    selectedAnswerPopover: boolean;
    setSelectedAnswerPopover: (selectedAnswerPopover: boolean) => void;
}

export const AnswerContext = createContext<AnswerContextElement>({
    selectedAnswer: "",
    selectedAnswerPopover: false,
    setSelectedAnswerPopover: () => { },
});
