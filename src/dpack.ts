import { libdpack, pack, typeinfo } from './api';

let _ethers; // lazy loaded if not injected

function copy(a : any) : any {
  return JSON.parse(JSON.stringify(a));
}

function need(b, s) {
  if (!b) throw new Error(s);
}

export static class dpack implements libdpack {
  static blank() : pack {
    return copy({
      format: 'dpack-1',
      network: '',
      objects: {},
      types: {}
    });
  }

  static addType(p : pack, n : string, t : typeinfo) : pack {
    need(t, `dpack.addType() - typeinfo argument is required`)
    need(t.artifact, `dpack.addType() - given typeinfo has not 'artifact' field`)
    need(!(p.types[n]), `dpack.addType() - typename already exists: ${n}`)

    const p2 = copy(p);
    p2.types[n] = t;
    this.assertValid(p2);

    return p2;
  }

  static addObject

  static merge(p1 : pack, p2 : pack) : pack {
    // for type and object in p2, add it to p1 (copy)
    // assert valid
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

    const j = this.resolve(pack);
    const d = {}; 
    // for object in pack, instantiate and connect
    //   d.o[objectname] = ethers.connect(...)
    return d;
  }
}
