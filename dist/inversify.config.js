"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const config_1 = require("./config");
const service_types_1 = require("./service.types");
const app_1 = __importDefault(require("./app"));
const app_router_1 = __importDefault(require("./app-router"));
const auth_controller_1 = require("./modules/auth/auth.controller");
const auth_service_1 = require("./modules/auth/auth.service");
const auth_router_1 = __importDefault(require("./modules/auth/auth.router"));
const jwt_service_1 = __importDefault(require("./services/jwt.service"));
const user_profile_router_1 = __importDefault(require("./modules/user-profile/user.profile.router"));
const folder_router_1 = __importDefault(require("./modules/folder/folder.router"));
const note_router_1 = __importDefault(require("./modules/note/note.router"));
const icon_router_1 = __importDefault(require("./modules/icon/icon.router"));
const mail_service_1 = require("./services/mail.service");
const user_profile_controller_1 = require("./modules/user-profile/user.profile.controller");
const folder_controller_1 = require("./modules/folder/folder.controller");
const note_controller_1 = require("./modules/note/note.controller");
const icon_controller_1 = require("./modules/icon/icon.controller");
const user_profile_service_1 = __importDefault(require("./modules/user-profile/user.profile.service"));
const folder_service_1 = require("./modules/folder/folder.service");
const note_service_1 = require("./modules/note/note.service");
const icon_service_1 = require("./modules/icon/icon.service");
const container = new inversify_1.Container();
exports.container = container;
//! Bindings - Config
container.bind(service_types_1.SERVICE_TYPES.IConfig).to(config_1.Config);
//! Bindings - Controllerss
container
    .bind(service_types_1.SERVICE_TYPES.AuthController)
    .to(auth_controller_1.AuthController)
    .inSingletonScope();
container
    .bind(service_types_1.SERVICE_TYPES.UserProfileController)
    .to(user_profile_controller_1.UserProfileController)
    .inSingletonScope();
container
    .bind(service_types_1.SERVICE_TYPES.FolderController)
    .to(folder_controller_1.FolderController)
    .inSingletonScope();
container
    .bind(service_types_1.SERVICE_TYPES.NoteController)
    .to(note_controller_1.NoteController)
    .inSingletonScope();
container
    .bind(service_types_1.SERVICE_TYPES.IconController)
    .to(icon_controller_1.IconController)
    .inSingletonScope();
//! Bindings - Services
container.bind(service_types_1.SERVICE_TYPES.AuthService).to(auth_service_1.AuthService).inSingletonScope();
container.bind(service_types_1.SERVICE_TYPES.IJwtService).to(jwt_service_1.default).inSingletonScope();
container
    .bind(service_types_1.SERVICE_TYPES.UserProfileService)
    .to(user_profile_service_1.default)
    .inSingletonScope();
container.bind(service_types_1.SERVICE_TYPES.FolderService).to(folder_service_1.FolderService).inSingletonScope();
container.bind(service_types_1.SERVICE_TYPES.NoteService).to(note_service_1.NoteService).inSingletonScope();
container.bind(service_types_1.SERVICE_TYPES.IconService).to(icon_service_1.IconService).inSingletonScope();
container.bind(service_types_1.SERVICE_TYPES.MailService).to(mail_service_1.MailService).inSingletonScope();
//! Bindings - Routers
container.bind(service_types_1.SERVICE_TYPES.IRouter).to(auth_router_1.default).inSingletonScope();
container.bind(service_types_1.SERVICE_TYPES.IRouter).to(user_profile_router_1.default).inSingletonScope();
container.bind(service_types_1.SERVICE_TYPES.IRouter).to(folder_router_1.default).inSingletonScope();
container.bind(service_types_1.SERVICE_TYPES.IRouter).to(note_router_1.default).inSingletonScope();
container.bind(service_types_1.SERVICE_TYPES.IRouter).to(icon_router_1.default).inSingletonScope();
//! Bindings - App
container.bind(service_types_1.SERVICE_TYPES.IAppRouter).to(app_router_1.default).inSingletonScope();
container.bind(service_types_1.SERVICE_TYPES.IApp).to(app_1.default).inSingletonScope();
