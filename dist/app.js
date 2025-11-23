"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const inversify_1 = require("inversify");
const service_types_1 = require("./service.types");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app_router_1 = __importDefault(require("./app-router"));
const error_handler_1 = __importDefault(require("./middlewares/error.handler"));
const db_connection_1 = __importDefault(require("./database/db.connection"));
const path_1 = __importDefault(require("path"));
const icon_seeder_1 = __importDefault(require("./database/icon.seeder"));
let App = class App {
    config;
    appRouter;
    app;
    httpServer;
    constructor(config, appRouter) {
        this.config = config;
        this.appRouter = appRouter;
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, cors_1.default)());
        app.use("/public", express_1.default.static(path_1.default.join(__dirname, "public")));
        this.app = app;
        this.httpServer = (0, http_1.createServer)(this.app);
    }
    async start() {
        this.appRouter.run(this.app);
        (0, db_connection_1.default)(this.config.MONGODB_URL);
        (0, icon_seeder_1.default)();
        this.httpServer.listen(this.config.PORT, () => {
            console.log(`Server is running on port ${this.config.PORT}`);
        });
    }
    async afterStart() {
        this.app.use(error_handler_1.default);
    }
};
App = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_types_1.SERVICE_TYPES.IConfig)),
    __param(1, (0, inversify_1.inject)(service_types_1.SERVICE_TYPES.IAppRouter)),
    __metadata("design:paramtypes", [Object, app_router_1.default])
], App);
exports.default = App;
