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
const find_me_service_1 = require("./find_me_service");
const device_manager_mock_1 = require("./device_manager.mock");
const logger_mock_1 = require("../utils/logger.mock");
const config_service_1 = require("./config_service");
describe("FindMeService", () => {
    let findMeService;
    let deviceManagerMock;
    let hap;
    beforeEach(async () => {
        hap = HapJs;
        const log = (0, logger_mock_1.getLoggerMock)();
        deviceManagerMock = (0, device_manager_mock_1.createDeviceManagerMock)();
        const config = (0, config_service_1.applyConfigDefaults)({ findMe: true });
        findMeService = new find_me_service_1.FindMeService({
            hap,
            log,
            config,
            deviceManager: deviceManagerMock,
        });
        await findMeService.init();
    });
    afterEach(() => {
        deviceManagerMock.stateChanged$.complete();
        jest.resetAllMocks();
    });
    test("returns a service", () => {
        expect(findMeService.services).toHaveLength(1);
    });
    test("default config does not return any service", () => {
        findMeService = new find_me_service_1.FindMeService({
            hap,
            log: (0, logger_mock_1.getLoggerMock)(),
            config: (0, config_service_1.applyConfigDefaults)({}),
            deviceManager: deviceManagerMock,
        });
        expect(findMeService.services).toStrictEqual([]);
    });
    test("onGet", async () => {
        const [service] = findMeService.services;
        await expect(service.getCharacteristic(hap.Characteristic.On).handleGetRequest()).resolves.toStrictEqual(false);
    });
    test("onSet", async () => {
        const [service] = findMeService.services;
        await expect(service.getCharacteristic(hap.Characteristic.On).handleSetRequest(true)).resolves.toStrictEqual(undefined);
        expect(deviceManagerMock.ensureDevice).toHaveBeenCalledTimes(1);
        expect(deviceManagerMock.ensureDevice).toHaveBeenCalledWith("identify");
        expect(deviceManagerMock.device?.find).toHaveBeenCalledTimes(1);
    });
    test("onSet (with failure)", async () => {
        jest
            .spyOn(deviceManagerMock.device, "find")
            .mockRejectedValue(new Error("Something went terribly wrong"));
        const [service] = findMeService.services;
        await expect(service.getCharacteristic(hap.Characteristic.On).handleSetRequest(true)).rejects.toStrictEqual(-70402);
        expect(deviceManagerMock.ensureDevice).toHaveBeenCalledTimes(1);
        expect(deviceManagerMock.ensureDevice).toHaveBeenCalledWith("identify");
        expect(deviceManagerMock.device?.find).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=find_me_service.test.js.map