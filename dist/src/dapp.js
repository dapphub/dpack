"use strict";
exports.__esModule = true;
exports.Dapp = void 0;
var debug = require('debug')('dpack');
var ethers = require('ethers');
var Dapp = /** @class */ (function () {
    function Dapp(pack, provider, signer) {
        if (provider === void 0) { provider = undefined; }
        if (signer === void 0) { signer = undefined; }
        this._pack = pack;
        this.o = {};
        this.t = {};
        for (var _i = 0, _a = Object.keys(this._pack.objects); _i < _a.length; _i++) {
            var key = _a[_i];
            var obj = this._pack.objects[key];
            var abi = obj.artifact.abi;
            var addr = obj.address;
            var instance = new ethers.Contract(addr, abi);
            if (signer !== undefined) {
                instance = instance.connect(signer);
            }
            else if (provider !== undefined) {
                instance = instance.connect(provider);
            }
            instance.typename = obj.typename;
            instance.artifact = obj.artifact;
            this.o[key] = instance;
        }
        for (var _b = 0, _c = Object.keys(this._pack.types); _b < _c.length; _b++) {
            var key = _c[_b];
            var t = this._pack.types[key];
            var typeinfo = {};
            if (t.artifact.bytecode !== undefined) {
                var factory = new ethers.ContractFactory(t.artifact.abi, t.artifact.bytecode);
                if (signer !== undefined) {
                    factory = factory.connect(signer);
                }
                else if (provider !== undefined) {
                    factory = factory.connect(provider);
                }
                typeinfo = factory;
            }
            typeinfo.artifact = t.artifact;
            this.t[key] = typeinfo;
        }
    }
    return Dapp;
}());
exports.Dapp = Dapp;
