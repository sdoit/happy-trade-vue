export default interface CommodityBid {
    bid: number,
    cid: number,
    uidBuyer: number,
    uidSeller: number,
    price: number,
    messageBuyer: string,
    replySeller: string,
    agree: boolean,
    time: string,
    timeReply: string,

    nickname: string,
    avatar: string
};