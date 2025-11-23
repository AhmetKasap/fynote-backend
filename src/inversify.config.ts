import { Container } from "inversify"
import { Config, type IConfig } from "./config"
import { SERVICE_TYPES } from "./service.types"
import App from "./app"
import AppRouter from "./app-router"
import { AuthController } from "./modules/auth/auth.controller"
import { AuthService } from "./modules/auth/auth.service"
import AuthRouter from "./modules/auth/auth.router"
import JwtService from "./services/jwt.service"
import UserProfileRouter from "./modules/user-profile/user.profile.router"
import FolderRouter from "./modules/folder/folder.router"
import NoteRouter from "./modules/note/note.router"
import IconRouter from "./modules/icon/icon.router"
import { MailService } from "./services/mail.service"
import { UserProfileController } from "./modules/user-profile/user.profile.controller"
import { FolderController } from "./modules/folder/folder.controller"
import { NoteController } from "./modules/note/note.controller"
import { IconController } from "./modules/icon/icon.controller"
import UserProfileService from "./modules/user-profile/user.profile.service"
import { FolderService } from "./modules/folder/folder.service"
import { NoteService } from "./modules/note/note.service"
import { IconService } from "./modules/icon/icon.service"

const container = new Container()

//! Bindings - Config
container.bind<IConfig>(SERVICE_TYPES.IConfig).to(Config)

//! Bindings - Controllerss
container
	.bind(SERVICE_TYPES.AuthController)
	.to(AuthController)
	.inSingletonScope()
container
	.bind(SERVICE_TYPES.UserProfileController)
	.to(UserProfileController)
	.inSingletonScope()
container
	.bind(SERVICE_TYPES.FolderController)
	.to(FolderController)
	.inSingletonScope()
container
	.bind(SERVICE_TYPES.NoteController)
	.to(NoteController)
	.inSingletonScope()
container
	.bind(SERVICE_TYPES.IconController)
	.to(IconController)
	.inSingletonScope()

//! Bindings - Services
container.bind(SERVICE_TYPES.AuthService).to(AuthService).inSingletonScope()
container.bind(SERVICE_TYPES.IJwtService).to(JwtService).inSingletonScope()
container
	.bind(SERVICE_TYPES.UserProfileService)
	.to(UserProfileService)
	.inSingletonScope()
container.bind(SERVICE_TYPES.FolderService).to(FolderService).inSingletonScope()
container.bind(SERVICE_TYPES.NoteService).to(NoteService).inSingletonScope()
container.bind(SERVICE_TYPES.IconService).to(IconService).inSingletonScope()
container.bind(SERVICE_TYPES.MailService).to(MailService).inSingletonScope()

//! Bindings - Routers
container.bind(SERVICE_TYPES.IRouter).to(AuthRouter).inSingletonScope()
container.bind(SERVICE_TYPES.IRouter).to(UserProfileRouter).inSingletonScope()
container.bind(SERVICE_TYPES.IRouter).to(FolderRouter).inSingletonScope()
container.bind(SERVICE_TYPES.IRouter).to(NoteRouter).inSingletonScope()
container.bind(SERVICE_TYPES.IRouter).to(IconRouter).inSingletonScope()

//! Bindings - App
container.bind(SERVICE_TYPES.IAppRouter).to(AppRouter).inSingletonScope()
container.bind(SERVICE_TYPES.IApp).to(App).inSingletonScope()

export { container }
