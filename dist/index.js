"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.putIpfsJson = exports.getIpfsJson = exports.Dapp = exports.PackBuilder = exports.builder = exports.load = void 0;
var fs_1 = require("fs");
var builder_1 = require("./src/builder");
exports.PackBuilder = builder_1.PackBuilder;
var dapp_1 = require("./src/dapp");
exports.Dapp = dapp_1.Dapp;
var ipfs_util_1 = require("./src/ipfs-util");
exports.getIpfsJson = ipfs_util_1.getIpfsJson;
exports.putIpfsJson = ipfs_util_1.putIpfsJson;
var util_1 = require("./src/util");
var es6loader = require('./es6loader');
var load = function (arg, _ethers, _signer) {
    if (_ethers === void 0) { _ethers = undefined; }
    if (_signer === void 0) { _signer = undefined; }
    return __awaiter(void 0, void 0, void 0, function () {
        var jams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(typeof arg === 'string')) return [3 /*break*/, 5];
                    if (!(0, ipfs_util_1.isCid)(arg)) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, ipfs_util_1.getIpfsJson)(arg)];
                case 1:
                    arg = _a.sent();
                    return [3 /*break*/, 5];
                case 2:
                    if (!(arg.split('.').pop() === 'jams')) return [3 /*break*/, 4];
                    return [4 /*yield*/, es6loader.loadModule('jams.js', 'jams')];
                case 3:
                    jams = _a.sent();
                    arg = jams((0, fs_1.readFileSync)(arg, { encoding: 'utf8' }));
                    return [3 /*break*/, 5];
                case 4:
                    arg = require(arg);
                    _a.label = 5;
                case 5:
                    (0, util_1.need)(typeof arg === 'object' && Object.keys(arg).length, 'Could not find a pack from provided source.');
                    return [4 /*yield*/, dapp_1.Dapp.loadFromPack(arg, _ethers, _signer)];
                case 6: return [2 /*return*/, _a.sent()];
            }
        });
    });
};
exports.load = load;
var builder = function (network) { return new builder_1.PackBuilder(network); };
exports.builder = builder;
