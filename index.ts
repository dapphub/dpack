export { getIpfsJson } from './src/ipfs-util'
export * from './src/mutator'

import { Dapp } from './src/dapp'

export const loadFromFile = Dapp.loadFromFile;
export const loadFromJson = Dapp.loadFromJson;
export const loadFromCid = Dapp.loadFromCid;

export { Dapp }
