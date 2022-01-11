const debug = require('debug')('dpack')

import { resolve } from './pure'
import { getIpfsJson } from './ipfs-util'

export class Dapp {
  _ethers: any
  _pack_original: any
  _pack_resolved: any
  objects: any
  types: any

  static async loadFromPack(pack: any, ethers : any = undefined) : Promise<Dapp> {
    const dapp = new Dapp();
    if (ethers != undefined) {
      dapp._ethers = ethers;
    } else {
      dapp._ethers = require('ethers')
    }

    dapp._pack_original = pack

    for (const key of Object.keys(dapp._pack_original.objects)) {
      const obj = dapp._pack_original.objects[key]
      const cid = obj.artifact["/"];
      const artifact = await getIpfsJson(cid);
      const abi = artifact.abi
      const addr = obj.address
      let instance = new ethers.Contract(addr, abi)
      instance = instance.connect(ethers.provider)
      instance.objectname = obj.typename
      // instance.address already exists
      instance.typename = obj.typename
      instance.artifact = obj.artifact
      dapp.objects[key] = instance
    }

    for (const key of Object.keys(dapp._pack_original.types)) {
      const typ = dapp._pack_original.types[key]
      const cid = typ.artifact["/"];
      const artifact = await getIpfsJson(cid);
      const abi = artifact.abi
      let deployer = new ethers.ContractFactory(abi)
      deployer = deployer.connect(ethers.provider)
      deployer.typename = typ.typename
      deployer.artifact = typ.artifact
      dapp.types[key] = deployer
    }

    return dapp;
  }

}
