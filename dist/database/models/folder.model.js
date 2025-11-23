"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderModel = void 0;
const mongoose_1 = require("mongoose");
const folderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    icon: { type: mongoose_1.Schema.Types.ObjectId, ref: "Icon", required: false },
    color: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.FolderModel = (0, mongoose_1.model)("Folder", folderSchema);
