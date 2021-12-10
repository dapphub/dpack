const debug = require('debug')('dpack')

const fs = require('fs')
const { putIpfsJson } = require('./ipfs-util')

class Mutator {
  _init: any
  _pack: any

  constructor (json: any) {
    this._init = JSON.parse(JSON.stringify(json)) // deep copy
    this._pack = JSON.parse(JSON.stringify(json)) // deep copy
  }

  async addType (artifacts: any): Promise<string> {
    const cid = await putIpfsJson(artifacts, true)
    debug(`addType ${artifacts}`)
    const typename = artifacts.contractName
    if (this._pack.types[typename] !== undefined) {
      return await Promise.reject(new Error(`Typename already exists in pack: ${typename}`));
    }
    this._pack.types[typename] = {
      artifacts: { '/': cid.toString() }
    }
    return await Promise.resolve(cid)
  }

  async addObject (
    name: string,
    address: string,
    network: string,
    artifacts: any
  ) {
    if (this._pack.objects[name] !== undefined) {
      return await Promise.reject(new Error(`Object name already exists in pack: ${name}`));
    }
    const cid = await putIpfsJson(artifacts, true)
    const obj = {}
    obj.typename = artifacts.contractName
    obj.artifacts = { '/': cid.toString() }
    obj.address = address

    this._pack.objects[name] = obj
  }
}

export async function initPackFile (path: string, override: boolean = false): Promise<any> {
  if (fs.existsSync(path) && !override) {
    throw new Error(`initPackFile path already exists: ${path}`)
  }
  const _default = { types: {}, objects: {} }
  fs.writeFileSync(path, JSON.stringify(_default, null, 2))
}

export async function mutatePackFile (inpath: string, outpath: string, mutate: Function): Promise<any> {
  let json: any
  if (inpath !== outpath && fs.existsSync(outpath)) {
    throw new Error(`mutatePackFile output file already exists and is not input file: ${outpath}`)
  }
  if (fs.existsSync(inpath)) {
    const file = fs.readFileSync(inpath)
    json = JSON.parse(file)
  } else {
    json = { types: {}, objects: {} }
  }
  const mutated = await mutatePackObject(json, mutate)
  fs.writeFileSync(outpath, JSON.stringify(mutated, null, 2))
  return await Promise.resolve(mutated)
}

export async function mutatePackObject (inpack: any, mutate: Function): Promise<any> {
  const mutator = new Mutator(inpack)
  await mutate(mutator)
  const mutated = mutator._pack
  return await Promise.resolve(mutated)
}
