import { IsNotEmpty } from "class-validator"

//!INTERFACES
export interface ISpeechToText {
	audio: Buffer
}
//! DTOs
export class SpeechToTextDto implements ISpeechToText {
	@IsNotEmpty({ message: "Audio is required" })
	audio!: Buffer
}
