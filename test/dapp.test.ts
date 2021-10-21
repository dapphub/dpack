const debug = require('debug')('dpack')
const want = require('chai').expect

const fs = require('fs')

const ethers = require('ethers')

const { Dapp } = require('../index')
const { putIpfsJson } = require('../src/ipfs-util')

describe('Dapp', () => {
  it('load from file', async () => {
    const json = JSON.parse(fs.readFileSync('test/sample-pack.json'))
    debug(json)
    const cid = await putIpfsJson(json);
    debug(cid)
    const dapp = await Dapp.loadFromFile('test/sample-pack.json')
    debug('dapp loaded')
    const provider = ethers.getDefaultProvider('ropsten')
    dapp.useProvider(provider)
    debug('provider added')
  })
})
