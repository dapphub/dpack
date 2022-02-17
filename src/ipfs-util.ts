const debug = require('debug')('dpack')

const IPFS = require('ipfs-http-client')
const nodeAddress = process.env["IPFS_NODE_ADDRESS"] ?? '/ip4/127.0.0.1/tcp/5001'
debug(`starting node ${nodeAddress}`)
const node = IPFS.create(nodeAddress)
debug('started node')

export async function getIpfsJson (cid: string): Promise<any> {
  debug(`get ${cid}`)
  const blob = await node.cat(cid)
  let s = ''
  for await (const chunk of blob) {
    s += chunk
  }
  return JSON.parse(s)
}

export async function putIpfsJson (obj: any, pin: boolean = false): Promise<string> {
  const str = JSON.stringify(obj)
  debug(`adding ${str}`)
  const { cid } = await node.add(str)
  debug(`added ${str}`)
  if (pin) {
    await pinIpfsCid(cid)
  }
  debug(`put ${cid}`)
  return cid
}

export async function pinIpfsCid (cid: string): Promise<void> {
  await node.pin.add(cid)
  console.log(`pinned ${cid}`)
}

export function isCid (cidStr: string): boolean {
  try {
    IPFS.CID.parse(cidStr)
    return true
  } catch {
    return false
  }
}
