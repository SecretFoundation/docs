# Configuration

## Configuration

SCRT Labs regularly updates a [Secret Network API Registry](https://github.com/scrtlabs/api-registry) containing information required to configure the _secretcli._&#x20;

To check the status of a node use:&#x20;

```bash
$ secretcli status --node "$URL"
```

## Mainnet&#x20;

```bash
secretcli config node https://secret-4.api.trivium.network:26657

secretcli config chain-id secret-4

```

## Testnet&#x20;

```bash
secretcli config node https://rpc.pulsar.griptapejs.com:443

secretcli config chain-id pulsar-2

secretcli config keyring-backend test
```
