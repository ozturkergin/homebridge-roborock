"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findSpeedModesMock = void 0;
exports.findSpeedModesMock = jest.fn().mockReturnValue({});
jest.doMock("../utils/find_speed_modes", () => ({
    findSpeedModes: exports.findSpeedModesMock,
}));
//# sourceMappingURL=water_box_service.test.mock.js.map