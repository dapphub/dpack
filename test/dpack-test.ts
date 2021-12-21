const debug = require('debug')('dpack:test')
const want = require('chai').expect
const { dpack } = require('../src/dpack');
const { PackBuilder } = require('../src/builder');

describe('PackBuilder', ()=>{
  it('blank', async ()=>{
    const pb = new PackBuilder('testenv');
    const p = await pb.pack();
    want(p.format).exists;
    want(p.network).exists;
    want(p.objects).exists;
    want(p.types).exists;
  });

  it('addType valid', async ()=>{
    const pb = new PackBuilder('testenv');
    pb.addType({
      typename: "GemFab",
      artifact: {abi:{}}
    });
    const p = await pb.pack();
    debug(JSON.stringify(p, null, 2))
  })
});
