"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.Dapp = exports.loadFromCid = exports.loadFromJson = exports.loadFromFile = exports.putIpfsJson = exports.getIpfsJson = void 0;
var dapp_1 = require("./src/dapp");
exports.Dapp = dapp_1.Dapp;
var ipfs_util_1 = require("./src/ipfs-util");
__createBinding(exports, ipfs_util_1, "getIpfsJson");
__createBinding(exports, ipfs_util_1, "putIpfsJson");
__exportStar(require("./src/mutator"), exports);
exports.loadFromFile = dapp_1.Dapp.loadFromFile;
exports.loadFromJson = dapp_1.Dapp.loadFromJson;
exports.loadFromCid = dapp_1.Dapp.loadFromCid;
