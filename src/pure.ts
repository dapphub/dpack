import { copy, need, omap } from './util'
import { Artifact, TypeInfo, ObjectInfo, Dpack, ResolvedPack } from './types'
import * as schema from './schema'
export { schema }

export function assertValidPack (p: Dpack): void {
  need(schema.isWellFormedPack(p),
    `dpack.assertValidPack(): pack fails schema validation: ${schema.isWellFormedPack.errors}`
  )
  need(p.format === 'dpack-1',
    `dpack.assertValidPack() - unrecognized 'format' field: ${p.format}`
  )
  omap(p.objects, (o) => { assertValidObject(o); return o })
  omap(p.types, (t) => { assertValidType(t); return t })
}

export function assertValidType (t: TypeInfo): void {
  need(schema.isWellFormedType(t),
    `dpack.addType() - not well formed type: ${t}`
  )
}

export function assertValidObject (o: ObjectInfo): void {
  need(schema.isWellFormedObject(o),
    `dpack.addType() - not well formed object: ${o}`
  )
}

export function assertValidArtifact (a: Artifact): void {
  need(schema.isWellFormedArtifact(a),
    `dpack.addType() - not well formed artifact: ${a}`
  )
}

export function assertValidResolvedPack (rp: ResolvedPack): void {
  need(schema.isWellFormedResolvedPack(rp),
    `dpack.addType() - not well formed resolved pack: ${rp}`
  )
  // for each type/object, assert bundle has artifact
  // for each artifact, assert is valid
}

export function addType (pack: Dpack, type: TypeInfo): Dpack {
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

export function addObject (pack: Dpack, obj: any): Dpack {
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

export function merge (...packs: Dpack[]): Dpack {
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

export function blank (): Dpack {
  const pack = {
    format: 'dpack-1',
    network: '',
    types: {},
    objects: {}
  }
  assertValidPack(pack)
  return pack
}

export async function resolve (pack: Dpack, ipfs: any = undefined): Promise<ResolvedPack> {
  async function _resolve (link): Promise<any> {
    need(link, 'panic: bad DAG-JSON link')
    need(link['/'], 'panic: bad DAG-JSON link')
    return await ipfs.getIpfsJson(link['/'])
  }
  assertValidPack(pack)
  const out = copy(pack)
  out._bundle = {}
  for (const key of Object.keys(this.types)) {
    out._bundle[key] = await _resolve(this.types[key].artifact)
  }
  for (const key of Object.keys(this.objects)) {
    out._bundle[key] = await _resolve(this.objects[key].artifact)
  }
  return await Promise.resolve(out)
}

export function fromObject (obj: any): Dpack {
  assertValidPack(obj)
  return obj as Dpack
}

/*
export function fromJsonString(s : any) : Dpack
export function fromCidString(s : any) : Dpack
export function toJsonString(p : Dpack) : string
*/
