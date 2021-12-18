import { libdpack, pack, typeinfo, objectinfo, dapp, json } from './api';

>>>>>>> 8a80985de3cdb127925a37e2bfc0663581d934e6
function copy(a : any) : any {
  return JSON.parse(JSON.stringify(a));
}

function need(b, s) {
  if (!b) throw new Error(s);
}

export class dpack { //implements libdpack {
  format : string = 'dpack-1'
  network : string = ''
  types : any = {}
  objects : any = {}

  addType(n : string, t : typeinfo) {
    need(t.artifact, `dpack.addType() - given typeinfo has no 'artifact' field`)
    need(!(this.types[n]), `dpack.addType() - typename already exists: ${n}`)

    this.types[n] = t;
    this.assertValid();
  }

  addObject(n : string, o : objectinfo) {
    need(o.typename, `dpack.addObject() - object info is missing typename`)
    need(o.address, `dpack.addObject() - object info is missing address`)
    need(o.artifact, `dpack.addObject() - object info is missing artifact`)

    this.objects[n] = o;
    this.assertValid();
  }

  merge(p2 : dpack) {
    need(this.format == p2.format, `dpack.merge(): argment packs have different 'format' fields`)
    need(this.network == p2.network, `dpack.merge(): argment packs have different 'network' fields`)
    this.assertValid();
    p2.assertValid();
    for (const tkey of Object.keys(p2.types)) {
      this.addType(tkey, p2.types[tkey]);
    }
    for (const okey of Object.keys(p2.objects)) {
      this.addObject(okey, p2.objects[okey]);
    }
    this.assertValid();
  }

  assertValid() {
  }

  resolve() : json {
    // resolve all CID links to json
  }  

  // See ethers.js 'signer or provider' ontology
  connect(p : pack, signerOrProvider : any) : dapp {
    const j = this.resolve();
    const d = {}; 
    // for object in pack, instantiate and connect
    //   d.o[objectname] = ethers.connect(...)
    return d;
  }
}
