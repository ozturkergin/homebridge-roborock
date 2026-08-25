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
const rooms_service_1 = require("./rooms_service");
const device_manager_mock_1 = require("./device_manager.mock");
const logger_mock_1 = require("../utils/logger.mock");
const config_service_1 = require("./config_service");
describe("RoomsService", () => {
    let roomsService;
    let deviceManagerMock;
    let hap;
    const setCleaning = jest.fn();
    async function createRoomService(partialConfig) {
        hap = HapJs;
        const log = (0, logger_mock_1.getLoggerMock)();
        deviceManagerMock = (0, device_manager_mock_1.createDeviceManagerMock)();
        const config = (0, config_service_1.applyConfigDefaults)(partialConfig);
        roomsService = new rooms_service_1.RoomsService({
            hap,
            log,
            config,
            deviceManager: deviceManagerMock,
        }, setCleaning);
        await roomsService.init();
    }
    afterEach(() => {
        deviceManagerMock.stateChanged$.complete();
        jest.resetAllMocks();
    });
    describe("with the default config", () => {
        beforeEach(async () => {
            await createRoomService({});
        });
        test("default config returns zero services", () => {
            expect(roomsService.services).toStrictEqual([]);
        });
    });
    test("throws an error if rooms and autoroom are present at the same time", async () => {
        await expect(createRoomService({ rooms: [], autoroom: true })).rejects.toThrow();
    });
    test("creates a declared room", async () => {
        await createRoomService({ rooms: [{ id: 16, name: "Kitchen" }] });
        expect(roomsService.services).toHaveLength(1);
    });
    // TODO: Keep adding tests
});
//# sourceMappingURL=rooms_service.test.js.map