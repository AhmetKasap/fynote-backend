import { injectable, inject } from "inversify"
import type { Response } from "express"
import type IUserRequest from "@/shared/user.request"
import { SERVICE_TYPES } from "@/service.types"
import ResponseBuilder from "@/shared/response.builder"
import {
	ICreateNoteDto,
	INoteId,
	IUpdateNoteDto
} from "@/modules/note/note.dto"
import { IUserId } from "@/dtos/base.user.dto"
import { NoteService } from "./note.service"

@injectable()
export class NoteController {
	constructor(
		@inject(SERVICE_TYPES.NoteService)
		private readonly noteService: NoteService
	) {}

	getNotes = async (
		req: IUserRequest<{}, {}, {}>,
		res: Response
	): Promise<Response> => {
		const userId = req.user!.id as IUserId
		const { folderId } = req.query
		const notes = await this.noteService.getNotes(
			userId,
			folderId as string | undefined
		)
		return ResponseBuilder.ok(res, notes, "Notlar başarıyla getirildi")
	}

	getNote = async (
		req: IUserRequest<INoteId, {}, {}>,
		res: Response
	): Promise<Response> => {
		const { id } = req.params
		const userId = req.user!.id as IUserId
		const note = await this.noteService.getNote({ id }, userId)
		return ResponseBuilder.ok(res, note, "Not başarıyla getirildi")
	}

	createNote = async (
		req: IUserRequest<{}, {}, ICreateNoteDto>,
		res: Response
	): Promise<Response> => {
		const dto = req.body
		const userId = req.user!.id as IUserId
		const note = await this.noteService.createNote(dto, userId)
		return ResponseBuilder.created(res, note, "Not başarıyla oluşturuldu")
	}

	updateNote = async (
		req: IUserRequest<INoteId, {}, IUpdateNoteDto>,
		res: Response
	): Promise<Response> => {
		const { id } = req.params
		const dto = req.body
		const userId = req.user!.id as IUserId
		const note = await this.noteService.updateNote({ id }, dto, userId)
		return ResponseBuilder.ok(res, note, "Not başarıyla güncellendi")
	}

	deleteNote = async (
		req: IUserRequest<INoteId, {}, {}>,
		res: Response
	): Promise<Response> => {
		const { id } = req.params
		const userId = req.user!.id as IUserId
		await this.noteService.deleteNote({ id }, userId)
		return ResponseBuilder.ok(res, null, "Not başarıyla silindi")
	}
}
