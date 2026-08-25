"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCareServicesClasses = createCareServicesClasses;
const characteristics_1 = require("./characteristics");
function createCareServicesClasses(hap) {
    const { CareSensors } = (0, characteristics_1.createCareSensorsClass)(hap);
    const { CareFilter } = (0, characteristics_1.createCareFilterClass)(hap);
    const { CareSideBrush } = (0, characteristics_1.createCareSideBrushClass)(hap);
    const { CareMainBrush } = (0, characteristics_1.createCareMainBrushClass)(hap);
    class Care extends hap.Service {
        static UUID = "00000111-0000-0000-0000-000000000000";
        constructor(displayName, subType) {
            super(displayName, Care.UUID, subType);
            this.addCharacteristic(CareSensors);
            this.addCharacteristic(CareFilter);
            this.addCharacteristic(CareSideBrush);
            this.addCharacteristic(CareMainBrush);
        }
    }
    return {
        Care,
        Characteristic: {
            CareSensors,
            CareFilter,
            CareSideBrush,
            CareMainBrush,
        },
    };
}
//# sourceMappingURL=care_service.js.map