const debug = require('debug')('dpack')
const want = require('chai').expect

const { DPackDapp } = require("../src/dapp")

describe('DPackDapp', () => {
  it('test', async () => {
    const dapp = await DPackDapp.loadFromFile('test/sample-pack.json');
    dapp.useNetwork('ropsten')
    const coin = await dapp.objects.mockToken;
    const mockTokenSupply = await dapp.objects.mockToken.callStatic.totalSupply();
    want(mockTokenSupply.gt(0)).true;
  });
});
