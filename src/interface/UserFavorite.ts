import type Commodity from "@/interface/Commodity";
import type Resource from "@/interface/Resource";
export default interface UserFavorite {
    fid: string,
    time: string,
    commodity: Commodity,
    cover: Resource
}