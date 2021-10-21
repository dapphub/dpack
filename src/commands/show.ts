import { Command, flags } from '@oclif/command'
import * as fs from 'fs'
export default class Show extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(Show)

    if (args.file) {
      const file = fs.readFileSync(args.file)
      const json = JSON.parse(file)
      this.log(JSON.stringify(json, null, 2))
    }
  }
}
