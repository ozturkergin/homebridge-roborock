"use strict";
// ============= MIIO MOCKS ================
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHomebridgeMock = exports.miio = void 0;
const hap_nodejs_1 = require("hap-nodejs");
const miioDevice = {
    miioModel: "test-model",
    activateCharging: jest.fn(),
    activateCleaning: jest.fn(),
    batteryLevel: jest.fn(),
    changeFanSpeed: jest.fn(),
    cleanRooms: jest.fn(),
    cleanZones: jest.fn(),
    fanSpeed: jest.fn(),
    find: jest.fn(),
    getDeviceInfo: jest.fn(),
    getRoomMap: jest.fn(),
    getSerialNumber: jest.fn(),
    getTimer: jest.fn(),
    getWaterBoxMode: jest.fn(),
    pause: jest.fn(),
    properties: jest.fn()(),
    resumeCleanRooms: jest.fn(),
    sendToLocation: jest.fn(),
    setRawProperty: jest.fn(),
    setWaterBoxMode: jest.fn(),
    startDustCollection: jest.fn(),
    stopDustCollection: jest.fn(),
    matches: jest.fn(),
    destroy: jest.fn(),
    property: jest.fn(),
    on: jest.fn(),
    handle: { api: { parent: { socket: {} } } },
    poll: jest.fn(),
    state: jest.fn().mockReturnValue({}),
};
exports.miio = {
    device: miioDevice,
    createMock: () => ({
        device: jest.fn().mockImplementation(() => miioDevice),
    }),
};
// ============= HOMEBRIDGE MOCKS ================
const createGetCharacteristicMock = () => jest.fn().mockImplementation(() => Object.assign({}, createChainableServiceMethodsMock(), {
    setProps: jest.fn(),
    on: createGetCharacteristicMock(),
    onGet: createGetCharacteristicMock(),
    onSet: createGetCharacteristicMock(),
    updateValue: jest.fn(),
}));
const createChainableServiceMethodsMock = () => ({
    addLinkedService: jest.fn(),
    setPrimaryService: jest.fn(),
    getCharacteristic: createGetCharacteristicMock(),
    setCharacteristic: jest
        .fn()
        .mockImplementation(createChainableServiceMethodsMock),
    addOptionalCharacteristic: jest.fn(),
});
const createServiceMock = () => jest
    .fn()
    .mockImplementation((name, type) => Object.assign({ name, type }, createChainableServiceMethodsMock()));
const Service = Object.assign(createServiceMock(), {
    Switch: createServiceMock(),
    FilterMaintenance: createServiceMock(),
    AccessoryInformation: createServiceMock(),
    Fan: createServiceMock(),
    Battery: createServiceMock(),
    OccupancySensor: createServiceMock(),
    LockMechanism: createServiceMock(),
});
const createHomebridgeMock = () => ({
    registerAccessory: jest.fn(),
    hap: { Characteristic: hap_nodejs_1.Characteristic, Service, HAPStorage: hap_nodejs_1.HAPStorage },
});
exports.createHomebridgeMock = createHomebridgeMock;
//# sourceMappingURL=test.mocks.js.map