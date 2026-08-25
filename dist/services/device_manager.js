"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceManager = void 0;
const rxjs_1 = require("rxjs");
const miio_1 = __importDefault(require("../miio"));
const constants_1 = require("../utils/constants");
const GET_STATE_INTERVAL_MS = 30000; // 30s
class DeviceManager {
    hap;
    log;
    internalDevice$ = new rxjs_1.BehaviorSubject(undefined);
    ip;
    token;
    internalErrorChanged$ = new rxjs_1.Subject();
    internalStateChanged$ = new rxjs_1.Subject();
    errorChanged$ = this.internalErrorChanged$.pipe((0, rxjs_1.distinct)());
    stateChanged$ = this.internalStateChanged$.asObservable();
    deviceConnected$ = this.internalDevice$.pipe((0, rxjs_1.filter)(Boolean));
    connectingPromise = null;
    connectRetry = setTimeout(() => void 0, 100); // Noop timeout only to initialise the property
    handshakeResolved = false;
    handshakeResolve;
    handshakePromise = new Promise((resolve) => {
        this.handshakeResolve = resolve;
    });
    constructor(hap, log, config) {
        this.hap = hap;
        this.log = log;
        if (!config.ip) {
            throw new Error("You must provide an ip address of the vacuum cleaner.");
        }
        this.ip = config.ip;
        if (!config.token) {
            throw new Error("You must provide a token of the vacuum cleaner.");
        }
        this.token = config.token;
        this.connect().catch(() => {
            // Do nothing in the catch because this function already logs the error internally and retries after 2 minutes.
        });
    }
    get model() {
        return this.internalDevice$.value?.miioModel || "unknown";
    }
    get isConnected() {
        return !!this.internalDevice$.value;
    }
    async waitForHandshake(timeoutMs = 5000) {
        if (this.isConnected)
            return;
        await Promise.race([
            this.handshakePromise,
            new Promise((resolve) => setTimeout(resolve, timeoutMs)),
        ]);
    }
    get state() {
        return this.property("state");
    }
    get isCleaning() {
        return constants_1.cleaningStatuses.includes(this.state);
    }
    get isPaused() {
        return this.state === "paused";
    }
    get device() {
        if (!this.internalDevice$.value) {
            throw new Error("Not connected yet");
        }
        return this.internalDevice$.value;
    }
    property(propertyName) {
        return this.internalDevice$.value?.property(propertyName);
    }
    async ensureDevice(callingMethod) {
        try {
            if (!this.internalDevice$.value) {
                const errMsg = `${callingMethod} | No vacuum cleaner is discovered yet.`;
                if (this.handshakeResolved) {
                    this.log.error(errMsg);
                }
                else {
                    this.log.debug(errMsg);
                }
                throw new Error(errMsg);
            }
            // checking if the device has an open socket it will fail retrieving it if not
            // https://github.com/aholstenson/miio/blob/master/lib/network.js#L227
            const socket = this.internalDevice$.value.handle.api.parent.socket;
            this.log.debug(`DEB ensureDevice | ${this.model} | The socket is still on. Reusing it.`);
        }
        catch (error) {
            const err = error;
            if (/destroyed/i.test(err.message) ||
                /No vacuum cleaner is discovered yet/.test(err.message)) {
                this.log.info(`INF ensureDevice | ${this.model} | The socket was destroyed or not initialised, initialising the device`);
                await this.connect();
            }
            else {
                this.log.error(err.message, err);
                throw err;
            }
        }
    }
    async connect() {
        if (this.connectingPromise === null) {
            // if already trying to connect, don't trigger yet another one
            this.connectingPromise = this.initializeDevice().catch((error) => {
                this.log.error(`ERR connect | miio.device, next try in 2 minutes | ${error}`);
                clearTimeout(this.connectRetry);
                // Using setTimeout instead of holding the promise. This way we'll keep retrying but not holding the other actions
                this.connectRetry = setTimeout(() => this.connect().catch(() => { }), 120000);
                throw error;
            });
        }
        try {
            await this.connectingPromise;
            clearTimeout(this.connectRetry);
        }
        finally {
            this.connectingPromise = null;
        }
    }
    async initializeDevice() {
        this.log.debug("DEB getDevice | Discovering vacuum cleaner");
        const device = await miio_1.default.device({ address: this.ip, token: this.token });
        if (device.matches("type:vaccuum")) {
            this.internalDevice$.next(device);
            this.log.setModel(this.model);
            this.log.info("STA getDevice | Connected to: %s", this.ip);
            this.log.info("STA getDevice | Model: " + this.model);
            this.log.info("STA getDevice | State: " + this.property("state"));
            this.log.info("STA getDevice | FanSpeed: " + this.property("fanSpeed"));
            this.log.info("STA getDevice | BatteryLevel: " + this.property("batteryLevel"));
            this.handshakeResolved = true;
            this.handshakeResolve?.();
            this.device.on("errorChanged", (error) => this.internalErrorChanged$.next(error));
            this.device.on("stateChanged", (state) => this.internalStateChanged$.next(state));
            // Refresh the state every 30s so miio maintains a fresh connection (or recovers connection if lost until we fix https://github.com/homebridge-xiaomi-roborock-vacuum/homebridge-xiaomi-roborock-vacuum/issues/81)
            (0, rxjs_1.timer)(0, GET_STATE_INTERVAL_MS).pipe((0, rxjs_1.exhaustMap)(() => this.getState()));
        }
        else {
            const model = (device || {}).miioModel;
            this.log.error(`Device "${model}" is not registered as a vacuum cleaner! If you think it should be, please open an issue at https://github.com/homebridge-xiaomi-roborock-vacuum/homebridge-xiaomi-roborock-vacuum/issues/new and provide this line.`);
            this.log.debug(device);
            device.destroy();
        }
    }
    async getState() {
        try {
            await this.ensureDevice("getState");
            await this.device.poll();
            const state = await this.device.state();
            this.log.debug(`DEB getState | ${this.model} | State %j | Props %j`, state, this.device.properties);
            for (const key in state) {
                if (key === "error") {
                    this.internalErrorChanged$.next(state[key]);
                }
                else {
                    this.internalStateChanged$.next({ key, value: state[key] });
                }
            }
        }
        catch (err) {
            this.log.error(`getState | %j`, err);
        }
    }
}
exports.DeviceManager = DeviceManager;
//# sourceMappingURL=device_manager.js.map