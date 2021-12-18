import { libdpack, pack, typeinfo, objectinfo, dapp, json } from './api';
import { dpack } from './dpack'

function need(b, s) {
  if (!b) throw new Error(s);
}

function copy(a : any) : any {
  return JSON.parse(JSON.stringify(a));
}


export class PackBuilder { //implements libdpack {
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

  pack() : pack {
    return copy({
      'format': 'dpack-1',
      'network': this.network,
      'types': this.types,
      'objects': this.objects
    })
  }

}
