import { Dapp } from './src/dapp'

export { getIpfsJson, putIpfsJson } from './src/ipfs-util'

export const loadFromFile = Dapp.loadFromFile
export const loadFromJson = Dapp.loadFromJson
export const loadFromCid = Dapp.loadFromCid

export { Dapp }
