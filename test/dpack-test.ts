const want = require('chai').expect
const { dpack } = require('../src/dpack');

describe('libdpack', ()=>{
  it('blank', ()=>{
    console.log(dpack);
    const dp = dpack.blank();
    want(dp.format).exists;
    want(dp.network).exists;
    want(dp.objects).exists;
    want(dp.types).exists;
  });
});
