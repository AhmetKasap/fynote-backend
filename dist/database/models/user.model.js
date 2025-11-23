"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isEmailActivated: { type: Boolean, default: false },
    emailActivationCode: { type: String, required: false },
    emailActivationExpires: { type: Date, required: false },
    passwordResetCode: { type: String, required: false },
    passwordResetExpires: { type: Date, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
exports.UserModel = (0, mongoose_1.model)("User", userSchema);
