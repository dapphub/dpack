const want = require('chai').expect
const { dpack } = require('../src/dpack');

describe('libdpack', ()=>{
  it('blank', ()=>{
    console.log(dpack);
    const p = dpack.blank();
    want(p.format).exists;
    want(p.network).exists;
    want(p.objects).exists;
    want(p.types).exists;
  });

  it('addType valid', ()=>{
    const p = dpack.blank();
    const p2 = dpack.addType(p, "Feedbase", {
      artifact: {}
    });
  })
});
