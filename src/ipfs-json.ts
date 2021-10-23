const debug = require('debug')('dpack')

import * as IPFS from 'ipfs-http-client'

export class IpfsJson {
  client: IPFS.IPFSHTTPClient

  constructor() {
    this.client = IPFS.create()
  }

  async put(obj: any, pin = false): Promise<IPFS.CID> {
    const str = JSON.stringify(obj)
    const { cid } = await this.client.add(str, { pin })
    debug(`IpfsJson::put => ${cid}`)
    return cid
  }

  async get(cid: IPFS.CID): Promise<any> {
    debug(`IpfsJson::get(${cid})`)

    const blob = this.client.cat(cid)
    let s = ''
    for await (const chunk of blob) {
      s += chunk
    }
    debug('IpfsJson::client.cat => ', s)
    return JSON.parse(s)
  }

  async pin(cid: IPFS.CID): Promise<IPFS.CID> {
    debug(`IpfsJson::pin(${cid})`)
    return this.client.pin.add(cid)
  }
}
