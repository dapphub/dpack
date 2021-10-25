import { Dapp } from './dapp'
export { run } from '@oclif/command'
export * from './ipfs-json'
export * from './mutator'

export const loadFromFile = Dapp.loadFromFile
export const loadFromJson = Dapp.loadFromJson
export const loadFromCid = Dapp.loadFromCid

export { Dapp }
