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
const care_service_1 = require("./care_service");
const test_mocks_1 = require("../test.mocks");
const logger_mock_1 = require("../utils/logger.mock");
const config_service_1 = require("./config_service");
const device_manager_mock_1 = require("./device_manager.mock");
describe("CareService", () => {
    describe("legacyCareSensors", () => {
        let careService;
        let deviceManagerMock;
        let fanServices;
        let hap;
        beforeEach(() => {
            hap = HapJs;
            const log = (0, logger_mock_1.getLoggerMock)();
            deviceManagerMock = (0, device_manager_mock_1.createDeviceManagerMock)();
            deviceManagerMock.property.mockReturnValue(10);
            fanServices = jest.fn();
            const fan = {
                get services() {
                    return fanServices();
                },
            };
            const config = (0, config_service_1.applyConfigDefaults)({ legacyCareSensors: true });
            careService = new care_service_1.CareService({
                hap,
                log,
                config,
                deviceManager: deviceManagerMock,
            }, fan);
        });
        test("fan is not called", () => {
            expect(fanServices).not.toHaveBeenCalled();
        });
        test("only 1 service is exposed", () => {
            expect(careService.services).toHaveLength(1);
        });
        test("the custom Care service characteristics call all getters", async () => {
            const service = careService.services[0];
            expect(service.characteristics).toHaveLength(5);
            const [name, ...characteristics] = service.characteristics;
            const onCallsHandlers = characteristics.map((characteristic) => characteristic["getHandler"]);
            for (const listener of onCallsHandlers) {
                await expect(listener()).resolves.toMatchSnapshot();
            }
        });
    });
    describe("nativeCareSensors", () => {
        let careService;
        let deviceManagerMock;
        let fanServices;
        let hap;
        beforeEach(() => {
            const hbMock = (0, test_mocks_1.createHomebridgeMock)();
            hap = HapJs;
            const log = (0, logger_mock_1.getLoggerMock)();
            deviceManagerMock = (0, device_manager_mock_1.createDeviceManagerMock)();
            deviceManagerMock.property.mockReturnValue(10);
            fanServices = jest
                .fn()
                .mockImplementation(() => [new hbMock.hap.Service.Fan()]);
            const fan = {
                get services() {
                    return fanServices();
                },
            };
            const config = (0, config_service_1.applyConfigDefaults)({});
            careService = new care_service_1.CareService({
                hap,
                log,
                config,
                deviceManager: deviceManagerMock,
            }, fan);
        });
        test("fan is called", () => {
            expect(fanServices).toHaveBeenCalledTimes(1);
        });
        test("4 services are exposed", () => {
            expect(careService.services).toHaveLength(4);
        });
        test("the fan's service characteristic calls all getters", async () => {
            const fanService = fanServices.mock.results[0].value[0];
            expect(fanService.getCharacteristic.mock.results).toHaveLength(2);
            const onCallsHandlers = fanService.getCharacteristic.mock.results.map(({ value }) => value.onGet.mock.calls[0][0]);
            await expect(onCallsHandlers[0]()).resolves.toBe(false);
            await expect(onCallsHandlers[1]()).resolves.toBe(99.99074074074075);
        });
        test("the FilterMaintenance services' characteristics call all getters", async () => {
            for (const service of careService.services) {
                expect(service.characteristics).toHaveLength(3);
                const [name, ...characteristics] = service.characteristics;
                const onCallsHandlers = characteristics.map((characteristic) => characteristic["getHandler"]);
                for (const listener of onCallsHandlers) {
                    await expect(listener()).resolves.toMatchSnapshot();
                }
            }
        });
        test("handles -1 responses", async () => {
            for (const service of careService.services) {
                expect(service.characteristics).toHaveLength(3);
                const [name, ...characteristics] = service.characteristics;
                const onCallsHandlers = characteristics.map((characteristic) => characteristic["getHandler"]);
                for (const listener of onCallsHandlers) {
                    deviceManagerMock.property.mockReturnValueOnce(-1);
                    await expect(listener()).resolves.toMatchSnapshot();
                }
            }
        });
    });
});
//# sourceMappingURL=care_service.test.js.map