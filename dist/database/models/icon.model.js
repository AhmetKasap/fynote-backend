"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconModel = void 0;
const mongoose_1 = require("mongoose");
const iconSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    fileUrl: { type: String, required: true }
});
exports.IconModel = (0, mongoose_1.model)("Icon", iconSchema);
