# Configuration

## Configuration

SCRT Labs regularly updates a [Secret Network API Registry ](../../resources-api-contract-addresses/connecting-to-the-network/)containing information required to configure the _secretcli._

To check the status of a node use:

```bash
$ secretcli status --node "$URL"
```

## Mainnet

```bash
secretcli config node https://rpc.secret.express:443

secretcli config chain-id secret-4

secretcli config output json
```

## Testnet

```bash
secretcli config node https://rpc.pulsar.scrttestnet.com/

secretcli config chain-id pulsar-3

secretcli config output json

secretcli config keyring-backend test
```
