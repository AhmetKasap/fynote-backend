import { injectable } from "inversify"
import { NoteModel } from "@/database/models/note.model"
import { FolderModel } from "@/database/models/folder.model"
import { IconModel } from "@/database/models/icon.model"
import ApiError from "@/shared/api.error"
import {
	ICreateNoteDto,
	INote,
	INoteId,
	IUpdateNoteDto
} from "@/modules/note/note.dto"
import { IUserId } from "@/dtos/base.user.dto"

@injectable()
export class NoteService {
	async getNotes(userId: IUserId, folderId?: string): Promise<INote[]> {
		const query: any = { userId }
		if (folderId) {
			query.folderId = folderId
		}

		const notes = await NoteModel.find(query).populate("icon").lean()

		return notes.map((note) => ({
			id: note._id.toString(),
			userId: note.userId.toString(),
			folderId: note.folderId?.toString(),
			icon: note.icon
				? {
						id: (note.icon as any)._id.toString(),
						name: (note.icon as any).name,
						fileUrl: (note.icon as any).fileUrl
					}
				: undefined,
			title: note.title,
			contentText: note.contentText,
			contentJson: note.contentJson
		}))
	}

	async getNote(noteId: INoteId, userId: IUserId): Promise<INote> {
		const note = await NoteModel.findOne({
			_id: noteId.id,
			userId
		})
			.populate("icon")
			.lean()

		if (!note) {
			throw ApiError.NotFound("Not bulunamadı")
		}

		return {
			id: note._id.toString(),
			userId: note.userId.toString(),
			folderId: note.folderId?.toString(),
			icon: note.icon
				? {
						id: (note.icon as any)._id.toString(),
						name: (note.icon as any).name,
						fileUrl: (note.icon as any).fileUrl
					}
				: undefined,
			title: note.title,
			contentText: note.contentText,
			contentJson: note.contentJson
		}
	}

	async createNote(dto: ICreateNoteDto, userId: IUserId): Promise<INote> {
		if (dto.folderId) {
			const folder = await FolderModel.findOne({
				_id: dto.folderId,
				userId
			})
			if (!folder) {
				throw ApiError.NotFound("Klasör bulunamadı")
			}
		}

		if (dto.iconId) {
			const icon = await IconModel.findById(dto.iconId)
			if (!icon) {
				throw ApiError.NotFound("İkon bulunamadı")
			}
		}

		const note = await NoteModel.create({
			userId,
			folderId: dto.folderId,
			icon: dto.iconId,
			title: dto.title,
			contentText: dto.contentText,
			contentJson: dto.contentJson,
			createdAt: new Date(),
			updatedAt: new Date()
		})

		const populatedNote = await NoteModel.findById(note._id)
			.populate("icon")
			.lean()

		if (!populatedNote) {
			throw ApiError.InternalServerError("Not oluşturulamadı")
		}

		return {
			id: populatedNote._id.toString(),
			userId: populatedNote.userId.toString(),
			folderId: populatedNote.folderId?.toString(),
			icon: populatedNote.icon
				? {
						id: (populatedNote.icon as any)._id.toString(),
						name: (populatedNote.icon as any).name,
						fileUrl: (populatedNote.icon as any).fileUrl
					}
				: undefined,
			title: populatedNote.title,
			contentText: populatedNote.contentText,
			contentJson: populatedNote.contentJson
		}
	}

	async updateNote(
		noteId: INoteId,
		dto: IUpdateNoteDto,
		userId: IUserId
	): Promise<INote> {
		const note = await NoteModel.findOne({
			_id: noteId.id,
			userId
		})

		if (!note) {
			throw ApiError.NotFound("Not bulunamadı")
		}

		if (dto.folderId !== undefined) {
			if (dto.folderId) {
				const folder = await FolderModel.findOne({
					_id: dto.folderId,
					userId
				})
				if (!folder) {
					throw ApiError.NotFound("Klasör bulunamadı")
				}
				note.folderId = dto.folderId as any
			} else {
				note.folderId = undefined as any
			}
		}

		if (dto.iconId !== undefined) {
			if (dto.iconId) {
				const icon = await IconModel.findById(dto.iconId)
				if (!icon) {
					throw ApiError.NotFound("İkon bulunamadı")
				}
				note.icon = dto.iconId as any
			} else {
				note.icon = undefined as any
			}
		}

		if (dto.title) note.title = dto.title
		if (dto.contentText) note.contentText = dto.contentText
		if (dto.contentJson) note.contentJson = dto.contentJson
		note.updatedAt = new Date()

		await note.save()

		const populatedNote = await NoteModel.findById(note._id)
			.populate("icon")
			.lean()

		if (!populatedNote) {
			throw ApiError.InternalServerError("Not güncellenemedi")
		}

		return {
			id: populatedNote._id.toString(),
			userId: populatedNote.userId.toString(),
			folderId: populatedNote.folderId?.toString(),
			icon: populatedNote.icon
				? {
						id: (populatedNote.icon as any)._id.toString(),
						name: (populatedNote.icon as any).name,
						fileUrl: (populatedNote.icon as any).fileUrl
					}
				: undefined,
			title: populatedNote.title,
			contentText: populatedNote.contentText,
			contentJson: populatedNote.contentJson
		}
	}

	async deleteNote(noteId: INoteId, userId: IUserId): Promise<boolean> {
		const note = await NoteModel.findOne({
			_id: noteId.id,
			userId
		})

		if (!note) {
			throw ApiError.NotFound("Not bulunamadı")
		}

		await NoteModel.deleteOne({ _id: noteId.id })

		return true
	}
}
