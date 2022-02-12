import { PackBuilder } from './src/builder'
import { Dapp } from './src/dapp'
import { getIpfsJson, putIpfsJson } from './src/ipfs-util'

export const load = (arg, ethers=undefined) => {
    // if arg is a string
    //   if arg is a cid, load json from ipfs
    //   if arg is a path, load json from path
    // else arg must be object
    // return Dapp.loadFromJson
}
export const builder = (network) => new PackBuilder(network)

export { PackBuilder, Dapp, getIpfsJson, putIpfsJson }