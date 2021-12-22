const debug = require('debug')('dpack:builder')

import { dpack } from './dpack'

import { putIpfsJson } from './ipfs-util' // TODO replace with sync for `pack`
import {
  blank,
  merge as _merge,
  addType as _addType,
  addObject as _addObject,
  assertValidPack
} from './pure'

function need(b, s) {
  if (!b) throw new Error(s);
}

function copy(a : any) : any {
  return JSON.parse(JSON.stringify(a));
}

export class PackBuilder {
  _pack : dpack
  constructor(network : string) {
    need(network, `new PackBuilder(network) - network must be defined`)
    need(typeof(network) == 'string', `new PackBuilder(network) - network must be a string`)
    this._pack = blank();
    assertValidPack(this._pack);
  }

  addType(t : any) {
    this._pack = _addType(this._pack, t);
    assertValidPack(this._pack);
  }

  addObject(o : any) {
    this._pack = _addObject(this._pack, o);
    assertValidPack(this._pack);
  }

  merge(...packs : dpack[]) {
    this._pack = _merge(this._pack, ...packs);
    assertValidPack(this._pack);
  }

  async pack() : Promise<any> { // TODO make sync, put in bundle
    assertValidPack(this._pack);
    const p = copy(this._pack);
    delete p._bundle; delete p._resolved;
    for (const tkey of Object.keys(p.types)) {
      const t = p.types[tkey];
      const json = JSON.stringify(t.artifact);
      const cid = (await putIpfsJson(json)).toString();
      t.artifact = {"/":cid}
    }
    for (const okey of Object.keys(p.objects)) {
      const o = p.objects[okey];
      const json = JSON.stringify(o.artifact);
      const cid = (await putIpfsJson(json)).toString();
      o.artifact = {"/":cid}
    }
    return Promise.resolve(p);
  }

}
