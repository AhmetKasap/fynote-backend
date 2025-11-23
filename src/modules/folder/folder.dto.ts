import { IsString, IsOptional, IsNotEmpty, IsMongoId } from "class-validator"

export interface IFolder {
	id: string
	userId: string
	name: string
	icon?: {
		id: string
		name: string
		fileUrl: string
	}
	color?: string
	createdAt?: Date
	updatedAt?: Date
}
export interface ICreateFolderDto extends Pick<IFolder, "name" | "color"> {
	iconId?: string
}

export interface IUpdateFolderDto
	extends Partial<Pick<IFolder, "name" | "color">> {
	iconId?: string
}

export interface IFolderId extends Pick<IFolder, "id"> {}

export class CreateFolderDto implements ICreateFolderDto {
	@IsString()
	@IsNotEmpty()
	name!: string

	@IsMongoId()
	@IsOptional()
	iconId?: string

	@IsString()
	@IsOptional()
	color?: string
}

export class UpdateFolderDto implements IUpdateFolderDto {
	@IsString()
	@IsOptional()
	name?: string

	@IsString()
	@IsOptional()
	color?: string

	@IsMongoId()
	@IsOptional()
	iconId?: string
}

export class FolderIdDto implements IFolderId {
	@IsMongoId()
	@IsNotEmpty()
	id!: string
}
