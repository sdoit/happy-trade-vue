import type Commodity from "./Commodity";
import type User from '@/interface/User';
import type Tag from '@/interface/Tag';
import type CommodityType from '@/interface/CommodityType';

export interface CommodityBid {
    /***commodity**************************/
    cid: number,
    uid: number,
    name: string,
    quality: number,
    price: number,
    fare: number,
    sold: boolean,
    launched: boolean,
    time: string,
    description: string,
    type: CommodityType,
    viewCount: number,
    user: User,
    cover: string,
    tags: Tag[],
    freightCollect: boolean,
    freeShipping: boolean,
    /***commodity**************************/
    

    bids: Bid[]
};

export interface Bid {
    bid: string,
    cid: string,
    uidBuyer: string,
    uidSeller: string,
    price: number,
    messageBuyer: string,
    replySeller: string,
    agree: boolean,
    timeCreated: string,
    timeReply: string,
    buyer: User,
    seller: User,
    cancel:boolean
};