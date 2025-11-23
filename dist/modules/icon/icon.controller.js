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
exports.IconController = void 0;
const inversify_1 = require("inversify");
const service_types_1 = require("../../service.types");
const response_builder_1 = __importDefault(require("../../shared/response.builder"));
const icon_service_1 = require("./icon.service");
let IconController = class IconController {
    iconService;
    constructor(iconService) {
        this.iconService = iconService;
    }
    getIcons = async (_req, res) => {
        const icons = await this.iconService.getIcons();
        return response_builder_1.default.ok(res, icons, "Get icons successfully");
    };
};
exports.IconController = IconController;
exports.IconController = IconController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_types_1.SERVICE_TYPES.IconService)),
    __metadata("design:paramtypes", [icon_service_1.IconService])
], IconController);
