import { libdpack, pack, typeinfo, objectinfo, dapp, json } from './api';

function copy(a : any) : any {
  return JSON.parse(JSON.stringify(a));
}

function need(b, s) {
  if (!b) throw new Error(s);
}

export class dpack {
  readonly format : string
  readonly network : string
  readonly types : any
  readonly objects : any
  readonly _bundle: any
}


