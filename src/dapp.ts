const debug = require('debug')('dpack')
const fs = require('fs')

const ethers = require('ethers')
const { getIpfsJson } = require("../index");

export class DPackDapp {
  _raw : any;
  objects : any;
  network : string;
  provider : any;
  signer : any;
  private constructor(raw : any) {
    this._raw = raw
    this.objects = {}
    this.network = ''
  }
  static async loadFromFile(path : string) : Promise<DPackDapp> {
    const file = fs.readFileSync(path);
    const dson = JSON.parse(file);
    return await DPackDapp.loadFromDson(dson);
  }
  static async loadFromDson(dson : any) : Promise<DPackDapp> {
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
    return DPackDapp.loadFromJson(out);
  }
  static loadFromJson(json : any) : DPackDapp {
    const dapp = new DPackDapp(json);
    return dapp;
  }
/*
  static loadFromCid(cid : string) {
  }
*/
  useNetwork(network : string) {
    this.network = network
    this.provider = ethers.getDefaultProvider(network);
    this._reload();
  }
  useSigner(hexPrivKey : string) {
    this.signer = new ethers.Wallet(hexPrivKey, this.provider);
    this._reload();
  }
  _reload() {
    if (this.signer) {
      this.signer = this.signer.connect(this.provider);
    }
    for (const key of Object.keys(this._raw.objects)) {
      const obj = this._raw.objects[key];
      if( obj && obj.addresses[this.network] ) {
        const abi = obj.artifacts.abi;
        const addr = obj.addresses[this.network];
        let instance = new ethers.Contract(addr, abi);
        if(this.signer) {
          instance = instance.connect(this.signer);
        } else if (this.provider) {
          instance = instance.connect(this.provider);
        }
        instance.typename = obj.typename;
        instance.artifacts = obj.artifacts;
        this.objects[key] = instance;
      } else {
        debug(`NOTE no address for object ${key} on network ${this.network}`);
      }
    }

  }
}
