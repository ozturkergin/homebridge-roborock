"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./device_manager.test.mock");
const logger_mock_1 = require("../utils/logger.mock");
const test_mocks_1 = require("../test.mocks");
const device_manager_1 = require("./device_manager");
describe("DeviceManager", () => {
    const log = (0, logger_mock_1.getLoggerMock)();
    describe("constructor", () => {
        test("Fails if no IP provided", () => {
            expect(() => new device_manager_1.DeviceManager((0, test_mocks_1.createHomebridgeMock)().hap, log, {})).toThrow("You must provide an ip address of the vacuum cleaner.");
        });
        test("Fails if no token provided", () => {
            expect(() => new device_manager_1.DeviceManager((0, test_mocks_1.createHomebridgeMock)().hap, log, {
                ip: "192.168.0.1",
            })).toThrow("You must provide a token of the vacuum cleaner.");
        });
        test("Does not fail if ip and token are provided (but fails to connects)", () => {
            expect(() => new device_manager_1.DeviceManager((0, test_mocks_1.createHomebridgeMock)().hap, log, {
                ip: "192.168.0.1",
                token: "token",
            })).not.toThrow();
        });
    });
    describe("get device", () => {
        test("fails when not connected yet", () => {
            const deviceManager = new device_manager_1.DeviceManager((0, test_mocks_1.createHomebridgeMock)().hap, log, {
                ip: "192.168.0.1",
                token: "token",
            });
            expect(deviceManager.model).toStrictEqual("unknown");
            expect(deviceManager.state).toBeUndefined();
            expect(deviceManager.isCleaning).toStrictEqual(false);
            expect(deviceManager.isPaused).toStrictEqual(false);
        });
        test("connects and loads", async () => {
            test_mocks_1.miio.device.matches.mockReturnValue(true);
            test_mocks_1.miio.device.property.mockReturnValue("cleaning");
            const deviceManager = new device_manager_1.DeviceManager((0, test_mocks_1.createHomebridgeMock)().hap, log, {
                ip: "192.168.0.1",
                token: "token",
            });
            await new Promise((resolve) => process.nextTick(resolve));
            expect(deviceManager.model).toStrictEqual("test-model");
            expect(deviceManager.device).toStrictEqual(test_mocks_1.miio.device);
            expect(deviceManager.state).toStrictEqual("cleaning");
            expect(deviceManager.isCleaning).toStrictEqual(true);
            expect(deviceManager.isPaused).toStrictEqual(false);
        });
    });
});
//# sourceMappingURL=device_manager.test.js.map