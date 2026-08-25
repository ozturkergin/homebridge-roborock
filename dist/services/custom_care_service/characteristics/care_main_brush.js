"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCareMainBrushClass = createCareMainBrushClass;
function createCareMainBrushClass(hap) {
    class CareMainBrush extends hap.Characteristic {
        static UUID = "00000104-0000-0000-0000-000000000000";
        constructor() {
            super("Care indicator main brush", CareMainBrush.UUID, {
                format: "float" /* hap.Formats.FLOAT */,
                unit: "%",
                perms: ["pr" /* hap.Perms.PAIRED_READ */, "ev" /* hap.Perms.NOTIFY */],
            });
            this.value = this.getDefaultValue();
        }
    }
    return { CareMainBrush };
}
//# sourceMappingURL=care_main_brush.js.map