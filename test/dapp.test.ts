const debug = require('debug')('dpack')
const want = require('chai').expect

import * as fs from 'fs-extra'
import * as ethers from 'ethers'

import { Dapp } from '../src/dapp'
import { IpfsJson } from '../src/ipfs-json'

describe('Dapp', () => {
  it('load from file', async () => {
    const ipfs = new IpfsJson()
    const json = fs.readJSON('test/sample-pack.json')
    debug(json)
    const cid = await ipfs.put(json)
    debug(cid)
    const dapp = await Dapp.loadFromFile('test/sample-pack.json')
    debug('dapp loaded')
    const provider = ethers.getDefaultProvider('ropsten')
    dapp.useProvider(provider)
    debug('provider added')
  })
})
