import type UserAddress from "./UserAddress";

export default interface OrderReturn{
    oid:string,
    reason:string,
    agree:boolean,
    rejectReason:string,
    userAddress:UserAddress,
    shipId:string,
    completed:boolean
}