export default interface User {
    certificate:string,
    uid: string,
    username: string,
    password: string,
    phone: string,
    nickname: string,
    avatar: string,
    introduction: string,
    banedTime: string,

    tokenName: string,
    tokenValue: string,



    goodRatingCountSeller:number,
    ratingCountSeller:number,   
    goodRatingCountBuyer:number,
    ratingCountBuyer:number,

    
}