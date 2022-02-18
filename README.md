`dpack`
===

A dpack is a file with a collection of EVM addresses and artifacts (ABIs).

The most important part of dpack is the `dpack-1` file format.
It has a simple and final spec that one person can learn in one sitting.
New features will be deferred until the next version, which will be backwards
compatible.

This repo is a lightweight javascript package which lets you
- assemble dpacks from your deployment info
- easily load and instantiate bindings for dapps

For the time being, we are distributing dpack via npm:

`npm i @etherpacks/dpack  # WAIT! Read the next paragraph!`

**WARNING**: Please take a minute to reflect on the nature of the software supply chain.
What good is dpack if you are loading it via npm? Why not just stick the info in a package.json?
There is no 'partially secured', we are either bootstrapped into a secure software supply chain, or not.
If you are using `npm` as currently architected, you are not bootstrapped. But we have to start somewhere,
so here we are.

Basic Usage
---

`ipfs daemon` must be running. `dpack` will connect to the default IPFS RPC URL unless one is specified with the environment variable `IPFS_RPC_URL`.

Loading a dpack:
```
const dpack = require('dpack');
const dapp = dpack.load(require('./pack/weth_ropsten.dpack.json'))

dapp._objects // all instantiated contract *objects* from this pack
dapp._types   // all artifacts plus ethers.js 'factories'; JS-level objects that deploy new instances of contracts

// objects are also loaded directly onto the dapp object
await dapp.weth.transfer(...)
await dapp._objects.weth.transfer(...)   // equivalent, its the same reference
```

Putting together a dpack:
```
const dpack = require('dpack')
const pb = new dpack.PackBuilder('kovan')
// you can also say `const pb = dpack.builder()`

await pb.packType({
  typename: 'Gem',
  artifact: require('./artifact/sol/Gem.sol/Gem.json')
})
await pb.packObject({
  typename: 'GemFab',
  artifact: require('./artifacts/sol/Gem.sol/Gem.json'),
  objectname: 'gemfab',
  address: '0x...'
}, alsoAddType=true)  // alsoAddType argument defaults to true, adds GemFab+artifact to types

const pack = await pb.build();
const pretty = JSON.stringify(pack, null, 2);
console.log(pretty);
```


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
Typenames are mixedcase alphanumeric and underscores, but must start with an uppercase alphabetic.

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
Typenames are mixedcase alphanumeric and underscores, but must start with an uppercase alphabetic.
Objectnames are mixedcase alphanumeric and underscores, but must start with a lowercase alphabetic.


Discussion
---

Much of the Ethereum toolchain ecosystem confuses types and objects just because we call both "contracts".

The prime example of this is the keyword `contract` in solidity referring to a contract *class*.

The dpack format makes a clear distinction and is very explicit. You cannot name an object the same as a type.
