const debug = require('debug')('dpack')
const fs = require('fs')

const ethers = require('ethers')
const { getIpfsJson } = require('./ipfs-util')

export class Dapp {
  _pack: any
  objects: any
  types: any
  provider: any
  signer: any

  private constructor (pack: any) {
    this._pack = pack
    this.objects = {}
    this.types = {}
    this.signer = new ethers.VoidSigner('0x' + '00'.repeat(20))
    this.useDefaultProvider();
    this.reload()
  }

  static async loadFromFile (path: string): Promise<Dapp> {
    debug(`loadFromFile ${path}`)
    const file = fs.readFileSync(path)
    const json = JSON.parse(file)
    return await Dapp.loadFromJson(json)
  }

  static async loadFromJson (json: any): Promise<Dapp> {
    debug(`loadFromJson ${JSON.stringify(json)}`)
    const out = JSON.parse(JSON.stringify(json)) // deep copy
    for (const key of Object.keys(json.types)) {
      const link = json.types[key].artifacts
      if (link['/']) {
        const hash = link['/']
        const json = await getIpfsJson(hash)
        out.types[key].artifacts = json
      }
    }
    for (const key of Object.keys(json.objects)) {
      const link = json.objects[key].artifacts
      if (link['/']) {
        const hash = link['/']
        const json = await getIpfsJson(hash)
        out.objects[key].artifacts = json
      }
    }
    return await Promise.resolve(new Dapp(out))
  }

  static async loadFromCid (cid: string) {
    const json = await getIpfsJson(cid)
    return await Dapp.loadFromJson(json)
  }

  useProvider (provider: any) {
    this.provider = provider
    this.reload()
  }

  useDefaultProvider () {
    this.provider = ethers.getDefaultProvider(this._pack.network)
    this.reload()
  }

  useSigner (signer: any) {
    this.signer = signer
    this.reload()
  }

  reload () {
    if (this.signer) {
      this.signer = this.signer.connect(this.provider)
    }

    for (const key of Object.keys(this._pack.objects)) {
      const obj = this._pack.objects[key]
      const abi = obj.artifacts.abi
      const addr = obj.address
      let instance = new ethers.Contract(addr, abi)
      if (this.signer) {
        instance = instance.connect(this.signer)
      } else if (this.provider) {
        instance = instance.connect(this.provider)
      }
      instance.typename = obj.typename
      instance.artifacts = obj.artifacts
      this.objects[key] = instance
    }

    for (const key of Object.keys(this._pack.types)) {
      const t = this._pack.types[key]
      let typeinfo: any = {}
      if (t.artifacts.bytecode) {
        let factory = new ethers.ContractFactory(t.artifacts.abi, t.artifacts.bytecode)
        if (this.signer) {
          factory = factory.connect(this.signer)
        } else if (this.provider) {
          factory = factory.connect(this.provider)
        }
        typeinfo = factory
      }
      typeinfo.artifacts = t.artifacts
      this.types[key] = typeinfo
    }
    debug(`reloaded: ${this}`)
  }
}
