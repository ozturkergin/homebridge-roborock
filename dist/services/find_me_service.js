"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindMeService = void 0;
const plugin_service_class_1 = require("./plugin_service_class");
const ensure_name_1 = require("../utils/ensure_name");
class FindMeService extends plugin_service_class_1.PluginServiceClass {
    service;
    constructor(coreContext) {
        super(coreContext);
        if (this.config.findMe) {
            const name = `${this.config.name} ${this.config.findMeWord}`;
            this.service = new this.hap.Service.Switch(name, "FindMe Switch");
            (0, ensure_name_1.ensureName)(this.hap, this.service, name);
            this.service
                .getCharacteristic(this.hap.Characteristic.On)
                .onGet(() => false)
                .onSet((newState) => this.identify(newState));
        }
    }
    async init() { }
    get services() {
        return this.service ? [this.service] : [];
    }
    async identify(newState) {
        await this.deviceManager.ensureDevice("identify");
        this.log.info(`ACT identify | Find me - Hello!`);
        try {
            await this.deviceManager.device.find();
        }
        catch (err) {
            this.log.error(`identify | `, err);
            throw err;
        }
    }
}
exports.FindMeService = FindMeService;
//# sourceMappingURL=find_me_service.js.map