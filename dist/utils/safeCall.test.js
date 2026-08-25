"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const safeCall_1 = require("./safeCall");
describe("safeCall", () => {
    test("call the method if the value is defined", () => {
        const fn = jest.fn();
        (0, safeCall_1.safeCall)("some_value", fn);
        expect(fn).toHaveBeenCalledWith("some_value");
    });
    test("does not call the method when the value is not defined", () => {
        const fn = jest.fn();
        (0, safeCall_1.safeCall)(undefined, fn);
        expect(fn).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=safeCall.test.js.map