import { Dapp } from './src/dapp'

export { getIpfsJson } from './src/ipfs-util'
export * from './src/mutator'

export const loadFromFile = Dapp.loadFromFile
export const loadFromJson = Dapp.loadFromJson
export const loadFromCid = Dapp.loadFromCid

export { Dapp }
