const fs = require('fs')
const { putIpfsJson } = require('./ipfs-util')

class Mutator {
  _init: any;
  _pack: any;

  constructor(json: any) {
    this._init = JSON.parse(JSON.stringify(json)); // deep copy
    this._pack = JSON.parse(JSON.stringify(json)); // deep copy
  }

  async addType(typename: string, artifacts: any) : Promise<string> {
    const cid = await putIpfsJson(artifacts);
    this._pack.types[typename] = {
      artifacts: { "/": cid.toString() },
    };
    return Promise.resolve(cid);
  }

  async addObject(
    name: string,
    address: string,
    network: string,
    typename: string,
    artifacts: any
  ) {
    const old = this._init.objects[name];
    const cid = await putIpfsJson(artifacts);
    let addresses: any = {};
    if (old?.artifacts["/"] === cid) {
      addresses = old.addresses;
    }
    addresses[network] = address;

    const obj = old ?? {};
    obj.typename = typename;
    obj.artifacts = { "/": cid.toString() };
    obj.addresses = addresses;

    this._pack.objects[name] = obj;
  }
}

export async function initPackFile(path : string, override : boolean = false) : Promise<any> {
  if (fs.existsSync(path) && !override) {
    throw new Error(`packfile already exists: ${path}`)
  }
  const _default = { types : {}, objects: {} };
  fs.writeFileSync(path, JSON.stringify(_default, null, 2));
}

export async function mutatePackFile(inpath: string, outpath: string, mutate: Function) : Promise<any> {
  let json: any;
  if (fs.existsSync(outpath)) {
    throw new Error(`mutatePackFile output file already exists: ${outpath}`);
  }
  if (fs.existsSync(inpath)) {
    const file = fs.readFileSync(inpath);
    json = JSON.parse(file);
  } else {
    json = { types: {}, objects: {} };
  }
  const mutated = await mutatePackObject(json, mutate);
  fs.writeFileSync(outpath, JSON.stringify(mutated, null, 2));
  return Promise.resolve(mutated);
}

export async function mutatePackObject(inpack : any, mutate : Function) : Promise<any> {
  const mutator = new Mutator(inpack);
  await mutate(mutator);
  const mutated = mutator._pack;
  return Promise.resolve(mutated);
}


