import type User from "./User"
import type Commodity from "./Commodity"
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
    shipId:string,
    status: number,
    user: User,
    commodity: Commodity,
    userAddress: UserAddress,
}