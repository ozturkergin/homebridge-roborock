"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const callbackify_1 = require("./callbackify");
describe("callbackify", () => {
    test("resolves the callback with the value from the promise", (done) => {
        const fn = jest.fn().mockResolvedValue("some_value");
        (0, callbackify_1.callbackify)(fn, (err, value) => {
            expect(value).toBe("some_value");
            expect(err).toBeNull();
            done();
        });
    });
    test("resolves the callback with the value from the promise", (done) => {
        const error = new Error("something went terribly wrong");
        const fn = jest.fn().mockRejectedValue(error);
        (0, callbackify_1.callbackify)(fn, (err, value) => {
            expect(value).toBeUndefined();
            expect(err).toStrictEqual(error);
            done();
        });
    });
});
//# sourceMappingURL=callbackify.test.js.map