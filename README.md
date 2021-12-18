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
  "typename": "MyToken"
  "artifact": {"/": "<CID>"}
}
```

* `typename` is the name of the type (ie, the Solidity class)
* `artifacts` is a DAG-JSON link to this type's "artifacts" json file (output of solc/truffle/hardhat).

Note that 'typename' is redundant with key used to name this type in this pack.

### objects

`objects` is a collection of named EVM contract instances.
Each object descriptor stores both object information (object name and address)
as well as its type information (artifacts and typename).

If an object's typename matches one of the types declared in this same scope (the same dpack),
or if multiple objects have the same typename, then the artifacts must also match. This means
some typenames and CID's will be recorded redundantly in the pack.

```
"mytoken": {
  "objectname": "mytoken",
  "address": "<ETH address>"
  "typename": "MyToken",
  "artifact": {"/": "<CID>"}
}
```

* `objectname` is the name of the object (a deployed 'contract' with a specific address)
* `address` is the address of the object
* `typename` is the name of the type (ie, the Solidity class).
* `artifact` is a DAG-JSON link to this object's type's "artifacts" json file (output of solc/truffle/hardhat)

Note that 'objectname' is redundant with key used to name this object in this pack.
