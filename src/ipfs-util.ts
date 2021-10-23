const debug = require('debug')('dpack')

const IPFS = require('ipfs-http-client')
const node = IPFS.create()

export async function getIpfsJson(cid: string) {
  debug(`get ${cid}`)

  const blob = await node.cat(cid)
  let s = ''
  for await (const chunk of blob) {
    s += chunk
  }

  const json = JSON.parse(s)
  return json
}

export async function putIpfsJson(obj: any, pin: boolean = false): Promise<string> {
  const str = JSON.stringify(obj)
  const { cid } = await node.add(str)
  if (pin) {
    await pinIpfsCid(cid)
  }
  debug(`put ${cid}`)
  return cid
}

export async function pinIpfsCid(cid: string) {
  await node.pin.add(cid)
  console.log(`pinned ${cid}`)
}
