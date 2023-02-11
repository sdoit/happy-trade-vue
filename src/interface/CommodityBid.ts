import type Commodity from "./Commodity";
import type Resource from "./Resource";
export default interface CommodityBid {
    bid: number,
    cid: number,
    uidBuyer: number,
    uidSeller: number,
    price: number,
    messageBuyer: string,
    replySeller: string,
    agree: boolean,
    timeCreated: string,
    timeReply: string,
    nickname: string,
    username:string,
    avatar: string,
    commodity: Commodity,
    cover: Resource
};