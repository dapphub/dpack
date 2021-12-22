export function copy(a : any) : any {
  return JSON.parse(JSON.stringify(a));
}

export function need(b, s) {
  if (!b) throw new Error(s);
}

export function omap(o : any, f : Function) {
  const out = {};
  for (const [k,v] of Object.entries(o)) {
    out[k] = f(v);
  }
  return out;
}
