"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyConfigDefaults = applyConfigDefaults;
/**
 * Applies the default configuration values to the config provided by the user.
 * @param config The config provided by the user.
 *
 * @remarks We may want to use a validation library like io-ts in the future for easier typing and defaulting.
 */
function applyConfigDefaults(config) {
    return {
        name: "Roborock vacuum cleaner",
        serviceType: "fan",
        cleanword: "cleaning",
        pause: false,
        pauseWord: "Pause",
        findMe: false,
        findMeWord: "where are you",
        goTo: false,
        goToWord: "go to coordinates",
        goToX: 25500,
        goToY: 25500,
        roomTimeout: 0,
        waterBox: false,
        dustBin: false,
        dustCollection: false,
        dock: false,
        ...config,
    };
}
//# sourceMappingURL=config_service.js.map