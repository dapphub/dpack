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
exports.__esModule = true;
exports.putIpfsJson = exports.getIpfsJson = void 0;
var debug = require('debug')('dpack');
var IPFS = require('ipfs-core');
var node;
function getIpfsJson(hash) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var blob, s, blob_1, blob_1_1, chunk, e_1_1, json;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!!node) return [3 /*break*/, 2];
                    return [4 /*yield*/, IPFS.create({ silent: true, start: false })];
                case 1:
                    node = _b.sent();
                    _b.label = 2;
                case 2: return [4 /*yield*/, node.start()];
                case 3:
                    _b.sent();
                    debug("resolving " + hash);
                    return [4 /*yield*/, node.cat(hash)];
                case 4:
                    blob = _b.sent();
                    s = '';
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 10, 11, 16]);
                    blob_1 = __asyncValues(blob);
                    _b.label = 6;
                case 6: return [4 /*yield*/, blob_1.next()];
                case 7:
                    if (!(blob_1_1 = _b.sent(), !blob_1_1.done)) return [3 /*break*/, 9];
                    chunk = blob_1_1.value;
                    s += chunk;
                    _b.label = 8;
                case 8: return [3 /*break*/, 6];
                case 9: return [3 /*break*/, 16];
                case 10:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 16];
                case 11:
                    _b.trys.push([11, , 14, 15]);
                    if (!(blob_1_1 && !blob_1_1.done && (_a = blob_1["return"]))) return [3 /*break*/, 13];
                    return [4 /*yield*/, _a.call(blob_1)];
                case 12:
                    _b.sent();
                    _b.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 15: return [7 /*endfinally*/];
                case 16:
                    json = JSON.parse(s);
                    return [4 /*yield*/, node.stop()];
                case 17:
                    _b.sent();
                    return [2 /*return*/, json];
            }
        });
    });
}
exports.getIpfsJson = getIpfsJson;
function putIpfsJson(obj) {
    return __awaiter(this, void 0, void 0, function () {
        var str, cid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!node) return [3 /*break*/, 2];
                    return [4 /*yield*/, IPFS.create({ silent: true, start: false })];
                case 1:
                    node = _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, node.start()];
                case 3:
                    _a.sent();
                    str = JSON.stringify(obj);
                    return [4 /*yield*/, node.add(str)];
                case 4:
                    cid = (_a.sent()).cid;
                    require('fs').writeFileSync('/tmp/ipfs/' + cid, str);
                    debug(cid);
                    return [4 /*yield*/, node.stop()];
                case 5:
                    _a.sent();
                    return [2 /*return*/, cid];
            }
        });
    });
}
exports.putIpfsJson = putIpfsJson;
