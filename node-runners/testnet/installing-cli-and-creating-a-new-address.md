---
description: >-
  `secretcli` is the Secret Network light client, a command-line interface tool
  for interacting with nodes running on the Secret Network. To install it,
  follow these instructions:
---

# Installing CLI & Creating A New Address

### [#](https://docs.scrt.network/testnet/install\_cli.html#setup-the-executable)Download <a href="#setup-the-executable" id="setup-the-executable"></a>

Get the latest release of secretcli for your OS [HERE](https://github.com/scrtlabs/SecretNetwork/releases).

### [#](https://docs.scrt.network/testnet/install\_cli.html#setup-the-executable)Install <a href="#setup-the-executable" id="setup-the-executable"></a>

* Mac/Windows: Rename it from `secretcli-${VERSION}-${OS}` to `secretcli` or `secretcli.exe` and put it in your path
* Ubuntu/Debian: `sudo dpkg -i secret*.deb`

### [#](https://docs.scrt.network/testnet/install\_cli.html#setup-the-executable)Setup the executable <a href="#setup-the-executable" id="setup-the-executable"></a>

Linux and MacOS users:

```
chmod +x secretcli
```

### [#](https://docs.scrt.network/testnet/install\_cli.html#setup-the-executable)Configure <a href="#setup-the-executable" id="setup-the-executable"></a>

```
secretcli config chain-id pulsar-2
secretcli config output json
secretcli config node https://rpc.scrt.network/
```

You can find alternate node endpoints in the [API registry](https://github.com/scrtlabs/api-registry), or run your own [full node](run-a-full-node.md)

### [#](https://docs.scrt.network/testnet/install\_cli.html#create-a-new-address)Create a new address <a href="#create-a-new-address" id="create-a-new-address"></a>

```
secretcli keys add <name>
```

See more details on how to use the CLI [here](https://github.com/scrtlabs/SecretNetwork/blob/master/docs/node-guides/secretcli.md)
