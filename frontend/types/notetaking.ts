export type noteState = {
    noteid: string,
    bboxid: string,
    context: string,
    content: string,
}
export type noteAction = {
    type: string,
} & noteState;

export enum noteActionType {
    add = "add_note",
    del = "delete_note",
    modify = "modify_note",
}