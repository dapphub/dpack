type pack = any;
type typeinfo = any;
type objectinfo = any;
type dapp = any;
type json = any;

interface libdpack {
  blank() : pack;
  addType(p : pack, n : string, t : typeinfo) : pack;
  addObject(p : pack, n : string, o : objectinfo) : pack;
  merge(p1 : pack, p2 : pack) : pack;

  assertValid(p : pack); // throws InvalidPackError

  resolve(p : pack) : json;
  connect(p : pack) : dapp;
}

export {
  pack, typeinfo, objectinfo, dapp, json,
  libdpack
}
