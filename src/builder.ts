import { DPack } from './types'
import { need, copy } from './util'
import { putIpfsJson } from './ipfs-util'
import {
  blank,
  merge as _merge,
  addType as _addType,
  addObject as _addObject,
  assertValidPack,
  assertValidType
} from './pure'

const debug = require('debug')('DPack:builder')

export class PackBuilder {
  _pack: DPack
  constructor (network: string) {
    need(network, 'new PackBuilder(network) - network must be defined')
    need(typeof (network) === 'string', 'new PackBuilder(network) - network must be a string')
    this._pack = blank()
    assertValidPack(this._pack)
  }

  async packType (t: any) : Promise<PackBuilder> {
    const json = JSON.stringify(t.artifact);
    const cid = (await putIpfsJson(json)).toString();
    const packed = copy(t);
    packed.artifact = {'/':cid}
    this.addType(packed);
    assertValidPack(this._pack);
    return Promise.resolve(this);
  }

  addType (t: any): PackBuilder {
    assertValidType(t);
    this._pack = _addType(this._pack, t)
    assertValidPack(this._pack)
    return this
  }

  async packObject (o: any) : Promise<PackBuilder> {
    const json = JSON.stringify(o.artifact);
    const cid = (await putIpfsJson(json)).toString();
    const packed = copy(o);
    packed.artifact = {'/':cid}
    this.addObject(packed);
    assertValidPack(this._pack);
    return Promise.resolve(this);
  }

  addObject (o: any): PackBuilder {
    this._pack = _addObject(this._pack, o)
    assertValidPack(this._pack)
    return this
  }

  merge (...packs: DPack[]): PackBuilder {
    this._pack = _merge(this._pack, ...packs)
    assertValidPack(this._pack)
    return this
  }

  async build (): Promise<any> { // TODO make sync, put in bundle
    assertValidPack(this._pack)
    const p = copy(this._pack)
    delete p._bundle; delete p._resolved
    return Promise.resolve(p)
  }
}
