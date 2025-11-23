import {
	IsString,
	IsOptional,
	IsNotEmpty,
	IsMongoId,
	IsObject
} from "class-validator"

export interface INote {
	id: string
	userId: string
	folderId?: string
	icon?: {
		id: string
		name: string
		fileUrl: string
	}
	title: string
	contentText: string
	contentJson: object
	createdAt?: Date
	updatedAt?: Date
}

export interface ICreateNoteDto
	extends Pick<INote, "folderId" | "title" | "contentText" | "contentJson"> {
	iconId?: string
}

export interface IUpdateNoteDto
	extends Partial<
		Pick<INote, "folderId" | "title" | "contentText" | "contentJson">
	> {
	iconId?: string
}

export interface INoteId extends Pick<INote, "id"> {}

export class CreateNoteDto implements ICreateNoteDto {
	@IsMongoId()
	@IsOptional()
	folderId?: string

	@IsMongoId()
	@IsOptional()
	iconId?: string

	@IsString()
	@IsNotEmpty()
	title!: string

	@IsString()
	@IsNotEmpty()
	contentText!: string

	@IsNotEmpty()
	contentJson!: object
}

export class UpdateNoteDto implements IUpdateNoteDto {
	@IsMongoId()
	@IsOptional()
	folderId?: string

	@IsMongoId()
	@IsOptional()
	iconId?: string

	@IsString()
	@IsOptional()
	title?: string

	@IsString()
	@IsOptional()
	contentText?: string

	@IsObject()
	@IsOptional()
	contentJson?: object
}

export class NoteIdDto implements INoteId {
	@IsMongoId()
	@IsNotEmpty()
	id!: string
}
