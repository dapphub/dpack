const debug = require('debug')('dpack')
const want = require('chai').expect

const { putIpfsJson, getIpfsJson, pinIpfsCid, isCid, isV0CID } = require('../src/ipfs-util')

describe('ipfs utils', ()=>{
  it('put get pin isCID', async ()=>{
    const obj = { 'key': 'val' }
    const cid = await putIpfsJson(obj);
    debug(cid);
    const iscid = isCid(cid)
    want(iscid).true
    debug(Object.keys(cid))
    const obj2 = await getIpfsJson(cid);
    want(obj2['key']).equal('val')
    await pinIpfsCid(cid);
    want(isV0CID('QmdWjNEruJgzuSTbqPHF9rdo99wTY7KmHe6KbtfS67fXaH')).true
  });
});
