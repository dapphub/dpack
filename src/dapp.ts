const debug = require('debug')('dpack')

const ethers = require('ethers')

export class Dapp {
  _pack: any
  o: any
  t: any

  constructor (pack: any, provider: any = undefined, signer: any = undefined) {
    this._pack = pack
    this.o = {}
    this.t = {}

    for (const key of Object.keys(this._pack.objects)) {
      const obj = this._pack.objects[key]
      const abi = obj.artifact.abi
      const addr = obj.address
      let instance = new ethers.Contract(addr, abi)
      if (signer !== undefined) {
        instance = instance.connect(signer)
      } else if (provider !== undefined) {
        instance = instance.connect(provider)
      }
      instance.typename = obj.typename
      instance.artifact = obj.artifact
      this.o[key] = instance
    }

    for (const key of Object.keys(this._pack.types)) {
      const t = this._pack.types[key]
      let typeinfo: any = {}
      if (t.artifact.bytecode !== undefined) {
        let factory = new ethers.ContractFactory(t.artifact.abi, t.artifact.bytecode)
        if (signer !== undefined) {
          factory = factory.connect(signer)
        } else if (provider !== undefined) {
          factory = factory.connect(provider)
        }
        typeinfo = factory
      }
      typeinfo.artifact = t.artifact
      this.t[key] = typeinfo
    }
  }
}
