`dpack`
---

`dpack` is a tool and library for working with deployed objects on EVM chains.

It bundles named addresses and their type metadata in a way that makes it
easy to quickly set up bindings for entire configurations of contracts.

The goal is for it to work as a standalone library, a command line tool, or a hardhat plugin.

`dpack` is in alpha / active development. It is currently distributed via this repo:

`npm i dapphub/dpack`

It currently requires `ipfs daemon` to be running.

### Intro

`dpack` is analagous to a *linker* that manipulates *object files*, except the runtime environment is
universal to everyone and pseudo-content-addressed via contract addresses.

Compare this to package managers, which deal mostly with *source* management. Also compare this to ethPM
and similar package managers, which make an ontological error by mapping addresses onto contract types 1:1.


### Installation

1. Install [IPFS](https://docs.ipfs.io/install/command-line/#official-distributions)
2. Run `ipfs init`
3. Run `ipfs daemon`

### Usage

```sh
# Show object
/bin/run show test/sample-pack.json
```
