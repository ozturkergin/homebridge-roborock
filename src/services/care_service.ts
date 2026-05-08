import { Service } from "homebridge";
import { CoreContext } from "./types";
import { createCareServicesClasses } from "./custom_care_service";
import { MainService } from "./main_service";
import { PluginServiceClass } from "./plugin_service_class";

export interface CareConfig {
  disableCareServices?: boolean;
  legacyCareSensors?: boolean;
}

export class CareService extends PluginServiceClass {
  public readonly services: Service[];
  constructor(
    coreContext: CoreContext,
    private readonly mainService: MainService
  ) {
    super(coreContext);
    this.services = this.config.legacyCareSensors
      ? this.registerLegacyCustomCareService()
      : this.registerNativeCareServices();
  }

  public async init(): Promise<void> {}

  private async getCareSensors() {
    try {
      await this.deviceManager.waitForHandshake(2000);
      if (!this.deviceManager.isConnected) {
        this.log.debug(`getCareSensors | Not connected yet, returning 0`);
        return 0;
      }
      // 30h = sensor_dirty_time
      const lifetime = 108000;
      const sensorDirtyTime =
        this.deviceManager.property<number>("sensorDirtyTime") || 0;
      const lifetimePercent = (sensorDirtyTime / lifetime) * 100;
      this.log.info(
        `getCareSensors | Sensors dirtyTime is ${sensorDirtyTime} seconds / ${lifetimePercent.toFixed(
          2
        )}%.`
      );
      return Math.max(0, Math.min(100, lifetimePercent));
    } catch (err) {
      this.log.error(`getCareSensors | Failed getting the sensor status.`, err);
      return 0;
    }
  }

  private async getCareFilter() {
    try {
      await this.deviceManager.waitForHandshake(2000);
      if (!this.deviceManager.isConnected) {
        this.log.debug(`getCareFilter | Not connected yet, returning 0`);
        return 0;
      }
      // 150h = filter_work_time
      const lifetime = 540000;
      const filterWorkTime =
        this.deviceManager.property<number>("filterWorkTime") || 0;
      const lifetimePercent = (filterWorkTime / lifetime) * 100;
      this.log.info(
        `getCareFilter | Filter workTime is ${filterWorkTime} seconds / ${lifetimePercent.toFixed(
          2
        )}%.`
      );
      return Math.max(0, Math.min(100, lifetimePercent));
    } catch (err) {
      this.log.error(`getCareFilter | Failed getting the filter status.`, err);
      return 0;
    }
  }

  private async getCareSideBrush() {
    try {
      await this.deviceManager.waitForHandshake(2000);
      if (!this.deviceManager.isConnected) {
        this.log.debug(`getCareSideBrush | Not connected yet, returning 0`);
        return 0;
      }
      // 200h = side_brush_work_time
      const lifetime = 720000;
      const sideBrushWorkTime =
        this.deviceManager.property<number>("sideBrushWorkTime") || 0;
      const lifetimePercent = (sideBrushWorkTime / lifetime) * 100;
      this.log.info(
        `getCareSideBrush | SideBrush workTime is ${sideBrushWorkTime} seconds / ${lifetimePercent.toFixed(
          2
        )}%.`
      );
      return Math.max(0, Math.min(100, lifetimePercent));
    } catch (err) {
      this.log.error(
        `getCareSideBrush | Failed getting the side brush status.`,
        err
      );
      return 0;
    }
  }

  private async getCareMainBrush() {
    try {
      await this.deviceManager.waitForHandshake(2000);
      if (!this.deviceManager.isConnected) {
        this.log.debug(`getCareMainBrush | Not connected yet, returning 0`);
        return 0;
      }
      // 300h = main_brush_work_time
      const lifetime = 1080000;
      const mainBrushWorkTime =
        this.deviceManager.property<number>("mainBrushWorkTime") || 0;
      const lifetimePercent = (mainBrushWorkTime / lifetime) * 100;
      this.log.info(
        `getCareMainBrush | MainBrush workTime is ${mainBrushWorkTime} seconds / ${lifetimePercent.toFixed(
          2
        )}%.`
      );
      return Math.max(0, Math.min(100, lifetimePercent));
    } catch (err) {
      this.log.error(
        `getCareMainBrush | Failed getting the main brush status.`,
        err
      );
      return 0;
    }
  }

  private registerLegacyCustomCareService(): Service[] {
    const { Care, Characteristic } = createCareServicesClasses(this.hap);
    const service = new Care(`${this.config.name} Care`);
    service
      .getCharacteristic(Characteristic.CareSensors)
      .onGet(() => this.getCareSensors());
    service
      .getCharacteristic(Characteristic.CareFilter)
      .onGet(() => this.getCareFilter());
    service
      .getCharacteristic(Characteristic.CareSideBrush)
      .onGet(() => this.getCareSideBrush());
    service
      .getCharacteristic(Characteristic.CareMainBrush)
      .onGet(() => this.getCareMainBrush());

    return [service];
  }

  private registerNativeCareServices(): Service[] {
    const mainService = this.mainService.services[0]; // Hack for now

    // Register the high-level state of the filters to the main device's Characteristics
    mainService
      .getCharacteristic(this.hap.Characteristic.FilterChangeIndication)
      .onGet(async () => {
        const carePercentages = await Promise.all([
          this.getCareSensors(),
          this.getCareFilter(),
          this.getCareSideBrush(),
          this.getCareMainBrush(),
        ]);
        return carePercentages.some((item) => item >= 100);
      });
    mainService
      .getCharacteristic(this.hap.Characteristic.FilterLifeLevel)
      .onGet(async () => {
        const carePercentages = await Promise.all([
          this.getCareSensors(),
          this.getCareFilter(),
          this.getCareSideBrush(),
          this.getCareMainBrush(),
        ]);
        return 100 - Math.max(...carePercentages);
      });

    // Use Homekit's native FilterMaintenance Service
    const careSensorsService = new this.hap.Service.FilterMaintenance(
      "Care indicator sensors",
      "sensors"
    );
    careSensorsService
      .getCharacteristic(this.hap.Characteristic.FilterChangeIndication)
      .onGet(async () => {
        return (await this.getCareSensors()) >= 100;
      });
    careSensorsService
      .getCharacteristic(this.hap.Characteristic.FilterLifeLevel)
      .onGet(async () => 100 - (await this.getCareSensors()));

    const careFilterService = new this.hap.Service.FilterMaintenance(
      "Care indicator filter",
      "filter"
    );
    careFilterService
      .getCharacteristic(this.hap.Characteristic.FilterChangeIndication)
      .onGet(async () => {
        return (await this.getCareFilter()) >= 100;
      });
    careFilterService
      .getCharacteristic(this.hap.Characteristic.FilterLifeLevel)
      .onGet(async () => 100 - (await this.getCareFilter()));

    const careSideBrushService = new this.hap.Service.FilterMaintenance(
      "Care indicator side brush",
      "side brush"
    );
    careSideBrushService
      .getCharacteristic(this.hap.Characteristic.FilterChangeIndication)
      .onGet(async () => {
        return (await this.getCareSideBrush()) >= 100;
      });
    careSideBrushService
      .getCharacteristic(this.hap.Characteristic.FilterLifeLevel)
      .onGet(async () => 100 - (await this.getCareSideBrush()));

    const careMainBrushService = new this.hap.Service.FilterMaintenance(
      "Care indicator main brush",
      "main brush"
    );
    careMainBrushService
      .getCharacteristic(this.hap.Characteristic.FilterChangeIndication)
      .onGet(async () => {
        return (await this.getCareMainBrush()) >= 100;
      });
    careMainBrushService
      .getCharacteristic(this.hap.Characteristic.FilterLifeLevel)
      .onGet(async () => 100 - (await this.getCareMainBrush()));

    return [
      careSensorsService,
      careFilterService,
      careSideBrushService,
      careMainBrushService,
    ];
  }
}
