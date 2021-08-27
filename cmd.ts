const debug = require('debug')('dpack')
const fs = require('fs');

const cli = require('commander');
const repl = require('repl');

const dpack = require('./index');
const { DPackDapp } = require('./src/dapp');

const ethers = require('ethers');

let env : any;
let opts : any;

cli.description('DPack');
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
  const json = await dpack.load(path);
  console.log(JSON.stringify(json, null, 2));
  process.exit(0);
});

cli.command('explore <path>').action(async (path: string) => {
  const dapp = await DPackDapp.loadFromFile(path);
//  dapp.useNetwork('ropsten');
//  dapp.useSigner(env.DEPLOYER_PRIVATE_KEY, dapp.provider)
  console.log(`Loaded ${path}`)
  console.log(`Use dapp.useNetwork(networkName) to pick a network`)
  console.log(`Use dapp.useSigner(hexPrivKey) to connect a signer`);

  const r = repl.start(`(${path}) > `);
  r.context.dapp = dapp;
});

cli.command('test2 <path>').action(async (path : string) => {
  const d = await DPackDapp.loadFromFile(path);
  d.useNetwork('ropsten');
  debug(d);
  process.exit(0);
});

cli.parseAsync(process.argv)
