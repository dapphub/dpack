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
exports.Dapp = void 0;
var debug = require('debug')('dpack');
var fs = require('fs');
var ethers = require('ethers');
var getIpfsJson = require('./ipfs-util').getIpfsJson;
var Dapp = /** @class */ (function () {
    function Dapp(raw) {
        this._raw = raw;
        this.objects = {};
        this.types = {};
        this.network = '';
        this.signer = new ethers.VoidSigner('0x' + '00'.repeat(20));
        this.reload();
    }
    Dapp.loadFromFile = function (path) {
        return __awaiter(this, void 0, void 0, function () {
            var file, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        debug("loadFromFile " + path);
                        file = fs.readFileSync(path);
                        json = JSON.parse(file);
                        return [4 /*yield*/, Dapp.loadFromJson(json)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Dapp.loadFromJson = function (json) {
        return __awaiter(this, void 0, void 0, function () {
            var out, _i, _a, key, link, hash, json_1, _b, _c, key, link, hash, json_2;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        debug("loadFromJson " + JSON.stringify(json));
                        out = JSON.parse(JSON.stringify(json)) // deep copy
                        ;
                        _i = 0, _a = Object.keys(json.types);
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        key = _a[_i];
                        link = json.types[key].artifacts;
                        if (!link['/']) return [3 /*break*/, 3];
                        hash = link['/'];
                        return [4 /*yield*/, getIpfsJson(hash)];
                    case 2:
                        json_1 = _d.sent();
                        out.types[key].artifacts = json_1;
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        _b = 0, _c = Object.keys(json.objects);
                        _d.label = 5;
                    case 5:
                        if (!(_b < _c.length)) return [3 /*break*/, 8];
                        key = _c[_b];
                        link = json.objects[key].artifacts;
                        if (!link['/']) return [3 /*break*/, 7];
                        hash = link['/'];
                        return [4 /*yield*/, getIpfsJson(hash)];
                    case 6:
                        json_2 = _d.sent();
                        out.objects[key].artifacts = json_2;
                        _d.label = 7;
                    case 7:
                        _b++;
                        return [3 /*break*/, 5];
                    case 8: return [4 /*yield*/, Promise.resolve(new Dapp(out))];
                    case 9: return [2 /*return*/, _d.sent()];
                }
            });
        });
    };
    Dapp.loadFromCid = function (cid) {
        return __awaiter(this, void 0, void 0, function () {
            var json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getIpfsJson(cid)];
                    case 1:
                        json = _a.sent();
                        return [4 /*yield*/, Dapp.loadFromJson(json)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Dapp.prototype.useProvider = function (provider) {
        this.provider = provider;
        this.network = this.provider._network.name;
        this.reload();
    };
    Dapp.prototype.useDefaultProvider = function (network) {
        this.provider = ethers.getDefaultProvider(network);
        this.network = network;
        this.reload();
    };
    Dapp.prototype.useSigner = function (signer) {
        this.signer = signer;
        this.reload();
    };
    Dapp.prototype.reload = function () {
        if (this.signer) {
            this.signer = this.signer.connect(this.provider);
        }
        for (var _i = 0, _a = Object.keys(this._raw.objects); _i < _a.length; _i++) {
            var key = _a[_i];
            var obj = this._raw.objects[key];
            if (obj && obj.addresses[this.network]) {
                var abi = obj.artifacts.abi;
                var addr = obj.addresses[this.network];
                var instance = new ethers.Contract(addr, abi);
                if (this.signer) {
                    instance = instance.connect(this.signer);
                }
                else if (this.provider) {
                    instance = instance.connect(this.provider);
                }
                instance.typename = obj.typename;
                instance.artifacts = obj.artifacts;
                this.objects[key] = instance;
            }
            else {
                debug("NOTE no address for object " + key + " on network " + this.network);
            }
        }
        for (var _b = 0, _c = Object.keys(this._raw.types); _b < _c.length; _b++) {
            var key = _c[_b];
            var t = this._raw.types[key];
            var helper = {};
            if (t && t.artifacts.bytecode) {
                var factory = new ethers.ContractFactory(t.artifacts.abi, t.artifacts.bytecode);
                if (this.signer) {
                    factory = factory.connect(this.signer);
                }
                else if (this.provider) {
                    factory = factory.connect(this.provider);
                }
                helper = factory;
            }
            helper.artifacts = t.artifacts;
            this.types[key] = helper;
        }
        debug("reloaded: " + this);
    };
    return Dapp;
}());
exports.Dapp = Dapp;
