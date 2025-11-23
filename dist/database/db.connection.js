"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectMongoDB = async (MONGODB_URL) => {
    try {
        await mongoose_1.default.connect(MONGODB_URL);
        console.log("MongoDB connected successfully");
    }
    catch (err) {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    }
};
exports.default = connectMongoDB;
