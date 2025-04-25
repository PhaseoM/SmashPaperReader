export type msgHint = {
    id: string,
    hint: string,
}


export type msgState = {
    id: string,
    msgid: string,
    select: string | null,
    context: string,
    isloading: boolean,
    HintList: msgHint[],
}

export type msgList = Array<msgState>;

export type msgAction = {
    type: string,
    id: string,
    msgid: string,
    select: string | null,
    context: string,
    HintList: msgHint[],
}

export enum spid {
    serverid = "1919810",
    msgerror = "1145141"
}

export enum msgact {
    USER_SEND = "user_send",
    ADD_LOADING = "add_loading",
    DELETE = "delete",
    AI_SEND_NORMAL = "ai_send_normal",
};