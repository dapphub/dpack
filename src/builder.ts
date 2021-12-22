const debug = require('debug')('Dpack:builder')

import { Dpack } from './types'
import { need, copy } from './util'
import { putIpfsJson } from './ipfs-util' // TODO replace with sync for `pack`
import {
  blank,
  merge as _merge,
  addType as _addType,
  addObject as _addObject,
  assertValidPack
} from './pure'

export class PackBuilder {
  _pack: Dpack
  constructor (network: string) {
    need(network, 'new PackBuilder(network) - network must be defined')
    need(typeof (network) === 'string', 'new PackBuilder(network) - network must be a string')
    this._pack = blank()
    assertValidPack(this._pack)
  }

  addType (t: any): PackBuilder {
    this._pack = _addType(this._pack, t)
    assertValidPack(this._pack)
    return this
  }

  addObject (o: any): PackBuilder {
    this._pack = _addObject(this._pack, o)
    assertValidPack(this._pack)
    return this
  }

  merge (...packs: Dpack[]): PackBuilder {
    this._pack = _merge(this._pack, ...packs)
    assertValidPack(this._pack)
    return this
  }

  async pack (): Promise<any> { // TODO make sync, put in bundle
    assertValidPack(this._pack)
    const p = copy(this._pack)
    delete p._bundle; delete p._resolved
    for (const tkey of Object.keys(p.types)) {
      const t = p.types[tkey]
      const json = JSON.stringify(t.artifact)
      const cid = (await putIpfsJson(json)).toString()
      t.artifact = { '/': cid }
    }
    for (const okey of Object.keys(p.objects)) {
      const o = p.objects[okey]
      const json = JSON.stringify(o.artifact)
      const cid = (await putIpfsJson(json)).toString()
      o.artifact = { '/': cid }
    }
    return await Promise.resolve(p)
  }
}
