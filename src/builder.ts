import { DPack } from './types'
import { need, copy } from './util'
import { putIpfsJson } from './ipfs-util'
import {
  blank,
  merge as _merge,
  addType as _addType,
  addObject as _addObject,
  assertValidPack
} from './pure'

const debug = require('debug')('DPack:builder')

export class PackBuilder {
  _pack: DPack
  constructor (network: string) {
    need(network, 'new PackBuilder(network) - network must be defined')
    need(typeof (network) === 'string', 'new PackBuilder(network) - network must be a string')
    need(network !== 'mainnet', 'You may not use \'mainnet\' as a network name. You might mean \'ethereum\'.')
    need(network !== '', 'Network name cannot be empty.')
    this._pack = blank(network)
    assertValidPack(this._pack)
  }

  async packType (t: any, pin: boolean = false): Promise<PackBuilder> {
    const cid = (await putIpfsJson(t.artifact, pin)).toString()
    const info = copy(t)
    info.artifact = { '/': cid }
    this._pack = _addType(this._pack, info)
    return await Promise.resolve(this)
  }

  addType (t: any): PackBuilder {
    this._pack = _addType(this._pack, t)
    return this
  }

  async packObject (o: any, alsoPackType: boolean = true, pin: boolean = false): Promise<PackBuilder> {
    const cid = (await putIpfsJson(o.artifact, pin)).toString()
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
