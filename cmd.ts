const debug = require('debug')('dpack')
const fs = require('fs');

const cli = require('commander');
const repl = require('repl');

const dpack = require('./index');

const ethers = require('ethers');

let env : any;
let opts : any;

cli.description('dpack');
cli.option('--env <path>', 'override env file path');
cli.hook('preAction', () => {
  opts = cli.opts();
  if (opts.env) {
    env = require('dotenv').config({ path: opts.env }).parsed;
  } else {
    env = require('dotenv').config().parsed;
  }
  if (!env) {
    console.log('No .env file in working dir, and no override provided.');
    process.exit(1);
  }
});
cli.showHelpAfterError();

cli.command('show <path>').action(async (path: string) => {
  const file = fs.readFileSync(path);
  const json = JSON.parse(file);
  console.log(JSON.stringify(json, null, 2));
  process.exit(0);
});

cli.command('resolve <path>').action(async (path: string) => {
  const dapp = await dpack.load(path);
  console.log(JSON.stringify(dapp._raw, null, 2));
  process.exit(0);
});

cli.command('explore <path>').action(async (path: string) => {
  const dapp = await dpack.Dapp.loadFromFile(path);
  console.log(`Loaded ${path}`)

  if (env.NETWORK) {
    const provider = ethers.getDefaultProvider(env.NETWORK);
    dapp.useProvider(provider)
    console.log(`Using default provider for ${env.NETWORK}`)
  }
  console.log(`  Use dapp.useProvider(ethers.getDefaultProvider(networkName)) to switch networks`)

  if (env.DEPLOYER_PRIVATE_KEY) {
    const wallet = new ethers.Wallet(env.DEPLOYER_PRIVATE_KEY);
    dapp.useSigner(wallet);
    console.log(`Using DEPLOYER_PRIVATE_KEY with address: ${wallet.address}`);
  }
  console.log(`  Use dapp.useSigner(new ethers.Wallet(hexPrivKey)) to switch signers`);

  const r = repl.start(`(${path}) > `);
  r.context.dapp = dapp;
  r.context.ethers = ethers;
});

cli.parseAsync(process.argv)
