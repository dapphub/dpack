const debug = require('debug')('dpack:test')
const want = require('chai').expect
const fs = require('fs')

import { PackBuilder } from '../src/builder';
import { Dapp } from '../src/dapp';
import * as dpack from '../src/pure'

const fbpack = JSON.parse(fs.readFileSync('test/sample-pack.json'))

describe('pure api', ()=>{
  it('blank', ()=>{
    const p = dpack.blank('testnet');
    want(p.format).exists;
    want(p.network).exists;
    want(p.objects).exists;
    want(p.types).exists;
  })

  it('sample pack', ()=>{
    const pack = dpack.fromObject(fbpack);
    want(dpack.schema.isWellFormedPack(pack)).true
  })
});

describe('PackBuilder', ()=>{
  it('blank', async ()=>{
    const pb = new PackBuilder('testnet');
    const p = pb.build();
    want(p.format).exists;
    want(p.network).exists;
    want(p.objects).exists;
    want(p.types).exists;
  });

  it('addType valid', async ()=>{
    const pb = new PackBuilder('testnet');
    pb.addType({
      typename: "GemFab",
      artifact: {abi:{}}
    });
    const p = pb.build();
    debug(JSON.stringify(p, null, 2))
  })
});

describe('Dapp', ()=>{
  it('Dapp loadFromPack sample-pack', async () => {
    const pack = require('./data/weth_ropsten.dpack.json')
    const dapp = await Dapp.loadFromPack(pack);
    debug(Object.keys(dapp));
    want(dapp._types).exists
    want(dapp._types.WETH9).exists
    want(dapp._objects).exists
    want(dapp._objects.weth).exists

    want(dapp._objects.weth.deposit).exists
    want(dapp._types.WETH9.deploy).exists
  })
});
