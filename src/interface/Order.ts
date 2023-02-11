import type User from "./User"
import type Commodity from "./Commodity"
import type Resource from "./Resource"
import type UserAddress from "./UserAddress"

export default interface Order {
    oid: string,
    cid: number,
    uidSeller: number,
    uidBuyer: number,
    name: string,
    tradeId: string,
    orderTime: string,
    payTime: string,
    shipTime: string,
    totalAmount: string,
    buyerAlipayId: string,
    refundTime: string,
    cancelTime: string,
    completeTime: string,
    aid: number,
    status: number,
    statusName:string,
    user: User,
    commodity: Commodity,
    userAddress: UserAddress,
    cover: Resource
}