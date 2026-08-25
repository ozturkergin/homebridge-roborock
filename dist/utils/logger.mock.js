"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoggerMock = void 0;
const getLoggerMock = () => ({
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    setModel: jest.fn(),
});
exports.getLoggerMock = getLoggerMock;
//# sourceMappingURL=logger.mock.js.map