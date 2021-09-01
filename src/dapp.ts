const debug = require('debug')('dpack')
const fs = require('fs')

const ethers = require('ethers')
const { getIpfsJson } = require("./ipfs-util");

export class Dapp {
  _raw : any;
  objects : any;
  types : any;
  network : string;
  provider : any;
  signer : any;

  private constructor(raw : any) {
    this._raw = raw
    this.objects = {}
    this.types = {}
    this.network = ''
    this.signer = new ethers.VoidSigner("0x" + "00".repeat(20));
    this.reload();
  }

  static async loadFromFile(path : string) : Promise<Dapp> {
    const file = fs.readFileSync(path);
    const json = JSON.parse(file);
    return await Dapp.loadFromJson(json);
  }

  static async loadFromJson(json : any) : Promise<Dapp> {
    const out = JSON.parse(JSON.stringify(json)); // deep copy
    for (const key of Object.keys(json.types)) {
      const link = json.types[key].artifacts;
      if (link["/"]) {
        const hash = link["/"];
        const json = await getIpfsJson(hash);
        out.types[key].artifacts = json;
      }
    }
    for (const key of Object.keys(json.objects)) {
      const link = json.objects[key].artifacts;
      if (link["/"]) {
        const hash = link["/"];
        const json = await getIpfsJson(hash);
        out.objects[key].artifacts = json;
      }
    }
    return new Dapp(out);
  }

  static async loadFromCid(cid : string) {
    const json = await getIpfsJson(cid);
    return await Dapp.loadFromJson(json);
  }

  useProvider(provider : any) {
    this.provider = provider;
    this.network = this.provider._network.name;
    this.reload();
  }

  useSigner(signer : any) {
    this.signer = signer;
    this.reload();
  }

  reload() {
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

    for (const key of Object.keys(this._raw.types)) {
      const t = this._raw.types[key];
      let helper : any = {};
      if (t.bytecode) {
        let factory = new ethers.ContractFactory(t.abi, t.bytecode);
        if (this.signer) {
          factory = factory.connect(this.signer);
        } else if (this.provider) {
          factory = factory.connect(this.provider);
        }
        helper = factory;
      }
      helper.artifacts = t.artifacts;
      this.types[key] = helper;
    }
    debug(`reloaded: ${this}`);
  }

}
