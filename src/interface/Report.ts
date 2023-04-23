import type User from "./User";
import type Commodity from "./Commodity";
import type Request from "./Request";

export default interface Report {
    rno: string,
    uid: string,
    uidTarget: string,
    target: string,
    targetId: string,
    reason: string,
    vno: string,
    valid: boolean,
    reply: string,
    user:User,
    userTarget:User,
    commodity:Commodity,
    request:Request,
    time:string,
}
