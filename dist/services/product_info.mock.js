"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductInfoMock = void 0;
const createProductInfoMock = () => {
    const productInfoMock = {
        init: jest.fn(),
        services: [],
        firmware: "test",
    };
    return productInfoMock;
};
exports.createProductInfoMock = createProductInfoMock;
//# sourceMappingURL=product_info.mock.js.map