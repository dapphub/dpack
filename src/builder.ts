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
    this._pack = blank(network)
    assertValidPack(this._pack)
  }

  async packType (t: any): Promise<PackBuilder> {
    const json = JSON.stringify(t.artifact)
    const cid = (await putIpfsJson(json)).toString()
    const info = copy(t)
    info.artifact = { '/': cid }
    this._pack = _addType(this._pack, info)
    return await Promise.resolve(this)
  }

  addType (t: any): PackBuilder {
    this._pack = _addType(this._pack, t)
    return this
  }

  async packObject (o: any, alsoPackType: boolean = true): Promise<PackBuilder> {
    const json = JSON.stringify(o.artifact)
    const cid = (await putIpfsJson(json)).toString()
    const info = copy(o)
    info.artifact = { '/': cid }

    let pack = _addObject(this._pack, info)
    if (alsoPackType) {
      pack = _addType(pack, {
        typename: info.typename,
        artifact: info.artifact
      })
    }
    this._pack = pack
    return await Promise.resolve(this)
  }

  addObject (o: any): PackBuilder {
    this._pack = _addObject(this._pack, o)
    return this
  }

  merge (...packs: DPack[]): PackBuilder {
    this._pack = _merge(this._pack, ...packs)
    return this
  }

  build (): any {
    assertValidPack(this._pack)
    return copy(this._pack)
  }
}
