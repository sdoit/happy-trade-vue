import type User from "./User";

export default interface UserMessage {
    mid: string,
    title: string,
    content: string,
    sender: User,
    receiver: User,
    time: string,
    read: boolean
}