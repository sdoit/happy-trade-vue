import type Commodity from "@/interface/Commodity";
export default interface UserFavorite {
    fid: string,
    time: string,
    commodity: Commodity,
}