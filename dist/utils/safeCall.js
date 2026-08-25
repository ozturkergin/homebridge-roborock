"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeCall = safeCall;
/**
 * Calls the function `fn` if `maybeValue` is not undefined
 *
 * @param maybeValue The value that can be undefined
 * @param fn The function to be called with the value as a parameter
 */
function safeCall(maybeValue, fn) {
    if (typeof maybeValue !== "undefined") {
        fn(maybeValue);
    }
}
//# sourceMappingURL=safeCall.js.map