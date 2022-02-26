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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var _a;
exports.__esModule = true;
exports.isCid = exports.isV0CID = exports.pinIpfsCid = exports.putIpfsJson = exports.getIpfsJson = void 0;
var debug = require('debug')('dpack');
var IPFS = require('ipfs-http-client');
var nodeAddress = (_a = process.env["IPFS_RPC_URL"]) !== null && _a !== void 0 ? _a : '/ip4/127.0.0.1/tcp/5001';
debug("starting node ".concat(nodeAddress));
var node = IPFS.create(nodeAddress);
debug('started node');
function getIpfsJson(cid) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var blob, s, blob_1, blob_1_1, chunk, e_1_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (isV0CID(cid)) {
                        console.log("\nWARN: Detected a V0 CID string. This warning will become an error very soon.\nPlease repack the pack containing ".concat(cid, "\n"));
                    }
                    return [4 /*yield*/, node.cat(cid)];
                case 1:
                    blob = _b.sent();
                    s = '';
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 7, 8, 13]);
                    blob_1 = __asyncValues(blob);
                    _b.label = 3;
                case 3: return [4 /*yield*/, blob_1.next()];
                case 4:
                    if (!(blob_1_1 = _b.sent(), !blob_1_1.done)) return [3 /*break*/, 6];
                    chunk = blob_1_1.value;
                    s += chunk;
                    _b.label = 5;
                case 5: return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _b.trys.push([8, , 11, 12]);
                    if (!(blob_1_1 && !blob_1_1.done && (_a = blob_1["return"]))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _a.call(blob_1)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13: return [2 /*return*/, JSON.parse(s)];
            }
        });
    });
}
exports.getIpfsJson = getIpfsJson;
function putIpfsJson(obj, pin) {
    if (pin === void 0) { pin = false; }
    return __awaiter(this, void 0, void 0, function () {
        var str, cid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    str = JSON.stringify(obj);
                    debug("adding ".concat(str));
                    return [4 /*yield*/, node.add(str, { cidVersion: 1, pin: pin })];
                case 1:
                    cid = (_a.sent()).cid;
                    debug("added ".concat(str));
                    debug("put ".concat(cid));
                    return [2 /*return*/, cid.toString()];
            }
        });
    });
}
exports.putIpfsJson = putIpfsJson;
function pinIpfsCid(cid) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isV0CID(cid)) {
                        console.log("\nWARN: Detected a V0 CID string. This warning will become an error very soon.\nPlease repack the pack containing ".concat(cid, "\n"));
                    }
                    return [4 /*yield*/, node.pin.add(cid)];
                case 1:
                    _a.sent();
                    debug("pinned ".concat(cid));
                    return [2 /*return*/];
            }
        });
    });
}
exports.pinIpfsCid = pinIpfsCid;
// 'If a CID is 46 characters starting with "Qm", it's a CIDv0'
// https://docs.ipfs.io/concepts/content-addressing/#identifier-formats
function isV0CID(cidStr) {
    return (cidStr.length == 46 && cidStr.slice(0, 2) == 'Qm');
}
exports.isV0CID = isV0CID;
function isCid(cidStr) {
    try {
        IPFS.CID.parse(cidStr);
        return true;
    }
    catch (_a) {
        return false;
    }
}
exports.isCid = isCid;
