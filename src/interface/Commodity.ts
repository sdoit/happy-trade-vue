import type Resource from '@/interface/Resource';
import type User from '@/interface/User';
export default interface Commodity {
    cid: number,
    uid: number,
    name: string,
    coverId: string,
    quality: number,
    price: number,
    sold: boolean,
    launched: boolean,
    time: string,
    description: string,
    typeName: string,
    viewCount: number,
    user: User,
    cover: Resource,
    resources: Resource[]
}

