import { copy, need, omap } from './util'
import { typeinfo, objectinfo, dpack } from './dpack'

export function assertValidPack(p : dpack) {
  need(p.format == 'dpack-1', `dpack.assertValidPack() - unrecognized 'format' field: ${p.format}`);
  need(p.network, `dpack.assertValidPack() - 'network' field must be defined: ${p.network}`);
  need(p.objects, `dpack.assertValidPack() - missing 'objects' field`);
  need(p.types, `dpack.assertValidPack() - missing 'types' field`);
  omap(p.objects, (o)=>{ assertValidObject(o); return o})
  omap(p.types, (t)=>{ assertValidType(t); return t})
}

export function assertValidType(t : typeinfo) {
  need(t.typename, `dpack.addType() - given typeinfo has no 'typename', field`)
  need(t.artifact, `dpack.addType() - given typeinfo has no 'artifact' field`)
  need(t.artifact.abi, `dpack.addType(): given typeinfo.artifact is missing 'abi' field`);
}

export function assertValidObject(o : objectinfo) {
  need(o.objectname, `dpack.assertValidObject() - object info is missing objectname: ${o}`)
  need(o.typename, `dpack.assertValidObject() - object info is missing typename: ${o}`)
  need(o.address, `dpack.assertValidObject() - object info is missing address: ${o}`)
  need(o.artifact, `dpack.assertValidObject() - object info is missing artifact: ${o}`)
}

export function addType(pack: dpack, type: typeinfo) : dpack {
  assertValidPack(pack);
  assertValidType(type);
  need(!(pack.types[type.typename]), `dpack.addType() - typename already exists: ${type.typename}`)
  const out = copy(pack);
  out.types[type.typename] = type;
  assertValidPack(out);
  return out
}

export function addObject(pack: dpack, obj : any) : dpack {
  assertValidPack(pack);
  assertValidObject(obj);
  need(!(pack.objects[obj.objectname]), `dpack.addObject() - objectname already exists: ${obj.objectname}`)
  const out = copy(pack);
  out.objects[obj.objectname] = obj;
  assertValidPack(pack);
  return out;
}

/*
export function fromObject(obj : any) : dpack {
export function fromJsonString(s : any) : dpack
export function fromCidString(s : any) : dpack
export function toJsonString(p : dpack) : string
*/
