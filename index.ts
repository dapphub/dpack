const { getIpfsJson } = require('./src/ipfs-util');
const { Dapp } = require('./src/dapp')
const { mutate } = require('./src/mutator')

async function load(path : string) {
  return await Dapp.loadFromFile(path);
}

export { Dapp, load, mutate }
