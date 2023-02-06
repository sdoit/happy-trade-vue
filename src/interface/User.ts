export default interface User {
    certificate:string,
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