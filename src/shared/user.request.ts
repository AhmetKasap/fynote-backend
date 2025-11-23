import { IUser } from "@/database/models/user.model"
import { Request } from "express"

export default interface IUserRequest<P = any, ResBody = any, ReqBody = any>
	extends Request<P, ResBody, ReqBody> {
	user?: IUser
}
