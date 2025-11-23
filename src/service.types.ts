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

	//!services
	MailService: Symbol("MailService"),
	IJwtService: Symbol("IJwtService"),

	//!Config
	IConfig: Symbol("IConfig"),
	IAppRouter: Symbol("IAppRouter"),
	IApp: Symbol("IApp"),
	IRouter: Symbol("IRouter"),
	IErrorHandler: Symbol("IErrorHandler")
}
