function copy(a : any) : any {
  return JSON.parse(JSON.stringify(a));
}

function need(b, s) {
  if (!b) throw new Error(s);
}

export class dpack {
  format : string
  network : string
  types : any
  objects : any
  _bundle: any

  constructor(p) {
    Object.assign(this, p);
    this.assertValid();
  }

  assertValid() {
  }
}


