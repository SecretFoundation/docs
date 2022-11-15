# Configuration

## Configuration

SCRT Labs regularly updates a [Secret Network API Registry ](../../connecting-to-the-network.md)containing information required to configure the _secretcli._

To check the status of a node use:

```bash
$ secretcli status --node "$URL"
```

## Mainnet

```bash
secretcli config node https://secret-4.api.trivium.network:26657

secretcli config chain-id secret-4
```

## Testnet

```bash
secretcli config node https://rpc.pulsar.griptapejs.com:443

secretcli config chain-id pulsar-2

secretcli config keyring-backend test
```
