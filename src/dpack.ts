import { copy, need } from './util'
import { assertValidPack as _assertValidPack } from './pure'

const debug = require('debug')('dpack')

export interface typeinfo {
  typename: string
  artifact: any
}

export interface objectinfo {
  objectname: string
  address: string
  typename: string
  artifact: any
}

export interface dpack {
  format: string
  network: string
  types: {[typename: string]: typeinfo}
  objects: {[objectname: string]: objectinfo}
}

export class PackHandler implements dpack {
  format: string = 'dpack-1'
  network: string
  types: {[typename: string]: typeinfo}
  objects: {[objectname: string]: objectinfo}
  _bundle: any
  _resolved: boolean

  constructor (p) {
    Object.assign(this, p)
    this.types = {}
    this.objects = {}
    this._bundle = {}
    this._resolved = false
    this.assertValid()
  }

  assertValid (): void {
    _assertValidPack(this)
  }

  // fills _bundle from ipfs
  async resolve (ipfs: any): Promise<void> {
    debug('dpack.resolve')
    this.assertValid()
    async function _resolve (link): Promise<any> {
      need(link, 'panic: bad DAG-JSON link')
      need(link['/'], 'panic: bad DAG-JSON link')
      return await ipfs.getIpfsJson(link['/'])
    }
    for (const key of Object.keys(this.types)) {
      this._bundle[key] = await _resolve(this.types[key])
    }
    for (const key of Object.keys(this.objects)) {
      this._bundle[key] = await _resolve(this.objects[key])
    }
    this._resolved = true
  }

  // replaces artifact links with json
  async expand (): Promise<any> {
    need(this._resolved, 'dpack.expand(): this dpack is not resolved yet')
    for (const tkey of Object.keys(this.types)) {
      const t = this.types[tkey]
      t.artifact = this._bundle[t.artifact['/']]
    }
  }
}
