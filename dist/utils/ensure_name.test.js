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
const hap = __importStar(require("hap-nodejs"));
const ensure_name_1 = require("./ensure_name");
describe("ensureName", () => {
    const getItemSpy = jest.spyOn(hap.HAPStorage.storage(), "getItemSync");
    const setItemSpy = jest.spyOn(hap.HAPStorage.storage(), "setItemSync");
    const service = new hap.Service.Switch("test", "test");
    beforeEach(() => {
        jest.resetAllMocks();
    });
    afterEach(() => {
        service
            .getCharacteristic(hap.Characteristic.ConfiguredName)
            .removeAllListeners("change");
    });
    test("sets the default name", () => {
        const setCharacteristicSpy = jest.spyOn(service, "setCharacteristic");
        (0, ensure_name_1.ensureName)(hap, service, "custom test");
        expect(setCharacteristicSpy).toHaveBeenCalledTimes(1);
        expect(setCharacteristicSpy).toHaveBeenCalledWith(hap.Characteristic.ConfiguredName, "custom test");
        expect(setItemSpy).toHaveBeenCalledTimes(0);
    });
    test("does not set the default name", () => {
        getItemSpy.mockReturnValueOnce("hi there!");
        const setCharacteristicSpy = jest.spyOn(service, "setCharacteristic");
        (0, ensure_name_1.ensureName)(hap, service, "custom test");
        expect(setCharacteristicSpy).toHaveBeenCalledTimes(0);
        expect(setItemSpy).toHaveBeenCalledTimes(0);
    });
    test("stores a custom name in cache", () => {
        getItemSpy.mockReturnValueOnce("hi there!");
        (0, ensure_name_1.ensureName)(hap, service, "custom test");
        service.updateCharacteristic(hap.Characteristic.ConfiguredName, "changed name");
        expect(setItemSpy).toHaveBeenCalledTimes(1);
        expect(setItemSpy).toHaveBeenCalledWith("homebridge-xiaomi-roborock-vacuum-configured-name-custom_test", "changed name");
    });
});
//# sourceMappingURL=ensure_name.test.js.map