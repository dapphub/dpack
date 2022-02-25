import { need } from './util'
import { getIpfsJson } from './ipfs-util'

const debug = require('debug')('dpack')
const default_ethers = require('ethers')

export class Dapp {
  _ethers: any
  _pack: any
  _objects: any
  _types: any

  private constructor () {}
  static async loadFromPack (pack: any, ethers: any = undefined): Promise<Dapp> {
    const dapp = new Dapp()
    let signer

    dapp._objects = {}
    dapp._types = {}
    dapp._pack = pack
    dapp._ethers = ethers ?? default_ethers

    try {
      [signer] = await dapp._ethers.getSigners()
    } catch {
      signer = dapp._ethers.Wallet.createRandom()
    }

    for (const key of Object.keys(dapp._pack.objects)) {
      const obj = dapp._pack.objects[key]
      const cid = obj.artifact['/']
      const artifact = await getIpfsJson(cid)
      const abi = artifact.abi
      const addr = obj.address
      const instance = new dapp._ethers.Contract(addr, abi, signer)
      instance.objectname = obj.objectname
      // instance.address already exists
      instance.typename = obj.typename
      instance.artifact = obj.artifact
      dapp._objects[key] = instance
      need(dapp[key] == undefined, 'Panic: name collision on dapp object.')
      dapp[key] = instance
    }

    for (const key of Object.keys(dapp._pack.types)) {
      const typ = dapp._pack.types[key]
      const cid = typ.artifact['/']
      const artifact = await getIpfsJson(cid)
      const abi = artifact.abi
      const code = artifact.bytecode
      let deployer = new dapp._ethers.ContractFactory(abi, code)
      deployer = deployer.connect(signer)
      deployer.typename = typ.typename
      deployer.artifact = typ.artifact
      dapp._types[key] = deployer
    }

    return dapp
  }
}
