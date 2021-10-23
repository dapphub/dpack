import { Dapp } from './src/dapp'

export * from './src/ipfs-json'
export * from './src/mutator'

export const loadFromFile = Dapp.loadFromFile
export const loadFromJson = Dapp.loadFromJson
export const loadFromCid = Dapp.loadFromCid

export { Dapp }
