"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const icon_model_1 = require("./models/icon.model");
const iconsData = [
    { name: "fitness", fileUrl: "/icons/fit.svg" },
    { name: "trip-bag", fileUrl: "/icons/trip-bag.svg" }
];
const config = new config_1.Config();
const iconsDataWithUrl = iconsData.map((icon) => ({
    ...icon,
    fileUrl: `${config.SERVER_URL}${icon.fileUrl}`
}));
const iconSeeder = async () => {
    const icons = await icon_model_1.IconModel.insertMany(iconsDataWithUrl);
    return icons;
};
exports.default = iconSeeder;
