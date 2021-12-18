const debug = require('debug')('dpack')
const fs = require('fs')

const ethers = require('ethers')
const { getIpfsJson } = require('./ipfs-util')

export class Dapp {
  _pack: any
  o: any
  t: any
  signerOrProvider: any

  constructor (pack: any, provider: any, signer: any) {
    this._pack = pack
    this.o = {}
    this.t = {}

    for (const key of Object.keys(this._pack.objects)) {
      const obj = this._pack.objects[key]
      const abi = obj.artifact.abi
      const addr = obj.address
      let instance = new ethers.Contract(addr, abi)
      if (signer) {
        instance = instance.connect(signer)
      } else if (provider) {
        instance = instance.connect(provider)
      }
      instance.typename = obj.typename
      instance.artifact = obj.artifact
      this.o[key] = instance
    }

    for (const key of Object.keys(this._pack.types)) {
      const t = this._pack.types[key]
      let typeinfo: any = {}
      if (t.artifact.bytecode) {
        let factory = new ethers.ContractFactory(t.artifact.abi, t.artifact.bytecode)
        if (signer) {
          factory = factory.connect(signer)
        } else if (provider) {
          factory = factory.connect(provider)
        }
        typeinfo = factory
      }
      typeinfo.artifact = t.artifact
      this.t[key] = typeinfo
    }
    debug(`reloaded: ${this}`)
  }
}
