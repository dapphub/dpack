const debug = require('debug')('dpack')
import * as fs from 'fs-extra'
import { ethers } from 'ethers'

import { IpfsJson } from './ipfs-util'

export class Dapp {
  _raw: any

  objects: any

  types: any

  network: string

  provider: any

  signer: any

  ipfs: IpfsJson

  private constructor(raw: any) {
    this._raw = raw
    this.objects = {}
    this.types = {}
    this.network = ''
    this.signer = new ethers.VoidSigner('0x' + '00'.repeat(20))
    this.reload()
    this.ipfs = new IpfsJson()
  }

  static async loadFromFile(path: string): Promise<Dapp> {
    debug(`loadFromFile ${path}`)
    const json = await fs.readJson(path)
    return Dapp.loadFromJson(json)
  }

  static async loadFromJson(json: any): Promise<Dapp> {
    debug(`loadFromJson ${JSON.stringify(json)}`)
    const out = JSON.parse(JSON.stringify(json)) // deep copy
    // const dappTypes = Object.keys(json.types).reduce(async (acc, key) => {
    //   const o = await acc
    //   const link = json.types[key].artifacts
    //   if (link['/']) {
    //     const hash = link['/']
    //     o[key].artifacts = await getIpfsJson(hash)
    //   }
    //   return o
    // }, out.types)

    for await (const key of Object.keys(json.types)) {
      const link = json.types[key].artifacts
      if (link['/']) {
        const hash = link['/']
        const json = await this.ipfs.get(hash)
        out.types[key].artifacts = json
      }
    }

    for await (const key of Object.keys(json.objects)) {
      const link = json.objects[key].artifacts
      if (link['/']) {
        const hash = link['/']
        const json = await this.ipfs.get(hash)
        out.objects[key].artifacts = json
      }
    }

    return Promise.resolve(new Dapp(out))
  }

  static async loadFromCid(cid: string) {
    const json = await this.ipfs.get(cid)
    return Dapp.loadFromJson(json)
  }

  useProvider(provider: any) {
    this.provider = provider
    this.network = this.provider._network.name
    this.reload()
  }

  useDefaultProvider(network: string) {
    this.provider = ethers.getDefaultProvider(network)
    this.network = network
    this.reload()
  }

  useSigner(signer: any) {
    this.signer = signer
    this.reload()
  }

  reload() {
    if (this.signer) {
      this.signer = this.signer.connect(this.provider)
    }

    for (const key of Object.keys(this._raw.objects)) {
      const obj = this._raw.objects[key]
      if (obj && obj.addresses[this.network]) {
        const abi = obj.artifacts.abi
        const addr = obj.addresses[this.network]
        let instance = new ethers.Contract(addr, abi)
        if (this.signer) {
          instance = instance.connect(this.signer)
        } else if (this.provider) {
          instance = instance.connect(this.provider)
        }
        instance.typename = obj.typename
        instance.artifacts = obj.artifacts
        this.objects[key] = instance
      } else {
        debug(`NOTE no address for object ${key} on network ${this.network}`)
      }
    }

    for (const key of Object.keys(this._raw.types)) {
      const t = this._raw.types[key]
      let helper: any = {}
      if (t && t.artifacts.bytecode) {
        let factory = new ethers.ContractFactory(t.artifacts.abi, t.artifacts.bytecode)
        if (this.signer) {
          factory = factory.connect(this.signer)
        } else if (this.provider) {
          factory = factory.connect(this.provider)
        }
        helper = factory
      }
      helper.artifacts = t.artifacts
      this.types[key] = helper
    }
    debug(`reloaded: ${this}`)
  }
}
