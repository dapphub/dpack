'use strict'
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt (value) { return value instanceof P ? value : new P(function (resolve) { resolve(value) }) }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) { try { step(generator.next(value)) } catch (e) { reject(e) } }
    function rejected (value) { try { step(generator.throw(value)) } catch (e) { reject(e) } }
    function step (result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected) }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1] }, trys: [], ops: [] }; var f; var y; var t; var g
  return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === 'function' && (g[Symbol.iterator] = function () { return this }), g
  function verb (n) { return function (v) { return step([n, v]) } }
  function step (op) {
    if (f) throw new TypeError('Generator is already executing.')
    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t
        if (y = 0, t) op = [op[0] & 2, t.value]
        switch (op[0]) {
          case 0: case 1: t = op; break
          case 4: _.label++; return { value: op[1], done: false }
          case 5: _.label++; y = op[1]; op = [0]; continue
          case 7: op = _.ops.pop(); _.trys.pop(); continue
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue }
            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break }
            if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break }
            if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break }
            if (t[2]) _.ops.pop()
            _.trys.pop(); continue
        }
        op = body.call(thisArg, _)
      } catch (e) { op = [6, e]; y = 0 } finally { f = t = 0 }
    }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true }
  }
}
exports.__esModule = true
exports.PackHandler = void 0
var debug = require('debug')('dpack')
var util_1 = require('./util')
var pure_1 = require('./pure')
var PackHandler = /** @class */ (function () {
  function PackHandler (p) {
    this.format = 'dpack-1'
    Object.assign(this, p)
    this.types = {}
    this.objects = {}
    this._bundle = {}
    this._resolved = false
    this.assertValid()
  }
  PackHandler.prototype.assertValid = function () {
    (0, pure_1.assertValidPack)(this)
  }
  // fills _bundle from ipfs
  PackHandler.prototype.resolve = function (ipfs) {
    return __awaiter(this, void 0, void 0, function () {
      function _resolve (link) {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                (0, util_1.need)(link, 'panic: bad DAG-JSON link');
                (0, util_1.need)(link['/'], 'panic: bad DAG-JSON link')
                return [4 /* yield */, ipfs.getIpfsJson(link['/'])]
              case 1: return [2 /* return */, _a.sent()]
            }
          })
        })
      }
      var _i, _a, key, _b, _c, _d, _e, key, _f, _g
      return __generator(this, function (_h) {
        switch (_h.label) {
          case 0:
            debug('dpack.resolve')
            this.assertValid()
            _i = 0, _a = Object.keys(this.types)
            _h.label = 1
          case 1:
            if (!(_i < _a.length)) return [3 /* break */, 4]
            key = _a[_i]
            _b = this._bundle
            _c = key
            return [4 /* yield */, _resolve(this.types[key])]
          case 2:
            _b[_c] = _h.sent()
            _h.label = 3
          case 3:
            _i++
            return [3 /* break */, 1]
          case 4:
            _d = 0, _e = Object.keys(this.objects)
            _h.label = 5
          case 5:
            if (!(_d < _e.length)) return [3 /* break */, 8]
            key = _e[_d]
            _f = this._bundle
            _g = key
            return [4 /* yield */, _resolve(this.objects[key])]
          case 6:
            _f[_g] = _h.sent()
            _h.label = 7
          case 7:
            _d++
            return [3 /* break */, 5]
          case 8:
            this._resolved = true
            return [2]
        }
      })
    })
  }
  return PackHandler
}())
exports.PackHandler = PackHandler
