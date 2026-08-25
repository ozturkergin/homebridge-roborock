"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCareFilterClass = createCareFilterClass;
function createCareFilterClass(hap) {
    class CareFilter extends hap.Characteristic {
        static UUID = "00000102-0000-0000-0000-000000000000";
        constructor() {
            super("Care indicator filter", CareFilter.UUID, {
                format: "float" /* hap.Formats.FLOAT */,
                unit: "%",
                perms: ["pr" /* hap.Perms.PAIRED_READ */, "ev" /* hap.Perms.NOTIFY */],
            });
            this.value = this.getDefaultValue();
        }
    }
    return { CareFilter };
}
//# sourceMappingURL=care_filter.js.map