import { readFileSync } from 'fs'
import { jams } from 'jams.js'
import { PackBuilder } from './src/builder'
import { Dapp } from './src/dapp'
import { getIpfsJson, putIpfsJson, isCid } from './src/ipfs-util'
import { need } from './src/util'

export const load = async (arg, _ethers = undefined, _signer = undefined) => {
  if (typeof arg === "string") {
    if (isCid(arg)) {
      arg = getIpfsJson(arg)
    } else if (arg.split(".").pop() === "jams") {
      arg = jams(readFileSync(arg))
    } else {
      arg = require(arg)
    }
  }
  need(typeof arg === 'object' && Object.keys(arg).length, 'Could not find a pack from provided source.')
  return await Dapp.loadFromPack(arg, _ethers, _signer)
}
export const builder = (network) => new PackBuilder(network)

export { PackBuilder, Dapp, getIpfsJson, putIpfsJson }
