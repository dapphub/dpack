const v8 = require('v8')

export function copy (a: any): any {
  return v8.deserialize(v8.serialize(a))
//  return JSON.parse(JSON.stringify(a))
}

export function need (b: any, s: string): void {
  if (!b) throw new Error(s)
}

export function omap (o: any, f: Function): any {
  const out = {}
  for (const [k, v] of Object.entries(o)) {
    out[k] = f(v)
  }
  return out
}
