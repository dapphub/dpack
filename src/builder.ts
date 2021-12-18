import { dpack } from './dpack'

function need(b, s) {
  if (!b) throw new Error(s);
}

function copy(a : any) : any {
  return JSON.parse(JSON.stringify(a));
}

export class PackBuilder {
  _pack : dpack = new dpack({
    format: 'dpack-1',
    network: '',
    types: {},
    objects: {}
  })

  addType(t : any) {
    need(t.typename, `dpack.addType() - given typeinfo has no 'typename', field`)
    need(t.artifact, `dpack.addType() - given typeinfo has no 'artifact' field`)
    need(!(this._pack.types[t.typename]), `dpack.addType() - typename already exists: ${t.typename}`)

    this._pack.types[t.typename] = t;
    this._pack.assertValid();
  }

  addObject(o : any) {
    need(o.objectname, `dpack.addObject() - object info is missing objectname`)
    need(o.typename, `dpack.addObject() - object info is missing typename`)
    need(o.address, `dpack.addObject() - object info is missing address`)
    need(o.artifact, `dpack.addObject() - object info is missing artifact`)

    this._pack.objects[o.objectname] = o;
    this._pack.assertValid();
  }

  merge(p2 : dpack) {
    need(this._pack.format == p2.format, `dpack.merge(): argment packs have different 'format' fields`)
    need(this._pack.network == p2.network, `dpack.merge(): argment packs have different 'network' fields`)
    for (const tkey of Object.keys(p2.types)) {
      this.addType(p2.types[tkey]);
    }
    for (const okey of Object.keys(p2.objects)) {
      this.addObject(p2.objects[okey]);
    }
    this._pack.assertValid();
  }

  pack() : dpack {
    return copy(this._pack);
  }

}
