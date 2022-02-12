import { PackBuilder } from './src/builder'
import { Dapp } from './src/dapp'
import { getIpfsJson, putIpfsJson } from './src/ipfs-util'

export const load = (...args) => {
//Dapp.loadFromJson
}
export const builder = (network) => new PackBuilder(network)

export { PackBuilder, Dapp, getIpfsJson, putIpfsJson }