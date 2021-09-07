`dpack`
---

`dpack` is a tool and library for working with deployed objects on EVM chains.
It is in alpha / active development.

It bundles named addresses and their type metadata in a way that makes it
easy to quickly set up bindings for entire configurations of contracts.

This provides a missing part of the dev toolchain that is somewhat unique to blockchain development.
It is analagous to a *linker* that manipulates *object files*, except the runtime environment is
universal to everyone and pseudo-content-addressed via contract addresses.

Compare this to package managers, which deal mostly with *source* management. Also compare this to ethPM
and similar package managers, which make an ontological error by mapping addresses onto contract types 1:1.

The goal is for it to work as a standalone library, a command line tool, or a hardhat plugin.

```
const dapp = await dpack.load("stablecoins.json");

dapp.useProvider(ethers.getDefaultProvider( "ropsten" ));
dapp.useSigner(new ethers.Wallet( env.OPERATOR_KEY ));

const USDC = dapp.objects.USDC;

const supply = USDC.totalSupply();
debug(`USDC supply: ${supply}`);

const tx_send = await USDC.transfer(...)
await tx_send.wait()
```

It provides a utility to help construct pack files:

```
// in file, out file, modifier function
dapp.mutatePackFile('/dist/base.json', '/dist/extended.json', async (pack) => {
  pack.addType(...)
  pack.addObject(...)
})
```
