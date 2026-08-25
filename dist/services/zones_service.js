"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZonesService = void 0;
const rxjs_1 = require("rxjs");
const plugin_service_class_1 = require("./plugin_service_class");
const ensure_name_1 = require("../utils/ensure_name");
class ZonesService extends plugin_service_class_1.PluginServiceClass {
    mainService;
    changedPause;
    zones = {};
    constructor(coreContext, mainService, changedPause) {
        super(coreContext);
        this.mainService = mainService;
        this.changedPause = changedPause;
        if (this.config.zones) {
            for (const { name, zone } of this.config.zones) {
                // Index will be overwritten, when robot is available
                this.createZone(name, zone);
            }
        }
    }
    async init() {
        this.deviceManager.stateChanged$
            .pipe((0, rxjs_1.filter)(({ key }) => key === "cleaning"))
            .subscribe(({ value }) => {
            const isCleaning = value === true;
            if (!isCleaning) {
                this.services.forEach((zone) => {
                    zone
                        .getCharacteristic(this.hap.Characteristic.On)
                        .updateValue(false);
                });
            }
        });
    }
    get services() {
        return [...Object.values(this.zones)];
    }
    createZone(zoneName, zoneParams) {
        this.log.info(`createRoom | Zone ${zoneName} (${zoneParams})`);
        const name = `${this.config.cleanword} ${zoneName}`;
        this.zones[zoneName] = new this.hap.Service.Switch(name, "zoneCleaning" + zoneName);
        (0, ensure_name_1.ensureName)(this.hap, this.zones[zoneName], name);
        this.zones[zoneName]
            .getCharacteristic(this.hap.Characteristic.On)
            .onGet(() => this.mainService.getCleaning())
            .onSet((newState) => this.setCleaningZone(newState, zoneParams))
            .on("change", ({ newValue }) => {
            this.changedPause(newValue === true);
        });
    }
    async setCleaningZone(state, zone) {
        await this.deviceManager.ensureDevice("setCleaningZone");
        try {
            if (state && !this.deviceManager.isCleaning) {
                // Start cleaning
                this.log.info(`ACT setCleaning | Start cleaning Zone ${zone}, not charging.`);
                const zoneParams = [];
                for (const zon of zone) {
                    if (zon.length === 4) {
                        zoneParams.push(zon.concat(1));
                    }
                    else if (zon.length === 5) {
                        zoneParams.push(zon);
                    }
                }
                await this.deviceManager.device.cleanZones(zoneParams);
            }
            else if (!state) {
                // Stop cleaning
                this.log.info(`ACT setCleaning | Stop cleaning and go to charge.`);
                await this.deviceManager.device.activateCharging();
            }
        }
        catch (err) {
            this.log.error(`setCleaning | Failed to set cleaning to ${state}`, err);
            throw err;
        }
    }
}
exports.ZonesService = ZonesService;
//# sourceMappingURL=zones_service.js.map