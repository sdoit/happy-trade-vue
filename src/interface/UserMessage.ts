import type User from "./User"

export default interface UserMessage {
    mid: string,
    title: string,
    content: string,
    contentType: string,
    uidSend: string,
    uidReceive: string,
    url:string,
    messageType:string
    time: string,
    read: boolean,
    systemNotify: boolean

    status:number

}
export interface ChatUser {
    groupId: string
    lastMessage: string
    contentType: string
    time: string
    uid: string
    uidTarget: string
    userTarget: User,
    unreadCount: number
}