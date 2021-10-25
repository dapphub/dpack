import * as fs from 'fs-extra'
import { IpfsJson } from './ipfs-json'

const debug = require('debug')('dpack')

export class Mutator {
  _init: any

  _pack: any

  ipfs: IpfsJson

  constructor(json: any) {
    this._init = JSON.parse(JSON.stringify(json)) // deep copy
    this._pack = JSON.parse(JSON.stringify(json)) // deep copy
    this.ipfs = new IpfsJson()
  }

  async addType(artifact: any): Promise<string> {
    const cid = await this.ipfs.put(artifact, true)
    debug(`addType ${artifact}`)
    const typename = artifact.contractName
    this._pack.types[typename] = {
      artifacts: { '/': cid.toString() }
    }
    return await Promise.resolve(cid.toString())
  }

  async addObject(
    name: string,
    address: string,
    network: string,
    artifacts: any
  ) {
    const old = this._pack.objects[name]
    const cid = await this.ipfs.put(artifacts, true)
    let addresses: any = {}
    if (old?.artifacts['/'] === cid) {
      addresses = old.addresses
    }
    addresses[network] = address

    const obj = old ?? {}
    obj.typename = artifacts.contractName
    obj.artifacts = { '/': cid.toString() }
    obj.addresses = addresses

    this._pack.objects[name] = obj
  }

  get init() {
    return this._init
  }

  get pack() {
    return this._pack
  }
}

export async function initPackFile(path: string, overwrite = false): Promise<any> {
  if (fs.existsSync(path) && !overwrite) {
    throw new Error(`initPackFile path already exists: ${path}`)
  }
  const _default = { types: {}, objects: {} }
  fs.writeFileSync(path, JSON.stringify(_default, null, 2))
}

export async function mutatePackObject(inpack: any, mutate: Function): Promise<any> {
  const mutator = new Mutator(inpack)
  await mutate(mutator)
  return await Promise.resolve(mutator._pack)
}

export async function mutatePackFile(inpath: string, outpath: string, mutate: Function): Promise<any> {
  let json: any
  if (inpath !== outpath && fs.existsSync(outpath)) {
    throw new Error(`mutatePackFile output file already exists and is not input file: ${outpath}`)
  }
  if (fs.existsSync(inpath)) {
    json = await fs.readJson(inpath)
  } else {
    json = { types: {}, objects: {} }
  }
  const mutated = await mutatePackObject(json, mutate)
  fs.writeFileSync(outpath, JSON.stringify(mutated, null, 2))
  return await Promise.resolve(mutated)
}
