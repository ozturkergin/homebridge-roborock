"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceManagerMock = void 0;
const device_manager_mock_1 = require("./services/device_manager.mock");
exports.deviceManagerMock = (0, device_manager_mock_1.createDeviceManagerMock)();
jest.doMock("./services/device_manager", () => ({
    DeviceManager: jest.fn().mockReturnValue(exports.deviceManagerMock),
}));
//# sourceMappingURL=xiaomi_roborock_vacuum_accessory.test.mock.js.map