import { IsNotEmpty, IsString } from "class-validator"

//! INTERFACES
export interface ICreateProgramFromText {
	text: string
}

export interface ICreateProgramFromAudio {
	audio: Buffer
}

export interface IProgramResponse {
	id: string
	message: string
	status: "processing"
}

//! DTOs
export class CreateProgramFromTextDto implements ICreateProgramFromText {
	@IsNotEmpty({ message: "text is required" })
	@IsString({ message: "Text must be a string" })
	text!: string
}

export class CreateProgramFromAudioDto implements ICreateProgramFromAudio {
	@IsNotEmpty({ message: "Audio is required" })
	audio!: Buffer
}
