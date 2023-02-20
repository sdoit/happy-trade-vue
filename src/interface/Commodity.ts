import type User from '@/interface/User';
import type Tag from '@/interface/Tag';
import type CommodityType from '@/interface/CommodityType';
export default interface Commodity {
    cid: string,
    uid: string,
    name: string,
    quality: number,
    price: number,
    fare:number,
    sold: boolean,
    launched: boolean,
    time: string,
    description: string,
    type:CommodityType,
    viewCount: number,
    user: User,
    cover: string,
    tags:Tag[],
    freightCollect: boolean,
    freeShipping: boolean,

    bidCount:string
}

