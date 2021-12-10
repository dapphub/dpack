`dpack`
===

A dpack is a lockfile for a set of named addresses and artifacts.
Use the `dpack` library in this repo to load an entire collection of ethers.js objects from a published dpack,
or to assemble your own packs and distribute them.

This is one piece of the secure software supply chain puzzle for web3/defi.
It leverages IPFS and IPLD (it's just a JSON file using DAG-JSON convention for IPFS links).
Together with `dmap` (ENS alternative oriented around ssc verification), this can replace
the ad-hoc and insecure distribution of addresses and metadata via the node registry and/or github.

`dpack` is in alpha / active development. It is currently distributed via this repo:

`npm i dapphub/dpack`

It currently requires `ipfs daemon` to be running.


`dpack` format description
---

A dpack is a JSON file with these fields:

```
{
  "format": "dpack-1",
  "network" "ethereum",
  "types": { ... },
  "objects": { ... }
}
```

### format

`format` is currently `dpack-1`

### network

`network` is the name of the network on which the objects in this dpack are deployed. Future formats will support multi-network packs.

### types

`types` is a collection of named contract types ("classes"). Each object has this form:

```
"MyToken": {
  "artifacts": {"/": "<CID>"}
}
```

`artifacts` is an DAG-JSON link to the 'artifacts' json file (output of solc/truffle/hardhat).

### objects

`objects` is a collection of named EVM contract instances.
These object descriptors store the type information as well (artifacts and typename).
If the type name matches one of the types declared in this same scope (the same dpack),
or if multiple objects have the same typename, then the artifacts must also match.

```
"mytoken": {
  "address": "<ETH address>"
  "typename": "MyToken",
  "artifacts": {"/": "<CID>"}
}
```
