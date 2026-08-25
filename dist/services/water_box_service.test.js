"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const HapJs = __importStar(require("hap-nodejs"));
const water_box_service_test_mock_1 = require("./water_box_service.test.mock");
const water_box_service_1 = require("./water_box_service");
const logger_mock_1 = require("../utils/logger.mock");
const config_service_1 = require("./config_service");
const device_manager_mock_1 = require("./device_manager.mock");
const main_service_mock_1 = require("./main_service.mock");
const product_info_mock_1 = require("./product_info.mock");
const watermodes_1 = require("../models/watermodes");
describe("WaterBoxService", () => {
    let waterboxService;
    let deviceManagerMock;
    let mainService;
    let hap;
    let productInfoService;
    let log;
    beforeEach(async () => {
        hap = HapJs;
        log = (0, logger_mock_1.getLoggerMock)();
        deviceManagerMock = (0, device_manager_mock_1.createDeviceManagerMock)();
        productInfoService = (0, product_info_mock_1.createProductInfoMock)();
        mainService = (0, main_service_mock_1.createMainServiceMock)();
        const config = (0, config_service_1.applyConfigDefaults)({ legacyCareSensors: true });
        waterboxService = new water_box_service_1.WaterBoxService({
            hap,
            log,
            config,
            deviceManager: deviceManagerMock,
        }, productInfoService, mainService);
        await waterboxService.init();
    });
    afterEach(() => {
        water_box_service_test_mock_1.findSpeedModesMock.mockClear();
    });
    test("only 1 service is exposed", () => {
        expect(waterboxService.services).toHaveLength(1);
    });
    test("registers 4 characteristics", () => {
        const service = waterboxService.services[0];
        expect(service.characteristics).toHaveLength(4);
    });
    describe("Characteristic getters", () => {
        test("should return rotation speed 0 and ON as false (no water mode supported)", async () => {
            const service = waterboxService.services[0];
            await expect(service.getCharacteristic(hap.Characteristic.On)["getHandler"]()).resolves.toEqual(false);
            await expect(service
                .getCharacteristic(hap.Characteristic.RotationSpeed)["getHandler"]()).resolves.toEqual(0);
        });
        test("should return rotation speed 0 and ON as false (actually off)", async () => {
            water_box_service_test_mock_1.findSpeedModesMock.mockReturnValueOnce({ waterspeed: watermodes_1.watermodes.gen1 });
            deviceManagerMock.device.getWaterBoxMode = jest
                .fn()
                .mockResolvedValue(200);
            const service = waterboxService.services[0];
            await expect(service.getCharacteristic(hap.Characteristic.On)["getHandler"]()).resolves.toEqual(false);
            await expect(service
                .getCharacteristic(hap.Characteristic.RotationSpeed)["getHandler"]()).resolves.toEqual(0);
        });
        test("should return rotation speed 35 and ON as true", async () => {
            water_box_service_test_mock_1.findSpeedModesMock.mockReturnValueOnce({ waterspeed: watermodes_1.watermodes.gen1 });
            water_box_service_test_mock_1.findSpeedModesMock.mockReturnValueOnce({ waterspeed: watermodes_1.watermodes.gen1 });
            deviceManagerMock.device.getWaterBoxMode = jest
                .fn()
                .mockResolvedValue(201);
            const service = waterboxService.services[0];
            await expect(service.getCharacteristic(hap.Characteristic.On)["getHandler"]()).resolves.toEqual(true);
            await expect(service
                .getCharacteristic(hap.Characteristic.RotationSpeed)["getHandler"]()).resolves.toEqual(35);
        });
    });
    describe("Characteristics setters", () => {
        test("should log and stop when water mode is not supported (rotation speed)", async () => {
            const service = waterboxService.services[0];
            service.getCharacteristic(hap.Characteristic.RotationSpeed).setValue(35);
            await new Promise((resolve) => process.nextTick(resolve));
            expect(log.info).toHaveBeenCalledWith("setWaterSpeed | Model does not support the water mode");
        });
        test("should log and stop when water mode is not supported (on/off)", async () => {
            const service = waterboxService.services[0];
            service.getCharacteristic(hap.Characteristic.On).setValue(false);
            await new Promise((resolve) => process.nextTick(resolve));
            expect(log.info).toHaveBeenCalledWith("setWaterSpeed | Model does not support the water mode");
        });
        test("setting to ON does nothing", async () => {
            const service = waterboxService.services[0];
            service.getCharacteristic(hap.Characteristic.On).setValue(true);
            await new Promise((resolve) => process.nextTick(resolve));
            expect(log.info).not.toHaveBeenCalledWith("setWaterSpeed | Model does not support the water mode");
        });
        test("should disable water mode on OFF", async () => {
            expect(mainService.cachedState.get("WaterSpeed")).toBeUndefined();
            expect(mainService.cachedState.get("WaterSpeedName")).toBeUndefined();
            water_box_service_test_mock_1.findSpeedModesMock.mockReturnValueOnce({ waterspeed: watermodes_1.watermodes.gen1 });
            const service = waterboxService.services[0];
            service.getCharacteristic(hap.Characteristic.On).setValue(false);
            await new Promise((resolve) => process.nextTick(resolve));
            expect(mainService.cachedState.get("WaterSpeed")).toBe(200);
            expect(mainService.cachedState.get("WaterSpeedName")).toBe("Off");
        });
    });
    // TODO: Add more tests
});
//# sourceMappingURL=water_box_service.test.js.map