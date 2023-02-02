export default interface User {
    uid: number,
    username: string,
    password: string,
    phone: string,
    nickname: string,
    avatar: string,
    introduction: string,
    banedTime: string,

    tokenName: string,
    tokenValue: string
}