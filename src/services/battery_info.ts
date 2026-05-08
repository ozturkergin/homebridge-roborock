import { Service } from "homebridge";
import { CoreContext } from "./types";
import { PluginServiceClass } from "./plugin_service_class";

export class BatteryInfo extends PluginServiceClass {
  private readonly service: Service;
  private isCharging?: boolean;
  constructor(coreContext: CoreContext) {
    super(coreContext);

    this.service = new this.hap.Service.Battery(`${this.config.name} Battery`);
    this.service
      .getCharacteristic(this.hap.Characteristic.BatteryLevel)
      .onGet(() => this.getBattery());
    this.service
      .getCharacteristic(this.hap.Characteristic.ChargingState)
      .onGet(() => this.getCharging());
    this.service
      .getCharacteristic(this.hap.Characteristic.StatusLowBattery)
      .onGet(() => this.getBatteryLow());
  }

  public async init(): Promise<void> {
    this.deviceManager.stateChanged$.subscribe(({ key, value }) => {
      if (key === "batteryLevel") {
        this.changedBattery(value as number);
      } else if (key === "charging") {
        this.changedCharging(value);
      }
    });
  }

  public get services() {
    return [this.service];
  }

  private changedBattery(level: number) {
    this.log.debug(`DEB changedBattery | BatteryLevel ${level}%`);
    this.service
      .getCharacteristic(this.hap.Characteristic.BatteryLevel)
      .updateValue(level);
    this.service
      .getCharacteristic(this.hap.Characteristic.StatusLowBattery)
      .updateValue(
        level < 20
          ? this.hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW
          : this.hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL
      );
  }

  private changedCharging(isCharging) {
    const isNewValue = this.isCharging !== isCharging;
    if (isNewValue) {
      this.log.info(`MON changedCharging | ChargingState is now ${isCharging}`);
      this.log.info(
        `changedCharging | Charging is ${isCharging ? "active" : "cancelled"}`
      );
    }
    // We still update the value in Homebridge. If we are calling the changed method is because we want to change it.
    this.service
      .getCharacteristic(this.hap.Characteristic.ChargingState)
      .updateValue(
        isCharging
          ? this.hap.Characteristic.ChargingState.CHARGING
          : this.hap.Characteristic.ChargingState.NOT_CHARGING
      );
  }

  private async getBattery() {
    try {
      await this.deviceManager.waitForHandshake(2000);
      if (!this.deviceManager.isConnected) {
        this.log.debug(`getBattery | Not connected yet, returning 0`);
        return 0;
      }
      const batteryLevel = await this.deviceManager.device.batteryLevel();
      this.log.info(`getBattery | BatteryLevel is ${batteryLevel}%`);
      return batteryLevel;
    } catch (err) {
      this.log.error(`getBattery | Failed getting the battery level.`, err);
      return 0;
    }
  }

  private async getBatteryLow() {
    try {
      await this.deviceManager.waitForHandshake(2000);
      if (!this.deviceManager.isConnected) {
        this.log.debug(`getBatteryLow | Not connected yet, returning NORMAL`);
        return this.hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
      }
      const batteryLevel = await this.deviceManager.device.batteryLevel();
      this.log.info(`getBatteryLow | BatteryLevel is ${batteryLevel}%`);
      return batteryLevel < 20
        ? this.hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW
        : this.hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
    } catch (err) {
      this.log.error(`getBatteryLow | Failed getting the battery level.`, err);
      return this.hap.Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
    }
  }

  private async getCharging() {
    try {
      await this.deviceManager.waitForHandshake(2000);
      if (!this.deviceManager.isConnected) {
        this.log.debug(`getCharging | Not connected yet, returning NOT_CHARGING`);
        return this.hap.Characteristic.ChargingState.NOT_CHARGING;
      }
      const status = this.deviceManager.state;
      const isCharging = status === "charging";
      this.log.info(
        `getCharging | Charging is ${isCharging} (Status is ${status})`
      );

      return isCharging
        ? this.hap.Characteristic.ChargingState.CHARGING
        : this.hap.Characteristic.ChargingState.NOT_CHARGING;
    } catch (err) {
      this.log.error(`getCharging | Failed getting the charging state.`, err);
      return this.hap.Characteristic.ChargingState.NOT_CHARGING;
    }
  }
}
