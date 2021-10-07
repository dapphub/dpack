const debug = require('debug')('dpack')

const IPFS = require('ipfs-http-client')
const node = IPFS.create()

export async function getIpfsJson (hash: string) {
  debug(`get ${hash}`)
  const blob = await node.cat(hash)
  let s = ''
  for await (const chunk of blob) {
    s += chunk
  }
  const json = JSON.parse(s)
  return json
}

export async function putIpfsJson (obj: any): Promise<string> {
  const str = JSON.stringify(obj)
  const { cid } = await node.add(str)
  debug(`put ${cid}`)
  return cid
}
