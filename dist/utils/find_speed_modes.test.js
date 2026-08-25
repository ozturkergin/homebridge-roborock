"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const find_speed_modes_1 = require("./find_speed_modes");
const models_1 = require("../models");
describe("findSpeedModes", () => {
    test("should assign the viomi model for any model starting with 'viomi.'", () => {
        expect((0, find_speed_modes_1.findSpeedModes)("viomi.one")).toStrictEqual(models_1.MODELS.viomi[0]);
        expect((0, find_speed_modes_1.findSpeedModes)("viomi.two")).toStrictEqual(models_1.MODELS.viomi[0]);
    });
    test("should return the default model for unlisted models", () => {
        expect((0, find_speed_modes_1.findSpeedModes)("random-model")).toStrictEqual(models_1.MODELS.default[0]);
    });
    test("should return a known model in the list", () => {
        expect((0, find_speed_modes_1.findSpeedModes)("roborock.vacuum.s5")).toStrictEqual(models_1.MODELS["roborock.vacuum.s5"][0]);
    });
    test("should apply the firmware version to choose a different set of speeds", () => {
        expect((0, find_speed_modes_1.findSpeedModes)("roborock.vacuum.s5", "3.5.7")).toStrictEqual(models_1.MODELS["roborock.vacuum.s5"][1]);
    });
});
//# sourceMappingURL=find_speed_modes.test.js.map