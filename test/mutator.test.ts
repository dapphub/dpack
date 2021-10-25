import * as fs from 'fs-extra'
import { expect } from 'chai'
import { Mutator } from '../src/mutator'
import artifact from './mocks/artifact.json'

const debug = require('debug')('dpack')

describe('Mutator', () => {
  it('new instance', async () => {
    const json = { types: {}, objects: {} }
    const instance = new Mutator(json)
    expect(instance.init).to.deep.equal(json)
    expect(instance.pack).to.deep.equal(json)
  })

  it('addType', async () => {
    const json = { types: {}, objects: {} }
    const instance = new Mutator(json)
    const cid = await instance.addType(artifact)

    const types = instance.pack.types
    expect(Object.keys(types).length).to.equal(1)
    expect(types.MockContract.artifacts['/']).to.equal(cid)
  })

  it('addObject', async () => {
    const json = { types: {}, objects: {} }
    const instance = new Mutator(json)
    const typename = 'mock'
    const address = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
    const network = 'ropsten'
    await instance.addObject(typename, address, network, artifact)

    const objs = instance.pack.objects
    expect(Object.keys(objs).length).to.equal(1)
    expect(objs.mock.typename).to.equal('MockContract')
    expect(objs.mock.addresses[network]).to.equal(address)
  })
})
