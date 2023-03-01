import type User from "./User"

export default interface UserMessage {
    mid: string,
    title: string,
    content: string,
    uidSend: string,
    uidReceive: string,
    time: string,
    read: boolean,
    systemNotify: boolean

}
export interface ChatUser {
    lastMessage: UserMessage,
    targetUser: User,
    unreadCount: number
}