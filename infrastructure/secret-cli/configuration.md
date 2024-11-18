# Configuration

## Configuration

SCRT Labs regularly updates a [Secret Network API Registry ](../../development/resources-api-contract-addresses/connecting-to-the-network/)containing information required to configure the _secretcli._

To check the status of a node use:

```bash
$ secretcli status --node "$URL"
```

## Mainnet

```bash
secretcli config set client node https://rpc.mainnet.secretsaturn.net:443

secretcli config set client chain-id secret-4

secretcli config set client output json
```

## Testnet

```bash
secretcli config set client node https://rpc.pulsar.scrttestnet.com/

secretcli config set client chain-id pulsar-3

secretcli config set client output json

secretcli config set client keyring-backend test
```
