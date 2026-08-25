"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = getLogger;
const noop = () => { };
function getLogger(log, config) {
    let model = "unknown";
    function buildMsg(message) {
        return `[Model=${model}] ${message}`;
    }
    return {
        debug: (msg, ...params) => config.silent ? noop() : log.debug(buildMsg(msg), ...params),
        info: (msg, ...params) => config.silent ? noop() : log.info(buildMsg(msg), ...params),
        warn: (msg, ...params) => log.warn(buildMsg(msg), ...params),
        error: (msg, ...params) => log.error(buildMsg(msg), ...params),
        setModel: (modelName) => (model = modelName),
    };
}
//# sourceMappingURL=logger.js.map