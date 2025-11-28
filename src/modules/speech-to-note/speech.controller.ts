import { injectable, inject } from "inversify"
import type { Request, Response } from "express"
import { SERVICE_TYPES } from "../../service.types"
import ResponseBuilder from "../../shared/response.builder"
import { SpeechService } from "./speech.service"

@injectable()
export class SpeechController {
	constructor(
		@inject(SERVICE_TYPES.SpeechService)
		private readonly speechService: SpeechService
	) {}

	speechToText = async (req: Request, res: Response): Promise<Response> => {
		const audio = req.body as Buffer
		const text = await this.speechService.speechToText(audio)
		return ResponseBuilder.created(res, text, "Speech to text successful")
	}
}
