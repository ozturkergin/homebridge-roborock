"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginServiceClass = void 0;
class PluginServiceClass {
    hap;
    log;
    config;
    deviceManager;
    constructor({ hap, log, config, deviceManager }) {
        this.hap = hap;
        this.log = log;
        this.config = config;
        this.deviceManager = deviceManager;
    }
}
exports.PluginServiceClass = PluginServiceClass;
//# sourceMappingURL=plugin_service_class.js.map