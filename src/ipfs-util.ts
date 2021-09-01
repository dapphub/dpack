const debug = require('debug')('dpack')

const IPFS = require("ipfs-core");
let node: any;

export async function getIpfsJson(hash: string) {
  if (!node) {
    node = await IPFS.create({ silent: true, start: false });
  }
  await node.start();
  debug(`resolving ${hash}`);
  const blob = await node.cat(hash);
  let s = "";
  for await (let chunk of blob) {
    s += chunk;
  }
  const json = JSON.parse(s);
  await node.stop();
  return json;
}

export async function putIpfsJson(obj: any): Promise<string> {
  if (!node) {
    node = await IPFS.create({ silent: true, start: false });
  }
  await node.start();
  const str = JSON.stringify(obj);
  const { cid } = await node.add(str);
  require('fs').writeFileSync('/tmp/ipfs/' + cid, str);
  debug(cid);
  await node.stop();
  return cid;
}


