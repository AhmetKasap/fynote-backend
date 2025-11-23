"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderService = void 0;
const inversify_1 = require("inversify");
const folder_model_1 = require("../../database/models/folder.model");
const note_model_1 = require("../../database/models/note.model");
const icon_model_1 = require("../../database/models/icon.model");
const api_error_1 = __importDefault(require("../../shared/api.error"));
const mongoose_1 = require("mongoose");
let FolderService = class FolderService {
    async getFolders(userId) {
        const folders = await folder_model_1.FolderModel.find({ userId })
            .populate("icon")
            .lean();
        return folders.map((folder) => ({
            id: folder._id.toString(),
            userId: folder.userId.toString(),
            name: folder.name,
            icon: folder.icon
                ? {
                    id: folder.icon._id.toString(),
                    name: folder.icon.name,
                    fileUrl: folder.icon.fileUrl
                }
                : undefined,
            color: folder.color
        }));
    }
    async getFolder(folderId, userId) {
        const folder = await folder_model_1.FolderModel.findOne({
            _id: folderId.id,
            userId
        })
            .populate("icon")
            .lean();
        if (!folder) {
            throw api_error_1.default.NotFound("Klasör bulunamadı");
        }
        return {
            id: folder._id.toString(),
            userId: folder.userId.toString(),
            name: folder.name,
            icon: folder.icon
                ? {
                    id: folder.icon._id.toString(),
                    name: folder.icon.name,
                    fileUrl: folder.icon.fileUrl
                }
                : undefined,
            color: folder.color
        };
    }
    async createFolder(dto, userId) {
        if (dto.iconId) {
            const icon = await icon_model_1.IconModel.findById(new mongoose_1.Types.ObjectId(dto.iconId));
            if (!icon) {
                throw api_error_1.default.NotFound("İkon bulunamadı");
            }
        }
        const folder = await folder_model_1.FolderModel.create({
            userId,
            name: dto.name,
            icon: dto.iconId,
            color: dto.color,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const populatedFolder = await folder_model_1.FolderModel.findById(folder._id)
            .populate("icon")
            .lean();
        if (!populatedFolder) {
            throw api_error_1.default.InternalServerError("Klasör oluşturulamadı");
        }
        return {
            id: populatedFolder._id.toString(),
            userId: populatedFolder.userId.toString(),
            name: populatedFolder.name,
            icon: populatedFolder.icon
                ? {
                    id: populatedFolder.icon._id.toString(),
                    name: populatedFolder.icon.name,
                    fileUrl: populatedFolder.icon.fileUrl
                }
                : undefined,
            color: populatedFolder.color
        };
    }
    async updateFolder(folderId, dto, userId) {
        const folder = await folder_model_1.FolderModel.findOne({
            _id: folderId.id,
            userId
        });
        if (!folder) {
            throw api_error_1.default.NotFound("Klasör bulunamadı");
        }
        if (dto.name)
            folder.name = dto.name;
        if (dto.color !== undefined)
            folder.color = dto.color;
        if (dto.iconId !== undefined) {
            if (dto.iconId) {
                const icon = await icon_model_1.IconModel.findById(dto.iconId);
                if (!icon) {
                    throw api_error_1.default.NotFound("İkon bulunamadı");
                }
                folder.icon = dto.iconId;
            }
            else {
                folder.icon = undefined;
            }
        }
        folder.updatedAt = new Date();
        await folder.save();
        const populatedFolder = await folder_model_1.FolderModel.findById(folder._id)
            .populate("icon")
            .lean();
        if (!populatedFolder) {
            throw api_error_1.default.InternalServerError("Klasör güncellenemedi");
        }
        return {
            id: populatedFolder._id.toString(),
            userId: populatedFolder.userId.toString(),
            name: populatedFolder.name,
            icon: populatedFolder.icon
                ? {
                    id: populatedFolder.icon._id.toString(),
                    name: populatedFolder.icon.name,
                    fileUrl: populatedFolder.icon.fileUrl
                }
                : undefined,
            color: populatedFolder.color
        };
    }
    async deleteFolder(folderId, userId) {
        const folder = await folder_model_1.FolderModel.findOne({
            _id: folderId.id,
            userId
        });
        if (!folder) {
            throw api_error_1.default.NotFound("Klasör bulunamadı");
        }
        await note_model_1.NoteModel.deleteMany({ folderId: folderId.id });
        await folder_model_1.FolderModel.deleteOne({ _id: folderId.id });
        return true;
    }
};
exports.FolderService = FolderService;
exports.FolderService = FolderService = __decorate([
    (0, inversify_1.injectable)()
], FolderService);
