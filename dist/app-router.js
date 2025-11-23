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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const service_types_1 = require("./service.types");
let AppRouter = class AppRouter {
    routers;
    constructor(routers) {
        this.routers = routers;
    }
    run(app) {
        this.routers.forEach((router) => {
            router.setupRoutes();
            app.use(router.path, router.router);
        });
    }
};
AppRouter = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.multiInject)(service_types_1.SERVICE_TYPES.IRouter)),
    __metadata("design:paramtypes", [Array])
], AppRouter);
exports.default = AppRouter;
