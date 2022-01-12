import { getIpfsJson } from './ipfs-util'

const debug = require('debug')('dpack')

export class Dapp {
  _ethers: any
  _pack: any
  objects: any
  types: any

  private constructor () {}
  static async loadFromPack (pack: any, signer: any, ethers: any = undefined): Promise<Dapp> {
    const dapp = new Dapp()
    dapp.objects = {}
    dapp.types = {}
    dapp._pack = pack
    if (ethers != undefined) {
      dapp._ethers = ethers
    } else {
      dapp._ethers = require('ethers')
    }

    for (const key of Object.keys(dapp._pack.objects)) {
      const obj = dapp._pack.objects[key]
      const cid = obj.artifact['/']
      const artifact = await getIpfsJson(cid)
      const abi = artifact.abi
      const addr = obj.address
      let instance = new dapp._ethers.Contract(addr, abi, signer)
      instance.objectname = obj.typename
      // instance.address already exists
      instance.typename = obj.typename
      instance.artifact = obj.artifact
      dapp.objects[key] = instance
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
      dapp.types[key] = deployer
    }

    return dapp
  }
}
