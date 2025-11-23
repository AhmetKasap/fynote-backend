"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteModel = void 0;
const mongoose_1 = require("mongoose");
const noteSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    folderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Folder", required: false },
    icon: { type: mongoose_1.Schema.Types.ObjectId, ref: "Icon", required: false },
    title: { type: String, required: true },
    contentText: { type: String, required: true },
    contentJson: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.NoteModel = (0, mongoose_1.model)("Note", noteSchema);
