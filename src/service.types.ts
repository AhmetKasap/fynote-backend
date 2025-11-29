export const SERVICE_TYPES = {
	AuthService: Symbol("AuthService"),
	AuthController: Symbol("AuthController"),
	UserProfileController: Symbol("UserProfileController"),
	UserProfileService: Symbol("UserProfileService"),
	FolderController: Symbol("FolderController"),
	FolderService: Symbol("FolderService"),
	NoteController: Symbol("NoteController"),
	NoteService: Symbol("NoteService"),
	IconController: Symbol("IconController"),
	IconService: Symbol("IconService"),
	SpeechController: Symbol("SpeechController"),
	SpeechService: Symbol("SpeechService"),
	ProgramController: Symbol("ProgramController"),
	ProgramService: Symbol("ProgramService"),

	//!services
	MailService: Symbol("MailService"),
	IJwtService: Symbol("IJwtService"),
	OpenAiService: Symbol("OpenAiService"),
	KafkaProducerService: Symbol("KafkaProducerService"),
	KafkaConsumerService: Symbol("KafkaConsumerService"),

	//!Infrastructure - Kafka Consumers
	ProgramFromAudioConsumerService: Symbol("ProgramFromAudioConsumerService"),
	ProgramFromTextConsumerService: Symbol("ProgramFromTextConsumerService"),

	//!Config
	IConfig: Symbol("IConfig"),
	IAppRouter: Symbol("IAppRouter"),
	IApp: Symbol("IApp"),
	IRouter: Symbol("IRouter"),
	IErrorHandler: Symbol("IErrorHandler")
}
