import { API } from "homebridge";
import { XiaomiRoborockVacuum } from "./xiaomi_roborock_vacuum_accessory";

const PLUGIN_NAME = "homebridge-roborock-ergin";
const ACCESSORY_NAME = "XiaomiRoborockVacuum";

export default (api: API) => {
  api.registerAccessory(PLUGIN_NAME, ACCESSORY_NAME, XiaomiRoborockVacuum);
};
