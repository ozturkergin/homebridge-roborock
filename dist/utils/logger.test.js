"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
describe("getLogger", () => {
    let homebridgeLogger = Object.assign({
        prefix: "test",
        error: jest.fn(),
        warn: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
        log: jest.fn(),
    }, jest.fn());
    beforeEach(() => {
        jest.resetAllMocks();
    });
    test.each(["debug", "info", "warn", "error"])("it should log %p messages by default", (level) => {
        const logSpy = jest.spyOn(homebridgeLogger, level);
        const logger = (0, logger_1.getLogger)(homebridgeLogger, {});
        logger[level]("Test message");
        expect(logSpy).toHaveBeenCalledWith("[Model=unknown] Test message");
    });
    test.each(["debug", "info", "warn", "error"])("it should log %p messages with a model set", (level) => {
        const logSpy = jest.spyOn(homebridgeLogger, level);
        const logger = (0, logger_1.getLogger)(homebridgeLogger, {});
        logger.setModel("test-model");
        logger[level]("Test message");
        expect(logSpy).toHaveBeenCalledWith("[Model=test-model] Test message");
    });
    describe("if silent === true", () => {
        test.each(["debug", "info"])("it not should log %p messages", (level) => {
            const logSpy = jest.spyOn(homebridgeLogger, level);
            const logger = (0, logger_1.getLogger)(homebridgeLogger, { silent: true });
            logger[level]("Test message");
            expect(logSpy).not.toHaveBeenCalled();
        });
        test.each(["warn", "error"])("it should log %p messages", (level) => {
            const logSpy = jest.spyOn(homebridgeLogger, level);
            const logger = (0, logger_1.getLogger)(homebridgeLogger, { silent: true });
            logger[level]("Test message");
            expect(logSpy).toHaveBeenCalledWith("[Model=unknown] Test message");
        });
    });
});
//# sourceMappingURL=logger.test.js.map