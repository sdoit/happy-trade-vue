import type Commodity from "./Commodity";
import type Request from "./Request";
import type User from "./User";

export default interface Violation {
    vno:string,
    target:string,
    uid:string,
    targetId:string,
    action:string,
    reason:string,
    complaintCount:string,
    duration:string,
    time:string,
    user:User,
    commodity:Commodity,
    request:Request,
}
