import { Command, flags } from '@oclif/command'
import * as repl from 'repl'
import { ethers } from 'ethers'
import { Dapp } from '../dapp'

export default class Explore extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --network=VALUE)
    network: flags.string({ char: 'n', description: 'network to connect to' }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Explore)

    // TODO: check env and set a default network
    const network = flags.network

    if (args.file) {
      const dapp = await Dapp.loadFromFile(args.file)
      this.log(`Loaded ${args.file}`)

      if (network) {
        const provider = ethers.getDefaultProvider(network)
        dapp.useProvider(provider)
        this.log(`Using default provider for ${network}`)
      }
      this.log('  Use dapp.useProvider(ethers.getDefaultProvider(networkName)) to switch networks')

      /*
      if (env.DEPLOYER_PRIVATE_KEY) {
        const wallet = new ethers.Wallet(env.DEPLOYER_PRIVATE_KEY)
        dapp.useSigner(wallet)
        console.log(`Using DEPLOYER_PRIVATE_KEY with address: ${wallet.address}`)
      }
    */
      this.log('  Use dapp.useSigner(new ethers.Wallet(hexPrivKey)) to switch signers')

      const r = repl.start(`(${args.file}) > `)
      r.context.dapp = dapp
      r.context.ethers = ethers
    }
  }
}
