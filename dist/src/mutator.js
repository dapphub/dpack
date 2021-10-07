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
exports.mutatePackObject = exports.mutatePackFile = exports.initPackFile = void 0;
var debug = require('debug')('dpack');
var fs = require('fs');
var putIpfsJson = require('./ipfs-util').putIpfsJson;
var Mutator = /** @class */ (function () {
    function Mutator(json) {
        this._init = JSON.parse(JSON.stringify(json)); // deep copy
        this._pack = JSON.parse(JSON.stringify(json)); // deep copy
    }
    Mutator.prototype.addType = function (artifacts) {
        return __awaiter(this, void 0, void 0, function () {
            var cid, typename;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, putIpfsJson(artifacts, true)];
                    case 1:
                        cid = _a.sent();
                        debug("addType " + artifacts);
                        typename = artifacts.contractName;
                        this._pack.types[typename] = {
                            artifacts: { '/': cid.toString() }
                        };
                        return [4 /*yield*/, Promise.resolve(cid)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Mutator.prototype.addObject = function (name, address, network, artifacts) {
        return __awaiter(this, void 0, void 0, function () {
            var old, cid, addresses, obj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        old = this._pack.objects[name];
                        return [4 /*yield*/, putIpfsJson(artifacts, true)];
                    case 1:
                        cid = _a.sent();
                        addresses = {};
                        if ((old === null || old === void 0 ? void 0 : old.artifacts['/']) === cid) {
                            addresses = old.addresses;
                        }
                        addresses[network] = address;
                        obj = old !== null && old !== void 0 ? old : {};
                        obj.typename = artifacts.contractName;
                        obj.artifacts = { '/': cid.toString() };
                        obj.addresses = addresses;
                        this._pack.objects[name] = obj;
                        return [2 /*return*/];
                }
            });
        });
    };
    return Mutator;
}());
function initPackFile(path, override) {
    if (override === void 0) { override = false; }
    return __awaiter(this, void 0, void 0, function () {
        var _default;
        return __generator(this, function (_a) {
            if (fs.existsSync(path) && !override) {
                throw new Error("initPackFile path already exists: " + path);
            }
            _default = { types: {}, objects: {} };
            fs.writeFileSync(path, JSON.stringify(_default, null, 2));
            return [2 /*return*/];
        });
    });
}
exports.initPackFile = initPackFile;
function mutatePackFile(inpath, outpath, mutate) {
    return __awaiter(this, void 0, void 0, function () {
        var json, file, mutated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (inpath !== outpath && fs.existsSync(outpath)) {
                        throw new Error("mutatePackFile output file already exists and is not input file: " + outpath);
                    }
                    if (fs.existsSync(inpath)) {
                        file = fs.readFileSync(inpath);
                        json = JSON.parse(file);
                    }
                    else {
                        json = { types: {}, objects: {} };
                    }
                    return [4 /*yield*/, mutatePackObject(json, mutate)];
                case 1:
                    mutated = _a.sent();
                    fs.writeFileSync(outpath, JSON.stringify(mutated, null, 2));
                    return [4 /*yield*/, Promise.resolve(mutated)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.mutatePackFile = mutatePackFile;
function mutatePackObject(inpack, mutate) {
    return __awaiter(this, void 0, void 0, function () {
        var mutator, mutated;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mutator = new Mutator(inpack);
                    return [4 /*yield*/, mutate(mutator)];
                case 1:
                    _a.sent();
                    mutated = mutator._pack;
                    return [4 /*yield*/, Promise.resolve(mutated)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.mutatePackObject = mutatePackObject;
