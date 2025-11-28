export const SERVICE_TYPES = {
	//!Auth Module
	AuthService: Symbol("AuthService"),
	AuthController: Symbol("AuthController"),

	//!User Profile Module
	UserProfileController: Symbol("UserProfileController"),
	UserProfileService: Symbol("UserProfileService"),

	//!Folder Module
	FolderController: Symbol("FolderController"),
	FolderService: Symbol("FolderService"),

	//!Note Module
	NoteController: Symbol("NoteController"),
	NoteService: Symbol("NoteService"),

	//!Icon Module
	IconController: Symbol("IconController"),
	IconService: Symbol("IconService"),

	//!Speech to Note Module
	SpeechController: Symbol("SpeechController"),
	SpeechService: Symbol("SpeechService"),

	//!Program Module
	ProgramController: Symbol("ProgramController"),
	ProgramService: Symbol("ProgramService"),

	//!services
	MailService: Symbol("MailService"),
	IJwtService: Symbol("IJwtService"),
	OpenAiService: Symbol("OpenAiService"),

	//!Infrastructure - Kafka
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
