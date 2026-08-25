"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCareSideBrushClass = createCareSideBrushClass;
function createCareSideBrushClass(hap) {
    class CareSideBrush extends hap.Characteristic {
        static UUID = "00000103-0000-0000-0000-000000000000";
        constructor() {
            super("Care indicator side brush", CareSideBrush.UUID, {
                format: "float" /* hap.Formats.FLOAT */,
                unit: "%",
                perms: ["pr" /* hap.Perms.PAIRED_READ */, "ev" /* hap.Perms.NOTIFY */],
            });
            this.value = this.getDefaultValue();
        }
    }
    return { CareSideBrush };
}
//# sourceMappingURL=care_side_brush.js.map