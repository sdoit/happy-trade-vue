import type Resource from '@/entity/Resource';
import type User from '@/entity/User';
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

