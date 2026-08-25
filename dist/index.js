"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xiaomi_roborock_vacuum_accessory_1 = require("./xiaomi_roborock_vacuum_accessory");
const PLUGIN_NAME = "homebridge-roborock-ergin";
const ACCESSORY_NAME = "XiaomiRoborockVacuum";
exports.default = (api) => {
    api.registerAccessory(PLUGIN_NAME, ACCESSORY_NAME, xiaomi_roborock_vacuum_accessory_1.XiaomiRoborockVacuum);
};
//# sourceMappingURL=index.js.map