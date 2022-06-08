const debug = require('debug')('dpack')

const IPFS = require('ipfs-http-client')

let nodeAddress = '/ip4/127.0.0.1/tcp/5001'
try {
  nodeAddress = process.env["IPFS_RPC_URL"] ?? '/ip4/127.0.0.1/tcp/5001'
} catch {}
debug(`starting node ${nodeAddress}`)
const node = IPFS.create(nodeAddress)
debug('started node')

export async function getIpfsJson (cid: string): Promise<any> {
  if (isV0CID(cid)) {
    console.log(`
WARN: Detected a V0 CID string. This warning will become an error very soon.
Please repack the pack containing ${cid}
`)
  }
  const blob = await node.cat(cid)
  let s = ''
  const utf8decoder = new TextDecoder()
  for await (const chunk of blob) {
    s += utf8decoder.decode(chunk)
  }
  return JSON.parse(s)
}

export async function putIpfsJson (obj: any, pin: boolean = false): Promise<string> {
  const str = JSON.stringify(obj)
  debug(`adding ${str}`)
  const { cid } = await node.add(str, { cidVersion: 1, pin: pin })
  debug(`added ${str}`)
  debug(`put ${cid}`)
  return cid.toString()
}

export async function pinIpfsCid (cid: string): Promise<void> {
  if (isV0CID(cid)) {
    console.log(`
WARN: Detected a V0 CID string. This warning will become an error very soon.
Please repack the pack containing ${cid}
`)
  }
  await node.pin.add(cid)
  debug(`pinned ${cid}`)
}

// 'If a CID is 46 characters starting with "Qm", it's a CIDv0'
// https://docs.ipfs.io/concepts/content-addressing/#identifier-formats
export function isV0CID (cidStr: string): boolean {
  return (cidStr.length == 46 && cidStr.slice(0, 2) == 'Qm')
}

export function isCid (cidStr: string): boolean {
  try {
    IPFS.CID.parse(cidStr)
    return true
  } catch {
    return false
  }
}
