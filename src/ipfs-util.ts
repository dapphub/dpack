const debug = require('debug')('dpack')

const IPFS = require('ipfs-http-client')
debug('starting node')
const node = IPFS.create('/ip4/127.0.0.1/tcp/5001')
debug('started node')

export async function getIpfsJson (cid: string): Promise<any> {
  debug(`get ${cid}`)
  const blob = await node.cat(cid)
  let s = ''
  for await (const chunk of blob) {
    s += chunk
  }
  const json = JSON.parse(s)
  return json
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
