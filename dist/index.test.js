"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
describe("entrypoint", () => {
    let api;
    beforeEach(() => {
        api = {
            hap: {},
            registerAccessory: jest.fn(),
        }; // No need to mock everything for these tests
        expect(() => (0, index_1.default)(api)).not.toThrow();
    });
    test("should register the accessory", () => {
        expect(api.registerAccessory).toHaveBeenCalledWith("homebridge-roborock-ergin", "XiaomiRoborockVacuum", expect.any(Function));
    });
});
//# sourceMappingURL=index.test.js.map