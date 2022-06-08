import { readFileSync } from 'fs'
import { PackBuilder } from './src/builder'
import { Dapp } from './src/dapp'
import { getIpfsJson, putIpfsJson, isCid } from './src/ipfs-util'
import { need } from './src/util'
const es6loader = require('./es6loader')

export const load = async (arg, _ethers = undefined, _signer = undefined) => {
  if (typeof arg === 'string') {
    if (isCid(arg)) {
      arg = await getIpfsJson(arg)
    } else if (arg.split('.').pop() === 'jams') {
      const jams = await es6loader.loadModule('jams.js', 'jams')
      arg = jams(readFileSync(arg, { encoding: 'utf8' }))
    } else {
      arg = require(arg)
    }
  }
  need(typeof arg === 'object' && Object.keys(arg).length, 'Could not find a pack from provided source.')
  return await Dapp.loadFromPack(arg, _ethers, _signer)
}

export const builder = (network) => new PackBuilder(network)

export { PackBuilder, Dapp, getIpfsJson, putIpfsJson }
