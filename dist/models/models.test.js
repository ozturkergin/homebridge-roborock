"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./models");
describe("Ensure speed tests", () => {
    describe("rockrobo.vacuum.v1", () => {
        const { speed } = models_1.MODELS["rockrobo.vacuum.v1"][0];
        test("ensure miLevels are consistent", () => {
            const miLevels = speed.map(({ miLevel }) => miLevel);
            expect(miLevels).toStrictEqual([-1, 38, 60, 75, 100]);
        });
    });
});
//# sourceMappingURL=models.test.js.map