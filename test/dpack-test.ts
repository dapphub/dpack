const want = require('chai').expect
const { dpack } = require('../src/dpack');

describe('libdpack', ()=>{
  it('blank', ()=>{
    const p = new dpack();
    want(p.format).exists;
    want(p.network).exists;
    want(p.objects).exists;
    want(p.types).exists;
  });

  it('addType valid', ()=>{
    const p = new dpack();
    p.addType("GemFab", {
      artifact: {}
    });
  })
});
