"use strict";
exports.__esModule = true;
exports.putIpfsJson = exports.getIpfsJson = exports.Dapp = exports.PackBuilder = exports.builder = exports.load = void 0;
var builder_1 = require("./src/builder");
exports.PackBuilder = builder_1.PackBuilder;
var dapp_1 = require("./src/dapp");
exports.Dapp = dapp_1.Dapp;
var ipfs_util_1 = require("./src/ipfs-util");
exports.getIpfsJson = ipfs_util_1.getIpfsJson;
exports.putIpfsJson = ipfs_util_1.putIpfsJson;
var load = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    //Dapp.loadFromJson
};
exports.load = load;
var builder = function (network) { return new builder_1.PackBuilder(network); };
exports.builder = builder;
