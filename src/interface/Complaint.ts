import type User from "./User";
import type Violation from "./Violation";
export default interface Complaint {
    cno: string,
    vno: string,
    uid: string,
    reason: string,
    withdrawal: boolean,
    reply: string,
    user:User,
    time:string,
    violation:Violation
}