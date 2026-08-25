"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMainServiceMock = void 0;
const createMainServiceMock = () => {
    const mainServiceMock = {
        cachedState: new Map(),
        init: jest.fn(),
        services: [],
        getCleaning: jest.fn(),
        setCleaning: jest.fn(),
        setSpeed: jest.fn(),
    };
    return mainServiceMock;
};
exports.createMainServiceMock = createMainServiceMock;
//# sourceMappingURL=main_service.mock.js.map