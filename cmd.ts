const debug = require('debug')('dpack')
const fs = require('fs')

const cli = require('commander')
const repl = require('repl')

const dpack = require('./index')

const ethers = require('ethers')

let opts: any

cli.description('dpack')
cli.hook('preAction', () => {
  opts = cli.opts()
})
cli.showHelpAfterError()

cli.command('show <path>').action(async (path: string) => {
  const file = fs.readFileSync(path)
  const json = JSON.parse(file)
  console.log(JSON.stringify(json, null, 2))
  process.exit(0)
})

cli.command('resolve <path>').action(async (path: string) => {
  const dapp = await dpack.loadFromFile(path)
  console.log(JSON.stringify(dapp._raw, null, 2))
  process.exit(0)
})

cli.command('explore <path>')
  .option('--network <network>', 'hh network to connect to')
  .action(async (path: string, opts: any) => {
    const dapp = await dpack.Dapp.loadFromFile(path)
    console.log(`Loaded ${path}`)
    debug('opts', opts)

    if (opts.network) {
      const provider = ethers.getDefaultProvider(opts.network)
      dapp.useProvider(provider)
      console.log(`Using default provider for ${opts.network}`)
    }
    console.log('  Use dapp.useProvider(ethers.getDefaultProvider(networkName)) to switch networks')

    /*
  if (env.DEPLOYER_PRIVATE_KEY) {
    const wallet = new ethers.Wallet(env.DEPLOYER_PRIVATE_KEY)
    dapp.useSigner(wallet)
    console.log(`Using DEPLOYER_PRIVATE_KEY with address: ${wallet.address}`)
  }
*/
    console.log('  Use dapp.useSigner(new ethers.Wallet(hexPrivKey)) to switch signers')

    const r = repl.start(`(${path}) > `)
    r.context.dapp = dapp
    r.context.ethers = ethers
  })

cli.parseAsync(process.argv)

export {}
