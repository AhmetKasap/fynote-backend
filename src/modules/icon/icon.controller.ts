import { injectable, inject } from "inversify"
import type { Response } from "express"
import type IUserRequest from "@/shared/user.request"
import { SERVICE_TYPES } from "@/service.types"
import ResponseBuilder from "@/shared/response.builder"
import { IconService } from "./icon.service"

@injectable()
export class IconController {
	constructor(
		@inject(SERVICE_TYPES.IconService)
		private readonly iconService: IconService
	) {}

	getIcons = async (
		_req: IUserRequest<{}, {}, {}>,
		res: Response
	): Promise<Response> => {
		const icons = await this.iconService.getIcons()
		return ResponseBuilder.ok(res, icons, "Get icons successfully")
	}
}
