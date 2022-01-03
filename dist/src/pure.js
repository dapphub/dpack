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
exports.fromObject = exports.resolve = exports.blank = exports.merge = exports.addObject = exports.addType = exports.assertValidResolvedPack = exports.assertValidArtifact = exports.assertValidObject = exports.assertValidType = exports.assertValidPack = exports.schema = void 0;
var util_1 = require("./util");
var schema = require("./schema");
exports.schema = schema;
function assertValidPack(p) {
    (0, util_1.need)(schema.isWellFormedPack(p), "dpack.assertValidPack(): pack fails schema validation: " + schema.isWellFormedPack.errors);
    (0, util_1.need)(p.format === 'dpack-1', "dpack.assertValidPack() - unrecognized 'format' field: " + p.format);
    (0, util_1.omap)(p.objects, function (o) { assertValidObject(o); return o; });
    (0, util_1.omap)(p.types, function (t) { assertValidType(t); return t; });
}
exports.assertValidPack = assertValidPack;
function assertValidType(t) {
    (0, util_1.need)(schema.isWellFormedType(t), "dpack.addType() - not well formed type: " + t);
}
exports.assertValidType = assertValidType;
function assertValidObject(o) {
    (0, util_1.need)(schema.isWellFormedObject(o), "dpack.addType() - not well formed object: " + o);
}
exports.assertValidObject = assertValidObject;
function assertValidArtifact(a) {
    (0, util_1.need)(schema.isWellFormedArtifact(a), "dpack.addType() - not well formed artifact: " + a);
}
exports.assertValidArtifact = assertValidArtifact;
function assertValidResolvedPack(rp) {
    (0, util_1.need)(schema.isWellFormedResolvedPack(rp), "dpack.addType() - not well formed resolved pack: " + rp);
    // for each type/object, assert bundle has artifact
    // for each artifact, assert is valid
}
exports.assertValidResolvedPack = assertValidResolvedPack;
function addType(pack, type) {
    assertValidPack(pack);
    assertValidType(type);
    (0, util_1.need)(!(pack.types[type.typename]), "dpack.addType() - typename already exists: " + type.typename);
    var out = (0, util_1.copy)(pack);
    out.types[type.typename] = type;
    assertValidPack(out);
    return out;
}
exports.addType = addType;
function addObject(pack, obj) {
    assertValidPack(pack);
    assertValidObject(obj);
    (0, util_1.need)(!(pack.objects[obj.objectname]), "dpack.addObject() - objectname already exists: " + obj.objectname);
    var out = (0, util_1.copy)(pack);
    out.objects[obj.objectname] = obj;
    assertValidPack(pack);
    return out;
}
exports.addObject = addObject;
function merge() {
    var packs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        packs[_i] = arguments[_i];
    }
    var head = packs[0];
    var rest = packs.slice(1);
    packs.map(function (p) {
        assertValidPack(p);
        (0, util_1.need)(p.format === head.format, 'dpack.merge() - two packs have different \'format\' fields');
        (0, util_1.need)(p.network === head.network, 'dpack.merge() - two packs have different \'network\' fields');
    });
    var out = (0, util_1.copy)(head);
    for (var _a = 0, rest_1 = rest; _a < rest_1.length; _a++) {
        var pack = rest_1[_a];
        for (var _b = 0, _c = Object.keys(pack.types); _b < _c.length; _b++) {
            var tkey = _c[_b];
            out = addType(out, pack.types[tkey]);
        }
        for (var _d = 0, _e = Object.keys(pack.objects); _d < _e.length; _d++) {
            var okey = _e[_d];
            out = addObject(out, pack.objects[okey]);
        }
    }
    assertValidPack(out);
    return out;
}
exports.merge = merge;
function blank() {
    var pack = {
        format: 'dpack-1',
        network: '',
        types: {},
        objects: {}
    };
    assertValidPack(pack);
    return pack;
}
exports.blank = blank;
function resolve(pack, ipfs) {
    if (ipfs === void 0) { ipfs = undefined; }
    return __awaiter(this, void 0, void 0, function () {
        function _resolve(link) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            (0, util_1.need)(link, 'panic: bad DAG-JSON link');
                            (0, util_1.need)(link['/'], 'panic: bad DAG-JSON link');
                            return [4 /*yield*/, ipfs.getIpfsJson(link['/'])];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        }
        var out, _i, _a, key, _b, _c, _d, _e, key, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    assertValidPack(pack);
                    out = (0, util_1.copy)(pack);
                    out._bundle = {};
                    _i = 0, _a = Object.keys(this.types);
                    _h.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    key = _a[_i];
                    _b = out._bundle;
                    _c = key;
                    return [4 /*yield*/, _resolve(this.types[key].artifact)];
                case 2:
                    _b[_c] = _h.sent();
                    _h.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    _d = 0, _e = Object.keys(this.objects);
                    _h.label = 5;
                case 5:
                    if (!(_d < _e.length)) return [3 /*break*/, 8];
                    key = _e[_d];
                    _f = out._bundle;
                    _g = key;
                    return [4 /*yield*/, _resolve(this.objects[key].artifact)];
                case 6:
                    _f[_g] = _h.sent();
                    _h.label = 7;
                case 7:
                    _d++;
                    return [3 /*break*/, 5];
                case 8: return [4 /*yield*/, Promise.resolve(out)];
                case 9: return [2 /*return*/, _h.sent()];
            }
        });
    });
}
exports.resolve = resolve;
function fromObject(obj) {
    assertValidPack(obj);
    return obj;
}
exports.fromObject = fromObject;
/*
export function fromJsonString(s : any) : DPack
export function fromCidString(s : any) : DPack
export function toJsonString(p : DPack) : string
*/
