import { copy, need, omap } from './util'
import { Artifact, TypeInfo, ObjectInfo, DPack, ResolvedPack } from './types'
import * as schema from './schema'
export { schema }

export function assertValidPack (p: DPack): void {
  need(schema.isWellFormedPack(p),
    `dpack.assertValidPack(): pack fails schema validation: ${schema.isWellFormedPack.errors}`
  )
  need(p.network != '', 'dpack.assertValidPack() - \'network\' field cannot be empty')
  need(p.format === 'dpack-1',
    `dpack.assertValidPack() - unrecognized 'format' field: ${p.format}`
  )
  omap(p.objects, (o) => { assertValidObject(o); return o })
  omap(p.types, (t) => { assertValidType(t); return t })
}

export function assertValidType (t: TypeInfo): void {
  need(schema.isWellFormedType(t),
    `dpack.assertValidType() - not well formed type: ${t}`
  )
}

export function assertValidObject (o: ObjectInfo): void {
  need(schema.isWellFormedObject(o),
    `dpack.assertValidObject() - not well formed object: ${o}`
  )
}

export function assertValidArtifact (a: Artifact): void {
  need(schema.isWellFormedArtifact(a),
    `dpack.assertValidArtifact() - not well formed artifact: ${a}`
  )
}

export function addType (pack: DPack, type: TypeInfo): DPack {
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

export function addObject (pack: DPack, obj: any): DPack {
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

export function merge (...packs: DPack[]): DPack {
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

export function blank (network: string): DPack {
  const pack = {
    format: 'dpack-1',
    network: network,
    types: {},
    objects: {}
  }
  assertValidPack(pack)
  return pack
}

export async function resolve (pack: DPack, ipfs: any = undefined): Promise<ResolvedPack> {
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

export function fromObject (obj: any): DPack {
  assertValidPack(obj)
  return obj as DPack
}
