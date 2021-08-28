const { putIpfsJson } = require('./ipfs-util')

class Mutator {
  _init: any;
  _pack: any;

  constructor(json: any) {
    this._init = JSON.parse(JSON.stringify(json)); // deep copy
    this._pack = JSON.parse(JSON.stringify(json)); // deep copy
  }

  async addType(typename: string, artifacts: any) {
    const cid = await putIpfsJson(artifacts);
    this._pack.types[typename] = {
      artifacts: { "/": cid.toString() },
    };
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

export async function mutate(inpath: string, outpath: string, mutate: Function) {
  let json: any;
  if (fs.existsSync(inpath)) {
    const file = fs.readFileSync(inpath);
    json = JSON.parse(file);
  } else {
    json = { types: {}, objects: {} };
  }
  const mutator = new Mutator(json);
  await mutate(mutator);
  const mutated = mutator._pack;
  fs.writeFileSync(outpath, JSON.stringify(mutated, null, 2));
}
