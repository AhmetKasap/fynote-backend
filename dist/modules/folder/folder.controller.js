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
exports.FolderController = void 0;
const inversify_1 = require("inversify");
const service_types_1 = require("../../service.types");
const response_builder_1 = __importDefault(require("../../shared/response.builder"));
const folder_service_1 = require("./folder.service");
let FolderController = class FolderController {
    folderService;
    constructor(folderService) {
        this.folderService = folderService;
    }
    getFolders = async (req, res) => {
        const userId = req.user.id;
        const folders = await this.folderService.getFolders(userId);
        return response_builder_1.default.ok(res, folders, "Klasörler başarıyla getirildi");
    };
    getFolder = async (req, res) => {
        const { id } = req.params;
        const userId = req.user.id;
        const folder = await this.folderService.getFolder({ id }, userId);
        return response_builder_1.default.ok(res, folder, "Klasör başarıyla getirildi");
    };
    createFolder = async (req, res) => {
        const dto = req.body;
        const userId = req.user.id;
        const folder = await this.folderService.createFolder(dto, userId);
        return response_builder_1.default.created(res, folder, "Klasör başarıyla oluşturuldu");
    };
    updateFolder = async (req, res) => {
        const { id } = req.params;
        const dto = req.body;
        const userId = req.user.id;
        const folder = await this.folderService.updateFolder({ id }, dto, userId);
        return response_builder_1.default.ok(res, folder, "Klasör başarıyla güncellendi");
    };
    deleteFolder = async (req, res) => {
        const { id } = req.params;
        const userId = req.user.id;
        await this.folderService.deleteFolder({ id }, userId);
        return response_builder_1.default.ok(res, null, "Klasör başarıyla silindi");
    };
};
exports.FolderController = FolderController;
exports.FolderController = FolderController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(service_types_1.SERVICE_TYPES.FolderService)),
    __metadata("design:paramtypes", [folder_service_1.FolderService])
], FolderController);
