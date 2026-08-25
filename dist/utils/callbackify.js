"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackify = callbackify;
/**
 * Converts a method/promise to the callback approach.
 * @param fn Method or Promise to run.
 * @param callback Callback to call with the result of `fn`.
 */
async function callbackify(fn, callback) {
    try {
        const result = await fn();
        callback(null, result);
    }
    catch (err) {
        callback(err);
    }
}
//# sourceMappingURL=callbackify.js.map