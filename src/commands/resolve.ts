import { Command, flags } from '@oclif/command'
import { Dapp } from '../dapp'

export default class Resolve extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' })
  }

  static args = [{ name: 'file' }]

  async run () {
    const { args, flags } = this.parse(Resolve)

    if (args.file) {
      const dapp = await Dapp.loadFromFile(args.file)
      this.log(JSON.stringify(dapp._raw, null, 2))
    }
  }
}
