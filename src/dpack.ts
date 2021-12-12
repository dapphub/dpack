import { libdpack, pack } from './api';

function copy(a : any) : any {
  return JSON.parse(JSON.stringify(a));
}

export static class dpack implements libdpack {
  ethers : any;
  static blank() : pack {
    return copy({
      format: 'dpack-1',
      network: '',
      objects: {},
      types: {}
    });
  }
}
