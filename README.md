`dpack` is a library for working with deployed objects on EVM chains.

It bundles named addresses and their type metadata in a way that makes it easy to quickly consume as a library.

```
const dapp = await dpack.load("stablecoins.json");

dapp.useNetwork("ropsten");
dapp.useSigner(env.OPERATOR_KEY);

const supply = await dapp.objects.USDC.totalSupply();
debug(`USDC supply: ${supply}`);
```

It is also a command-line tool for manipulating packs. This is better than manual editing because it does consistency checks.

```
dpack add-type feedbase-pack.json Feedbase artifacts/Feedbase.sol/Feedbase.json
dpack add-object feedbase-pack.json feedbase 0x0 artifacts/Feedbase.sol/Feedbase.json
```
