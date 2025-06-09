export type Dimensions = {
    height: number;
    width: number;
};
export type Origin = {
    top: number;
    left: number;
};
export type Size = Dimensions & Origin;
export type BoundingBox = {
    page: number;
} & Size;
export type BoundingBoxText = {
    bbid: string;
    color: string;
    content: string;
    UniteBox: BoundingBox;
    BoxList: BoundingBox[];
};
export type HLaction = {
    type: string,
} & BoundingBoxText;

export enum hltype {
    DEL = "delete",
    ADD = "addbox",
}
export const dVal: HLaction = {
    type: "undefined",
    bbid: "0",
    color: "",
    content: "",
    UniteBox: {
        page: 0, top: 0, left: 0, height: 0, width: 0,
    },
    BoxList: []
}
