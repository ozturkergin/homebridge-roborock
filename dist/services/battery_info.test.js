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
const battery_info_1 = require("./battery_info");
const device_manager_mock_1 = require("./device_manager.mock");
const logger_mock_1 = require("../utils/logger.mock");
const config_service_1 = require("./config_service");
describe("BatteryInfo", () => {
    let batteryInfo;
    let deviceManagerMock;
    let hap;
    beforeEach(async () => {
        hap = HapJs;
        const log = (0, logger_mock_1.getLoggerMock)();
        deviceManagerMock = (0, device_manager_mock_1.createDeviceManagerMock)();
        const config = (0, config_service_1.applyConfigDefaults)({});
        batteryInfo = new battery_info_1.BatteryInfo({
            hap,
            log,
            config,
            deviceManager: deviceManagerMock,
        });
        await batteryInfo.init();
    });
    afterEach(() => {
        deviceManagerMock.stateChanged$.complete();
        jest.resetAllMocks();
    });
    describe("stateChanged$", () => {
        let updateBatteryLevelSpy;
        let updateStatusLowBatterySpy;
        let updateChargingStateSpy;
        beforeEach(() => {
            const [service] = batteryInfo.services;
            updateBatteryLevelSpy = jest.spyOn(service.getCharacteristic(hap.Characteristic.BatteryLevel), "updateValue");
            updateStatusLowBatterySpy = jest.spyOn(service.getCharacteristic(hap.Characteristic.StatusLowBattery), "updateValue");
            updateChargingStateSpy = jest.spyOn(service.getCharacteristic(hap.Characteristic.ChargingState), "updateValue");
        });
        test("updates the status of the battery on `batteryLevel` update (Battery low)", () => {
            deviceManagerMock.stateChanged$.next({
                key: "batteryLevel",
                value: 10,
            });
            expect(updateBatteryLevelSpy).toHaveBeenCalledWith(10);
            expect(updateStatusLowBatterySpy).toHaveBeenCalledWith(hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW);
            expect(updateChargingStateSpy).not.toHaveBeenCalled();
        });
        test("updates the status of the battery on `batteryLevel` update (Battery Level Normal)", () => {
            deviceManagerMock.stateChanged$.next({
                key: "batteryLevel",
                value: 20,
            });
            expect(updateBatteryLevelSpy).toHaveBeenCalledWith(20);
            expect(updateStatusLowBatterySpy).toHaveBeenCalledWith(hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
            expect(updateChargingStateSpy).not.toHaveBeenCalled();
        });
        test("updates the status of the battery on `charging` update (true)", () => {
            deviceManagerMock.stateChanged$.next({
                key: "charging",
                value: true,
            });
            expect(updateBatteryLevelSpy).not.toHaveBeenCalled();
            expect(updateStatusLowBatterySpy).not.toHaveBeenCalled();
            expect(updateChargingStateSpy).toHaveBeenCalledWith(hap.Characteristic.ChargingState.CHARGING);
        });
        test("updates the status of the battery on `charging` update (true)", () => {
            deviceManagerMock.stateChanged$.next({
                key: "charging",
                value: false,
            });
            expect(updateBatteryLevelSpy).not.toHaveBeenCalled();
            expect(updateStatusLowBatterySpy).not.toHaveBeenCalled();
            expect(updateChargingStateSpy).toHaveBeenCalledWith(hap.Characteristic.ChargingState.NOT_CHARGING);
        });
        test("does not update anything on unknown event", () => {
            deviceManagerMock.stateChanged$.next({
                key: "cleaning",
                value: false,
            });
            expect(updateBatteryLevelSpy).not.toHaveBeenCalled();
            expect(updateStatusLowBatterySpy).not.toHaveBeenCalled();
            expect(updateChargingStateSpy).not.toHaveBeenCalled();
        });
    });
    test("getBattery", async () => {
        jest.spyOn(deviceManagerMock.device, "batteryLevel").mockResolvedValue(3);
        const [service] = batteryInfo.services;
        await expect(service
            .getCharacteristic(hap.Characteristic.BatteryLevel)
            .handleGetRequest()).resolves.toStrictEqual(3);
    });
    test("getBatteryLow - low", async () => {
        jest.spyOn(deviceManagerMock.device, "batteryLevel").mockResolvedValue(3);
        const [service] = batteryInfo.services;
        await expect(service
            .getCharacteristic(hap.Characteristic.StatusLowBattery)
            .handleGetRequest()).resolves.toStrictEqual(hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW);
    });
    test("getBatteryLow - normal", async () => {
        jest.spyOn(deviceManagerMock.device, "batteryLevel").mockResolvedValue(25);
        const [service] = batteryInfo.services;
        await expect(service
            .getCharacteristic(hap.Characteristic.StatusLowBattery)
            .handleGetRequest()).resolves.toStrictEqual(hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
    });
    test("getCharging - true", async () => {
        deviceManagerMock.state = "charging";
        const [service] = batteryInfo.services;
        await expect(service
            .getCharacteristic(hap.Characteristic.ChargingState)
            .handleGetRequest()).resolves.toStrictEqual(hap.Characteristic.ChargingState.CHARGING);
    });
    test("getCharging - false", async () => {
        const [service] = batteryInfo.services;
        await expect(service
            .getCharacteristic(hap.Characteristic.ChargingState)
            .handleGetRequest()).resolves.toStrictEqual(hap.Characteristic.ChargingState.NOT_CHARGING);
    });
});
//# sourceMappingURL=battery_info.test.js.map