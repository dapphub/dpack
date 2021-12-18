const debug = require('debug')('dpack:test')
const want = require('chai').expect
const { dpack } = require('../src/dpack');
const { PackBuilder } = require('../src/builder');

describe('PackBuilder', ()=>{
  it('blank', ()=>{
    const pb = new PackBuilder();
    const p = pb.pack();
    want(p.format).exists;
    want(p.network).exists;
    want(p.objects).exists;
    want(p.types).exists;
  });

  it('addType valid', ()=>{
    const pb = new PackBuilder();
    pb.addType({
      typename: "GemFab",
      artifact: {}
    });
    const p = pb.pack();
    debug(p)
  })
});
