const debug = require("debug")("dpack");

const fs = require("fs");
const ethers = require("ethers");

const IPFS = require("ipfs");
let node: any;

export async function getIpfsJson(hash: string) {
  if (!node) {
    node = await IPFS.create({ silent: true, start: false });
  }
  await node.start();
  debug(`resolving ${hash}`);
  const blob = await node.cat(hash);
  let s = "";
  for await (let chunk of blob) {
    s += chunk;
  }
  const json = JSON.parse(s);
  await node.stop();
  return json;
}

export async function putIpfsJson(obj: any): Promise<string> {
  if (!node) {
    node = await IPFS.create({ silent: true, start: false });
  }
  await node.start();
  const str = JSON.stringify(obj);
  const { cid } = await node.add(str);
  debug(cid);
  await node.stop();
  return cid;
}

export function verify(json: any) {
  // top level key names
  // subkey names
  // subkey value types
}

export async function resolve(dson: any) {
  verify(dson);
  const out = JSON.parse(JSON.stringify(dson)); // deep copy
  for (const key of Object.keys(dson.types)) {
    const link = dson.types[key].artifacts;
    const hash = link["/"];
    const json = await getIpfsJson(hash);
    out.types[key].artifacts = json;
  }
  for (const key of Object.keys(dson.objects)) {
    const link = dson.objects[key].artifacts;
    const hash = link["/"];
    const json = await getIpfsJson(hash);
    out.objects[key].artifacts = json;
  }
  return out;
}

export async function load(path: string) {
  const file = fs.readFileSync(path);
  const json = JSON.parse(file);
  return await resolve(json);
}

export async function dapp(path: string, network: string, wallet: any) {
  const pack = await load(path);
  const dapp = JSON.parse(JSON.stringify(pack)); // deep copy
  debug(dapp);
  for (const key of Object.keys(dapp.objects)) {
    const obj = dapp.objects[key];
    const abi = obj.artifacts.abi;
    const address = obj.addresses[network];
    debug(key, address);
    let instance = new ethers.Contract(address, abi);
    instance = instance.connect(wallet);
    instance.typename = obj.typename;
    instance.artifacts = obj.artifacts;
    dapp.objects[key] = instance;
  }
  dapp.wallet = wallet;
  return dapp;
}

class PackfileMutator {
  init: any;
  working: any;

  constructor(json: any) {
    this.init = JSON.parse(JSON.stringify(json)); // deep copy
    this.working = JSON.parse(JSON.stringify(json)); // deep copy
  }

  async addType(typename: string, artifacts: any) {
    const cid = await putIpfsJson(artifacts);
    this.working.types[typename] = {
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
    const old = this.init.objects[name];
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

    this.working.objects[name] = obj;
  }
}

export async function mutate(path: string, outpath: string, mutate: Function) {
  let json: any;
  if (fs.existsSync(path)) {
    const file = fs.readFileSync(path);
    json = JSON.parse(file);
  } else {
    json = { types: {}, objects: {} };
  }
  const mutator = new PackfileMutator(json);
  await mutate(mutator);
  const mutated = mutator.working;
  fs.writeFileSync(outpath, JSON.stringify(mutated, null, 2));
}
