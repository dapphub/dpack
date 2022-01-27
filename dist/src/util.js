"use strict";
exports.__esModule = true;
exports.omap = exports.need = exports.copy = void 0;
var v8 = require('v8');
function copy(a) {
    return v8.deserialize(v8.serialize(a));
    //  return JSON.parse(JSON.stringify(a))
}
exports.copy = copy;
function need(b, s) {
    if (!b)
        throw new Error(s);
}
exports.need = need;
function omap(o, f) {
    var out = {};
    for (var _i = 0, _a = Object.entries(o); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        out[k] = f(v);
    }
    return out;
}
exports.omap = omap;
