"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCareSensorsClass = createCareSensorsClass;
function createCareSensorsClass(hap) {
    class CareSensors extends hap.Characteristic {
        static UUID = "00000101-0000-0000-0000-000000000000";
        constructor() {
            super("Care indicator sensors", CareSensors.UUID, {
                format: "float" /* hap.Formats.FLOAT */,
                unit: "%",
                perms: ["pr" /* hap.Perms.PAIRED_READ */, "ev" /* hap.Perms.NOTIFY */],
            });
            this.value = this.getDefaultValue();
        }
    }
    return { CareSensors };
}
//# sourceMappingURL=care_sensors.js.map