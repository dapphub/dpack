import { libdpack, pack, typeinfo, objectinfo, dapp, json } from './api';

let _ethers; // lazy loaded if not injected

function copy(a : any) : any {
  return JSON.parse(JSON.stringify(a));
}

function need(b, s) {
  if (!b) throw new Error(s);
}

export class dpack { //implements libdpack {
  constructor() { throw new Error(`Do not instantiate this class`); }
  static blank() : pack {
    return copy({
      format: 'dpack-1',
      network: '',
      objects: {},
      types: {}
    });
  }

  static addType(p : pack, n : string, t : typeinfo) : pack {
    need(t.artifact, `dpack.addType() - given typeinfo has not 'artifact' field`)
    need(!(p.types[n]), `dpack.addType() - typename already exists: ${n}`)

    const p2 = copy(p);
    p2.types[n] = t;
    this.assertValid(p2);

    return p2;
  }

  static addObject(p : pack, n : string, o : objectinfo) : pack {
    need(o.typename, `dpack.addObject() - object info is missing typename`)
    need(o.address, `dpack.addObject() - object info is missing address`)
    need(o.artifact, `dpack.addObject() - object info is missing artifact`)

    const p2 = copy(p);
    p2.objects[n] = o;
    this.assertValid(p2);

    return p2;
  }

  static merge(p1 : pack, p2 : pack) : pack {
    need(p1.format == p2.format, `dpack.merge(): argment packs have different 'format' fields`)
    need(p1.network == p2.network, `dpack.merge(): argment packs have different 'network' fields`)
    this.assertValid(p1);
    this.assertValid(p2);
    let p3 = copy(p1);
    for (const tkey of Object.keys(p2.types)) {
      p3 = this.addType(p3, tkey, p2.types[tkey]);
    }
    for (const okey of Object.keys(p2.objects)) {
      p3 = this.addObject(p3, okey, p2.objects[okey]);
    }
    this.assertValid(p3);
    return p3;
  }

  static assertValid(p : pack) {
  }

  static resolve(p : pack) : json {
    // resolve all CID links to json
  }  

  static connect(p : pack, ethers : any) : dapp {
    if (!ethers) {
      if (!_ethers) {
        _ethers = require('ethers');
      }
      ethers = _ethers;
    }

    const j = this.resolve(p);
    const d = {}; 
    // for object in pack, instantiate and connect
    //   d.o[objectname] = ethers.connect(...)
    return d;
  }
}
