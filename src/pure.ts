import { copy, need, omap } from './util'
import { typeinfo, objectinfo, dpack } from './dpack'
import * as schema from './schema'

export function assertValidPack (p: dpack): void {
  need(schema.isWellFormedPack(p),
    `dpack.assertValidPack(): pack fails schema validation: ${schema.isWellFormedPack.errors}`
  )
  need(p.format === 'dpack-1',
    `dpack.assertValidPack() - unrecognized 'format' field: ${p.format}`
  )
  omap(p.objects, (o) => { assertValidObject(o); return o })
  omap(p.types, (t) => { assertValidType(t); return t })
}

export function assertValidType (t: typeinfo): void {
  need(schema.isWellFormedResolvedType(t),
    `dpack.addType() - not well formed resolved type: ${t}`
  )
}

export function assertValidObject (o: objectinfo): void {
  need(schema.isWellFormedResolvedObject(o),
    `dpack.addType() - not well formed resolved object: ${o}`
  )
}

export function addType (pack: dpack, type: typeinfo): dpack {
  assertValidPack(pack)
  assertValidType(type)
  need(!(pack.types[type.typename]),
    `dpack.addType() - typename already exists: ${type.typename}`
  )
  const out = copy(pack)
  out.types[type.typename] = type
  assertValidPack(out)
  return out
}

export function addObject (pack: dpack, obj: any): dpack {
  assertValidPack(pack)
  assertValidObject(obj)
  need(!(pack.objects[obj.objectname]),
    `dpack.addObject() - objectname already exists: ${obj.objectname}`
  )
  const out = copy(pack)
  out.objects[obj.objectname] = obj
  assertValidPack(pack)
  return out
}

export function merge (...packs: dpack[]): dpack {
  const head = packs[0]
  const rest = packs.slice(1)
  packs.map((p) => {
    assertValidPack(p)
    need(p.format === head.format,
      'dpack.merge() - two packs have different \'format\' fields'
    )
    need(p.network === head.network,
      'dpack.merge() - two packs have different \'network\' fields'
    )
  })
  let out = copy(head)
  for (const pack of rest) {
    for (const tkey of Object.keys(pack.types)) {
      out = addType(out, pack.types[tkey])
    }
    for (const okey of Object.keys(pack.objects)) {
      out = addObject(out, pack.objects[okey])
    }
  }
  assertValidPack(out)
  return out
}

export function blank (): dpack {
  const pack = {
    format: 'dpack-1',
    network: '',
    types: {},
    objects: {}
  }
  assertValidPack(pack)
  return pack
}

/*
export function fromObject(obj : any) : dpack {
export function fromJsonString(s : any) : dpack
export function fromCidString(s : any) : dpack
export function toJsonString(p : dpack) : string
*/
