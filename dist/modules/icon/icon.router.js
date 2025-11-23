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
const express_1 = require("express");
const inversify_1 = require("inversify");
const service_types_1 = require("../../service.types");
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const icon_controller_1 = require("./icon.controller");
let IconRouter = class IconRouter {
    iconController;
    router = (0, express_1.Router)();
    path = "/api/v1/icons";
    constructor(iconController) {
        this.iconController = iconController;
    }
    setupRoutes() {
        this.router.use((0, auth_middleware_1.default)());
        this.router.get("/", this.iconController.getIcons);
    }
};
IconRouter = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_types_1.SERVICE_TYPES.IconController)),
    __metadata("design:paramtypes", [icon_controller_1.IconController])
], IconRouter);
exports.default = IconRouter;
