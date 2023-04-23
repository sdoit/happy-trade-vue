export default interface User {
    certificate:string,
    uid: string,
    username: string,
    password: string,
    repassword: string,
    phone: string,
    nickname: string,
    avatar: string,
    introduction: string,
    banedTime: string,
    admin:boolean

    tokenName: string,
    tokenValue: string,



    goodRatingCountSeller:number,
    ratingCountSeller:number,   
    goodRatingCountBuyer:number,
    ratingCountBuyer:number,

    
}