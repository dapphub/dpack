import { expect } from '@oclif/test'
import { IpfsJson } from '../src/ipfs-json'

const debug = require('debug')('dpack')
const want = require('chai').expect

describe('ipfs utils', () => {
  it('new IpfsJson instance', async () => {
    const ipfs = new IpfsJson()
    expect(ipfs.constructor.name).to.equal('IpfsJson')
  })

  it('IpfsJson put', async () => {
    const ipfs = new IpfsJson()
    const obj = { key: 'val' }
    const cid = await ipfs.put(obj)
    const blob = ipfs.client.cat(cid)

    let s = ''
    for await (const chunk of blob) {
      s += chunk
    }

    expect(cid.constructor.name).to.equal('CID')
    expect(JSON.parse(s)).to.deep.equal(obj)
  })

  it('IpfsJson get', async () => {
    const ipfs = new IpfsJson()
    const obj = { key: 'val' }
    const cid = await ipfs.put(obj)
    const res = await ipfs.get(cid)
    expect(res).to.deep.equal(obj)
  })

  it('IpfsJson pin', async () => {
    const ipfs = new IpfsJson()
    const obj = { key: 'val' }
    const cid = await ipfs.put(obj)
    let pins = []

    for await (const pin of ipfs.client.pin.ls()) {
      pins.push(pin.cid.toString())
    }
    // TODO: reset ipfs to fresh state
    // expect(pins).to.not.include(cid.toString())

    await ipfs.pin(cid)

    pins = []
    for await (const pin of ipfs.client.pin.ls()) {
      pins.push(pin.cid.toString())
    }
    expect(pins).to.include(cid.toString())
  })
})
