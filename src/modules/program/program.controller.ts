import { injectable, inject } from "inversify"
import type { Response } from "express"
import { SERVICE_TYPES } from "@/service.types"
import ResponseBuilder from "@/shared/response.builder"
import { ProgramService } from "./program.service"
import type IUserRequest from "@/shared/user.request"

@injectable()
export class ProgramController {
	constructor(
		@inject(SERVICE_TYPES.ProgramService)
		private readonly programService: ProgramService
	) {}

	createFromAudio = async (
		req: IUserRequest,
		res: Response
	): Promise<Response> => {
		const audio = req.file?.buffer as Buffer
		const userId = req.user!.id
		const result = await this.programService.createProgramFromAudio(
			audio,
			userId
		)

		return ResponseBuilder.created(res, result, result.message)
	}

	createFromText = async (
		req: IUserRequest,
		res: Response
	): Promise<Response> => {
		const { text } = req.body
		const userId = req.user!.id

		const result = await this.programService.createProgramFromText(
			text,
			userId
		)

		return ResponseBuilder.created(res, result, result.message)
	}

	getProgramById = async (
		req: IUserRequest,
		res: Response
	): Promise<Response> => {
		const { id } = req.params
		const userId = req.user!.id

		const program = await this.programService.getProgramById(id, userId)

		if (!program) {
			return ResponseBuilder.notFound(res, "Program bulunamadı")
		}

		return ResponseBuilder.ok(res, program, "Program başarıyla getirildi")
	}

	getUserPrograms = async (
		req: IUserRequest,
		res: Response
	): Promise<Response> => {
		const userId = req.user!.id

		const programs = await this.programService.getUserPrograms(userId)

		return ResponseBuilder.ok(
			res,
			programs,
			"Programlar başarıyla getirildi"
		)
	}
}
