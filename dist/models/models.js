"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODELS = void 0;
const speedmodes_1 = require("./speedmodes");
const watermodes_1 = require("./watermodes");
exports.MODELS = {
    default: [
        {
            speed: speedmodes_1.speedmodes.gen4,
        },
    ],
    "rockrobo.vacuum.v1": [
        {
            speed: speedmodes_1.speedmodes["gen2-no_mop"],
        },
    ],
    "roborock.vacuum.c1": [
        {
            speed: speedmodes_1.speedmodes.gen1,
        },
    ],
    "roborock.vacuum.m1s": [
        {
            speed: speedmodes_1.speedmodes.gen3,
        },
    ],
    "roborock.vacuum.s5": [
        {
            speed: speedmodes_1.speedmodes.gen2,
        },
        {
            firmware: ">=3.5.7",
            speed: speedmodes_1.speedmodes.gen4,
        },
    ],
    "roborock.vacuum.s5e": [
        {
            speed: speedmodes_1.speedmodes["gen4+custom"],
            waterspeed: watermodes_1.watermodes.gen1,
        },
    ],
    "roborock.vacuum.s6": [
        {
            speed: speedmodes_1.speedmodes.gen4,
        },
    ],
    "roborock.vacuum.t6": [
        {
            speed: speedmodes_1.speedmodes.gen3,
        },
    ],
    "roborock.vacuum.t4": [
        {
            speed: speedmodes_1.speedmodes.gen3,
        },
    ],
    "roborock.vacuum.e2": [
        {
            speed: speedmodes_1.speedmodes["xiaowa-e202-02"],
        },
    ],
    "roborock.vacuum.a08": [
        {
            speed: speedmodes_1.speedmodes.gen3,
        },
    ],
    "roborock.vacuum.a09": [
        {
            speed: speedmodes_1.speedmodes["gen4+custom"],
            waterspeed: watermodes_1.watermodes["gen1+custom"],
        },
    ],
    // S6 MaxV
    "roborock.vacuum.a10": [
        {
            speed: speedmodes_1.speedmodes["gen4+custom"],
            waterspeed: watermodes_1.watermodes["gen1+custom"],
        },
    ],
    "roborock.vacuum.a11": [
        {
            speed: speedmodes_1.speedmodes["gen4+custom"],
            waterspeed: watermodes_1.watermodes["gen1+custom"],
        },
    ],
    // S7
    "roborock.vacuum.a15": [
        {
            speed: speedmodes_1.speedmodes["gen4+custom"],
            waterspeed: watermodes_1.watermodes["gen1+custom"],
        },
    ],
    // S7 MaxV
    "roborock.vacuum.a27": [
        {
            speed: speedmodes_1.speedmodes["gen5"],
            waterspeed: watermodes_1.watermodes["gen1+custom"],
        },
    ],
    // S8
    "roborock.vacuum.a51": [
        {
            speed: speedmodes_1.speedmodes["gen4+custom"],
            waterspeed: watermodes_1.watermodes["gen1+custom"],
        },
    ],
    // S7 Max Ultra
    "roborock.vacuum.a65": [
        {
            speed: speedmodes_1.speedmodes["gen4+custom"],
            waterspeed: watermodes_1.watermodes["gen1+custom"],
        },
    ],
    // Q5 Pro
    "roborock.vacuum.a72": [
        {
            speed: speedmodes_1.speedmodes["gen4+custom"],
        },
    ],
    // Q8S Max+
    "roborock.vacuum.a73": [
        {
            speed: speedmodes_1.speedmodes["gen4+custom"],
            waterspeed: watermodes_1.watermodes["gen1+custom"],
        },
    ],
    // Q Revo
    "roborock.vacuum.a75": [
        {
            speed: speedmodes_1.speedmodes["gen4+custom"],
            waterspeed: watermodes_1.watermodes["gen1+custom"],
        },
    ],
    // Viomi
    viomi: [
        {
            speed: speedmodes_1.speedmodes.viomi,
        },
    ],
    "dreame.vacuum.mc1808": [
        {
            speed: speedmodes_1.speedmodes.viomi,
        },
    ],
    "viomi.vacuum.v7": [
        {
            speed: speedmodes_1.speedmodes.viomi,
        },
    ],
    "viomi.vacuum.v8": [
        {
            speed: speedmodes_1.speedmodes.viomi,
        },
    ],
};
//# sourceMappingURL=models.js.map