const debug = require('debug')('dpack')
const want = require('chai').expect

const { putIpfsJson, getIpfsJson } = require('../src/ipfs-util')

describe('ipfs utils', ()=>{
  it('put get', async ()=>{
    const obj = { 'key': 'val' }
    const cid = await putIpfsJson(obj);
    debug(cid);
    const obj2 = await getIpfsJson(cid);
    want(obj2['key']).equal('val')
  });
});
