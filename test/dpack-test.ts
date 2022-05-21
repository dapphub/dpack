import { builder, load } from "../index"
import { Dapp } from '../src/dapp';
import { PackBuilder } from '../src/builder';
import { putIpfsJson } from "../src/ipfs-util"
import * as pure from '../src/pure'

const debug = require('debug')('dpack:test')
const fs = require('fs')
const samplepack= JSON.parse(fs.readFileSync('test/sample-pack.json'))
const path = require('path');
const want = require('chai').expect
const ethers = require('ethers')

let signer
before(async () => {
  signer = ethers.Wallet.createRandom()
})

describe('end to end simple example', ()=>{
  const packPath = path.join(__dirname, './data/weth_ropsten.dpack.json')
  const jamsPath = path.join(__dirname, './data/weth_ropsten.dpack.jams')
  let cidStr

  it('create weth pack', async () => {
    const contractAddress = '0xc778417E063141139Fce010982780140Aa0cD5Ab'
    const artifact = require('./data/weth-ropsten-artifact.json')

    // After compiling and deploying a contract we have the contract.address and json artifact containing the ABI and
    // bytecode. These are used to create a pack:
    const pb = new builder('ropsten');
    await pb.packObject({
      objectname: 'weth',
      address: contractAddress,
      typename: 'WETH9',
      artifact: artifact
    }, true)

    await pb.packObject({
      objectname: 'weth9',
      address: contractAddress,
      typename: 'WETH9',
      artifact: artifact
    }, false)

    const pack = await pb.build();

    // The pack can then be saved as a json file, or added to IPFS to be shared as a single CID for the whole protocol:
    fs.writeFileSync(packPath, JSON.stringify(pack, null, 2));
    cidStr = (await putIpfsJson(pack)).toString()
  })

  it('use weth pack', async () => {
    const jsonObj = require('./data/weth_ropsten.dpack.json')

    // Loading a pack gives ethers contracts allowing users to interact with them or deploy them on
    // another network. Packs can be loaded from a CID string, a file path string, or a json object.
    const dappFromPack = await load(jsonObj, ethers, signer)
    const dappFromPath = await load(packPath, ethers, signer)
    const dappFromJams = await load(jamsPath, ethers, signer)
    const dappFromCID  = await load(cidStr, ethers, signer)

    // All methods give the same pack
    let packStrings = [JSON.stringify(dappFromPack), JSON.stringify(dappFromPath), JSON.stringify(dappFromJams), JSON.stringify(dappFromCID)];
    want((new Set(packStrings)).size).to.equal(1)
  })
});

describe('pure api', async ()=>{
  it('blank', async ()=>{
    const p = pure.blank('testnet');
    want(p.format).exists;
    want(p.network).exists;
    want(p.objects).exists;
    want(p.types).exists;
  })
/* this hangs the test suite for some reason. was just checking the v0 warning gets printed
  it('sample pack', async ()=>{
    const pack = await load(samplepack)
    want(pure.schema.isWellFormedPack(pack)).true
  })
  */
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

    want(dapp._objects).exists
    want(dapp._objects.weth).exists
    want(dapp._objects.weth.deposit).exists
    want(dapp.weth).exists
    want(dapp.weth.deposit).exists

    want(dapp._types).exists
    want(dapp._types.WETH9).exists
    want(dapp._types.WETH9.deploy).exists
  })
});
