const debug = require('debug')('dpack')
const want = require('chai').expect

const { ethers } = require('hardhat')

const { Dapp } = require("../index")

describe('Dapp', () => {
  it('load from file', async () => {
    const dapp = await Dapp.loadFromFile('test/sample-pack.json');
    const provider = ethers.getDefaultProvider('ropsten')
    dapp.useProvider(provider)
    const coin = await dapp.objects.mockToken;
    const mockTokenSupply = await dapp.objects.mockToken.callStatic.totalSupply();
    want(mockTokenSupply.gt(0)).true;
  });
});
