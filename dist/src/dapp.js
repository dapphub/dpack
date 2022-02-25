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
var util_1 = require("./util");
var ipfs_util_1 = require("./ipfs-util");
var debug = require('debug')('dpack');
var default_ethers = require('ethers');
var Dapp = /** @class */ (function () {
    function Dapp() {
    }
    Dapp.loadFromPack = function (pack, ethers) {
        if (ethers === void 0) { ethers = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var dapp, signer, _a, _i, _b, key, obj, cid, artifact, abi, addr, instance, _c, _d, key, typ, cid, artifact, abi, code, deployer;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        dapp = new Dapp();
                        dapp._objects = {};
                        dapp._types = {};
                        dapp._pack = pack;
                        dapp._ethers = ethers !== null && ethers !== void 0 ? ethers : default_ethers;
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, dapp._ethers.getSigners()];
                    case 2:
                        signer = (_e.sent())[0];
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _e.sent();
                        signer = dapp._ethers.Wallet.createRandom();
                        return [3 /*break*/, 4];
                    case 4:
                        _i = 0, _b = Object.keys(dapp._pack.objects);
                        _e.label = 5;
                    case 5:
                        if (!(_i < _b.length)) return [3 /*break*/, 8];
                        key = _b[_i];
                        obj = dapp._pack.objects[key];
                        cid = obj.artifact['/'];
                        return [4 /*yield*/, (0, ipfs_util_1.getIpfsJson)(cid)];
                    case 6:
                        artifact = _e.sent();
                        abi = artifact.abi;
                        addr = obj.address;
                        instance = new dapp._ethers.Contract(addr, abi, signer);
                        instance.objectname = obj.objectname;
                        // instance.address already exists
                        instance.typename = obj.typename;
                        instance.artifact = obj.artifact;
                        dapp._objects[key] = instance;
                        (0, util_1.need)(dapp[key] == undefined, 'Panic: name collision on dapp object.');
                        dapp[key] = instance;
                        _e.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8:
                        _c = 0, _d = Object.keys(dapp._pack.types);
                        _e.label = 9;
                    case 9:
                        if (!(_c < _d.length)) return [3 /*break*/, 12];
                        key = _d[_c];
                        typ = dapp._pack.types[key];
                        cid = typ.artifact['/'];
                        return [4 /*yield*/, (0, ipfs_util_1.getIpfsJson)(cid)];
                    case 10:
                        artifact = _e.sent();
                        abi = artifact.abi;
                        code = artifact.bytecode;
                        deployer = new dapp._ethers.ContractFactory(abi, code);
                        deployer = deployer.connect(signer);
                        deployer.typename = typ.typename;
                        deployer.artifact = typ.artifact;
                        dapp._types[key] = deployer;
                        _e.label = 11;
                    case 11:
                        _c++;
                        return [3 /*break*/, 9];
                    case 12: return [2 /*return*/, dapp];
                }
            });
        });
    };
    return Dapp;
}());
exports.Dapp = Dapp;
