"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSpeedModes = findSpeedModes;
const models_1 = require("../models");
const semver_1 = __importDefault(require("semver"));
function findSpeedModes(model, firmware) {
    if (model.startsWith("viomi.")) {
        return models_1.MODELS.viomi[0];
    }
    return (models_1.MODELS[model] || []).reduce((acc, option) => {
        if (option.firmware) {
            const [, cleanFirmware] = (firmware || "").match(/^(\d+\.\d+\.\d+)/) || [];
            return semver_1.default.satisfies(cleanFirmware, option.firmware) ? option : acc;
        }
        else {
            return option;
        }
    }, models_1.MODELS.default[0]);
}
//# sourceMappingURL=find_speed_modes.js.map