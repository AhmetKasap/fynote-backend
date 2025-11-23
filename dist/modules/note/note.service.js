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
exports.NoteService = void 0;
const inversify_1 = require("inversify");
const note_model_1 = require("../../database/models/note.model");
const folder_model_1 = require("../../database/models/folder.model");
const icon_model_1 = require("../../database/models/icon.model");
const api_error_1 = __importDefault(require("../../shared/api.error"));
let NoteService = class NoteService {
    async getNotes(userId, folderId) {
        const query = { userId };
        if (folderId) {
            query.folderId = folderId;
        }
        const notes = await note_model_1.NoteModel.find(query).populate("icon").lean();
        return notes.map((note) => ({
            id: note._id.toString(),
            userId: note.userId.toString(),
            folderId: note.folderId?.toString(),
            icon: note.icon
                ? {
                    id: note.icon._id.toString(),
                    name: note.icon.name,
                    fileUrl: note.icon.fileUrl
                }
                : undefined,
            title: note.title,
            contentText: note.contentText,
            contentJson: note.contentJson
        }));
    }
    async getNote(noteId, userId) {
        const note = await note_model_1.NoteModel.findOne({
            _id: noteId.id,
            userId
        })
            .populate("icon")
            .lean();
        if (!note) {
            throw api_error_1.default.NotFound("Not bulunamadı");
        }
        return {
            id: note._id.toString(),
            userId: note.userId.toString(),
            folderId: note.folderId?.toString(),
            icon: note.icon
                ? {
                    id: note.icon._id.toString(),
                    name: note.icon.name,
                    fileUrl: note.icon.fileUrl
                }
                : undefined,
            title: note.title,
            contentText: note.contentText,
            contentJson: note.contentJson
        };
    }
    async createNote(dto, userId) {
        if (dto.folderId) {
            const folder = await folder_model_1.FolderModel.findOne({
                _id: dto.folderId,
                userId
            });
            if (!folder) {
                throw api_error_1.default.NotFound("Klasör bulunamadı");
            }
        }
        if (dto.iconId) {
            const icon = await icon_model_1.IconModel.findById(dto.iconId);
            if (!icon) {
                throw api_error_1.default.NotFound("İkon bulunamadı");
            }
        }
        const note = await note_model_1.NoteModel.create({
            userId,
            folderId: dto.folderId,
            icon: dto.iconId,
            title: dto.title,
            contentText: dto.contentText,
            contentJson: dto.contentJson,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        const populatedNote = await note_model_1.NoteModel.findById(note._id)
            .populate("icon")
            .lean();
        if (!populatedNote) {
            throw api_error_1.default.InternalServerError("Not oluşturulamadı");
        }
        return {
            id: populatedNote._id.toString(),
            userId: populatedNote.userId.toString(),
            folderId: populatedNote.folderId?.toString(),
            icon: populatedNote.icon
                ? {
                    id: populatedNote.icon._id.toString(),
                    name: populatedNote.icon.name,
                    fileUrl: populatedNote.icon.fileUrl
                }
                : undefined,
            title: populatedNote.title,
            contentText: populatedNote.contentText,
            contentJson: populatedNote.contentJson
        };
    }
    async updateNote(noteId, dto, userId) {
        const note = await note_model_1.NoteModel.findOne({
            _id: noteId.id,
            userId
        });
        if (!note) {
            throw api_error_1.default.NotFound("Not bulunamadı");
        }
        if (dto.folderId !== undefined) {
            if (dto.folderId) {
                const folder = await folder_model_1.FolderModel.findOne({
                    _id: dto.folderId,
                    userId
                });
                if (!folder) {
                    throw api_error_1.default.NotFound("Klasör bulunamadı");
                }
                note.folderId = dto.folderId;
            }
            else {
                note.folderId = undefined;
            }
        }
        if (dto.iconId !== undefined) {
            if (dto.iconId) {
                const icon = await icon_model_1.IconModel.findById(dto.iconId);
                if (!icon) {
                    throw api_error_1.default.NotFound("İkon bulunamadı");
                }
                note.icon = dto.iconId;
            }
            else {
                note.icon = undefined;
            }
        }
        if (dto.title)
            note.title = dto.title;
        if (dto.contentText)
            note.contentText = dto.contentText;
        if (dto.contentJson)
            note.contentJson = dto.contentJson;
        note.updatedAt = new Date();
        await note.save();
        const populatedNote = await note_model_1.NoteModel.findById(note._id)
            .populate("icon")
            .lean();
        if (!populatedNote) {
            throw api_error_1.default.InternalServerError("Not güncellenemedi");
        }
        return {
            id: populatedNote._id.toString(),
            userId: populatedNote.userId.toString(),
            folderId: populatedNote.folderId?.toString(),
            icon: populatedNote.icon
                ? {
                    id: populatedNote.icon._id.toString(),
                    name: populatedNote.icon.name,
                    fileUrl: populatedNote.icon.fileUrl
                }
                : undefined,
            title: populatedNote.title,
            contentText: populatedNote.contentText,
            contentJson: populatedNote.contentJson
        };
    }
    async deleteNote(noteId, userId) {
        const note = await note_model_1.NoteModel.findOne({
            _id: noteId.id,
            userId
        });
        if (!note) {
            throw api_error_1.default.NotFound("Not bulunamadı");
        }
        await note_model_1.NoteModel.deleteOne({ _id: noteId.id });
        return true;
    }
};
exports.NoteService = NoteService;
exports.NoteService = NoteService = __decorate([
    (0, inversify_1.injectable)()
], NoteService);
