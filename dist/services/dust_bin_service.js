"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DustBinService = void 0;
const rxjs_1 = require("rxjs");
const plugin_service_class_1 = require("./plugin_service_class");
const DUST_BIN_FULL_ERROR_CODES = ["10"];
class DustBinService extends plugin_service_class_1.PluginServiceClass {
    service;
    state$ = new rxjs_1.BehaviorSubject(false);
    constructor(coreContext) {
        super(coreContext);
        this.service = new this.hap.Service.LockMechanism(`${this.config.name} Dust Bin Full`, "Dust Bin Full");
        this.service
            .getCharacteristic(this.hap.Characteristic.LockTargetState)
            .onGet(() => this.getLockedState())
            .onSet((value) => this.setLockedState(value));
    }
    async init() {
        this.deviceManager.errorChanged$
            .pipe((0, rxjs_1.filter)(({ id }) => DUST_BIN_FULL_ERROR_CODES.includes(id)), (0, rxjs_1.distinct)(({ description }) => description))
            .subscribe(() => {
            this.state$.next(true);
            this.log.info(`The Dust Bin is full. Setting the dust bin indicator ON.`);
            this.service
                .getCharacteristic(this.hap.Characteristic.LockTargetState)
                .updateValue(this.hap.Characteristic.LockTargetState.SECURED);
        });
    }
    get services() {
        return [this.service];
    }
    async getLockedState() {
        return this.state$.value
            ? this.hap.Characteristic.LockTargetState.SECURED
            : this.hap.Characteristic.LockTargetState.UNSECURED;
    }
    async setLockedState(value) {
        this.state$.next(value === this.hap.Characteristic.LockTargetState.SECURED);
    }
}
exports.DustBinService = DustBinService;
//# sourceMappingURL=dust_bin_service.js.map