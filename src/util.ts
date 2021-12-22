export function copy(a : any) : any {
  return JSON.parse(JSON.stringify(a));
}

export function need(b, s) {
  if (!b) throw new Error(s);
}

export function omap(o : any, f : Function) {
  for (const [k,v] of Object.entries(o)) {
    o[k] = f(v);
  }
}
