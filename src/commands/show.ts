import { Command, flags } from '@oclif/command'
import * as fs from 'fs-extra'

export default class Show extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({ char: 'h' }),
    format: flags.help({ char: 'f' })
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args } = this.parse(Show)

    if (args.file) {
      const json = await fs.readJson(args.file)
      this.log(JSON.stringify(json, null, 2))
    }
  }
}
