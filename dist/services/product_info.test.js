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
const product_info_1 = require("./product_info");
const device_manager_mock_1 = require("./device_manager.mock");
const logger_mock_1 = require("../utils/logger.mock");
const config_service_1 = require("./config_service");
describe("ProductInfo", () => {
    let productInfo;
    let deviceManagerMock;
    let hap;
    beforeEach(async () => {
        hap = HapJs;
        const log = (0, logger_mock_1.getLoggerMock)();
        deviceManagerMock = (0, device_manager_mock_1.createDeviceManagerMock)();
        const config = (0, config_service_1.applyConfigDefaults)({});
        productInfo = new product_info_1.ProductInfo({
            hap,
            log,
            config,
            deviceManager: deviceManagerMock,
        });
        await productInfo.init();
    });
    afterEach(() => {
        deviceManagerMock.stateChanged$.complete();
        jest.resetAllMocks();
    });
    describe("deviceConnected$", () => {
        let updateCharacteristicSpy;
        beforeEach(() => {
            const [service] = productInfo.services;
            updateCharacteristicSpy = jest.spyOn(service, "updateCharacteristic");
        });
        test("fetches the serial number and firmware on first connection", async () => {
            jest
                .spyOn(deviceManagerMock.device, "getSerialNumber")
                .mockResolvedValue("1234");
            jest
                .spyOn(deviceManagerMock.device, "getDeviceInfo")
                .mockResolvedValue({ fw_ver: "1.2.3" });
            deviceManagerMock.deviceConnected$.next({});
            await new Promise((resolve) => process.nextTick(resolve));
            expect(updateCharacteristicSpy).toHaveBeenCalledTimes(3);
            expect(updateCharacteristicSpy).toHaveBeenNthCalledWith(1, hap.Characteristic.Model, "test-model");
            expect(updateCharacteristicSpy).toHaveBeenNthCalledWith(2, hap.Characteristic.SerialNumber, "1234");
            expect(updateCharacteristicSpy).toHaveBeenNthCalledWith(3, hap.Characteristic.FirmwareRevision, "1.2.3");
        });
        test("handles errors", async () => {
            const err = new Error("Something went terribly wrong");
            jest
                .spyOn(deviceManagerMock.device, "getSerialNumber")
                .mockRejectedValue(err);
            jest
                .spyOn(deviceManagerMock.device, "getDeviceInfo")
                .mockRejectedValue(err);
            deviceManagerMock.deviceConnected$.next({});
            await new Promise((resolve) => process.nextTick(resolve));
            expect(updateCharacteristicSpy).toHaveBeenCalledTimes(3);
            expect(updateCharacteristicSpy).toHaveBeenNthCalledWith(1, hap.Characteristic.Model, "test-model");
            expect(updateCharacteristicSpy).toHaveBeenNthCalledWith(2, hap.Characteristic.SerialNumber, "Unknown");
            expect(updateCharacteristicSpy).toHaveBeenNthCalledWith(3, hap.Characteristic.FirmwareRevision, "unknown");
        });
    });
    test("getFirmware", async () => {
        jest
            .spyOn(deviceManagerMock.device, "getDeviceInfo")
            .mockResolvedValue({ fw_ver: "1.2.3" });
        const [service] = productInfo.services;
        await expect(service
            .getCharacteristic(hap.Characteristic.FirmwareRevision)
            .handleGetRequest()).resolves.toStrictEqual("1.2.3");
    });
    test("getModel", async () => {
        const [service] = productInfo.services;
        await expect(service.getCharacteristic(hap.Characteristic.Model).handleGetRequest()).resolves.toStrictEqual("test-model");
    });
    test("getSerialNumber", async () => {
        jest
            .spyOn(deviceManagerMock.device, "getSerialNumber")
            .mockResolvedValue("1234");
        const [service] = productInfo.services;
        await expect(service
            .getCharacteristic(hap.Characteristic.SerialNumber)
            .handleGetRequest()).resolves.toStrictEqual("1234");
    });
    test("getManufacturer", async () => {
        const [service] = productInfo.services;
        await expect(service
            .getCharacteristic(hap.Characteristic.Manufacturer)
            .handleGetRequest()).resolves.toStrictEqual("Xiaomi");
    });
});
//# sourceMappingURL=product_info.test.js.map