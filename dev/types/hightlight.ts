
// Height and width are in screen pixel units at 100% scaling of the page
export type Dimensions = {
    height: number;
    width: number;
};
// Top and left are in screen pixel units at 100% scaling of the page
export type Origin = {
    top: number;
    left: number;
};


export type Size = Dimensions & Origin;

export type BoundingBox = {
    page: number;
} & Size;

export type BoundingBoxText = {
    color: string;
    content: string;
    UniteBox: BoundingBox;
    BoxList: BoundingBox[];
};

export type HLaction = {
    type: string,
    id: number,
} & BoundingBoxText;

export enum hltype {
    DEL = "delete",
    ADD = "addbox",
}

export const dVal: HLaction = {
    type: "undefined",
    id: 0,
    color: "",
    content: "",
    UniteBox: {
        page: 0, top: 0, left: 0, height: 0, width: 0,
    },
    BoxList: []
}
