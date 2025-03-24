
export interface opArgs {
    size: number,
    family: string
}

export function getActualWidthOfChars
    (textContext: string | null, options: opArgs = { size: 14, family: "Segoe UI" }) {
    const { size, family } = options;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.font = `${size}px ${family}`;
        const metrics = textContext === null ? ctx.measureText("") : ctx.measureText(textContext);
        const actual = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
        return Math.max(metrics.width, actual);
    }
    else return 0;
}