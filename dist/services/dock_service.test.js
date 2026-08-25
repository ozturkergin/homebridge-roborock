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
const dock_service_1 = require("./dock_service");
const device_manager_mock_1 = require("./device_manager.mock");
const logger_mock_1 = require("../utils/logger.mock");
const config_service_1 = require("./config_service");
describe("DockService", () => {
    let dockService;
    let deviceManagerMock;
    let hap;
    beforeEach(async () => {
        hap = HapJs;
        const log = (0, logger_mock_1.getLoggerMock)();
        deviceManagerMock = (0, device_manager_mock_1.createDeviceManagerMock)();
        const config = (0, config_service_1.applyConfigDefaults)({});
        dockService = new dock_service_1.DockService({
            hap,
            log,
            config,
            deviceManager: deviceManagerMock,
        });
        await dockService.init();
    });
    afterEach(() => {
        deviceManagerMock.stateChanged$.complete();
        jest.resetAllMocks();
    });
    describe("stateChanged$", () => {
        let occupancyDetectedSpy;
        beforeEach(() => {
            const [service] = dockService.services;
            occupancyDetectedSpy = jest.spyOn(service.getCharacteristic(hap.Characteristic.OccupancyDetected), "updateValue");
        });
        test("updates the service on `charging` update (true)", () => {
            deviceManagerMock.stateChanged$.next({
                key: "charging",
                value: true,
            });
            expect(occupancyDetectedSpy).toHaveBeenCalledWith(true);
        });
        test("updates the service on `charging` update (true)", () => {
            deviceManagerMock.stateChanged$.next({
                key: "charging",
                value: false,
            });
            expect(occupancyDetectedSpy).toHaveBeenCalledWith(false);
        });
    });
    test("getDocked - true", async () => {
        deviceManagerMock.state = "charging";
        const [service] = dockService.services;
        await expect(service
            .getCharacteristic(hap.Characteristic.OccupancyDetected)
            .handleGetRequest()).resolves.toStrictEqual(hap.Characteristic.OccupancyDetected.OCCUPANCY_DETECTED);
    });
    test("getDocked - false", async () => {
        const [service] = dockService.services;
        await expect(service
            .getCharacteristic(hap.Characteristic.OccupancyDetected)
            .handleGetRequest()).resolves.toStrictEqual(hap.Characteristic.OccupancyDetected.OCCUPANCY_NOT_DETECTED);
    });
});
//# sourceMappingURL=dock_service.test.js.map