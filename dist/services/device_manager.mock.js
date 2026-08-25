"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeviceManagerMock = void 0;
const rxjs_1 = require("rxjs");
const test_mocks_1 = require("../test.mocks");
const createDeviceManagerMock = () => {
    const deviceManagerMock = {
        errorChanged$: new rxjs_1.Subject(),
        stateChanged$: new rxjs_1.Subject(),
        deviceConnected$: new rxjs_1.Subject(),
        model: "test-model",
        state: "cleaning",
        isCleaning: true,
        isPaused: false,
        device: test_mocks_1.miio.device,
        isConnected: true,
        waitForHandshake: jest.fn().mockResolvedValue(undefined),
        property: jest.fn(),
        ensureDevice: jest.fn(),
        handshakePromise: Promise.resolve(),
    };
    return deviceManagerMock;
};
exports.createDeviceManagerMock = createDeviceManagerMock;
//# sourceMappingURL=device_manager.mock.js.map