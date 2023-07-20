---
description: >-
  `secretcli` is the Secret Network light client, a command-line interface tool
  for interacting with nodes running on the Secret Network. To install it,
  follow these instructions:
---

# Installing CLI & Creating A New Address

### Download <a href="#setup-the-executable" id="setup-the-executable"></a>

Get the latest release of secretcli for your OS [HERE](https://github.com/scrtlabs/SecretNetwork/releases).

### Install <a href="#setup-the-executable" id="setup-the-executable"></a>

* Mac/Windows: Rename it from `secretcli-${VERSION}-${OS}` to `secretcli` or `secretcli.exe` and put it in your path
* Ubuntu/Debian: `sudo dpkg -i secret*.deb`

### Setup the executable <a href="#setup-the-executable" id="setup-the-executable"></a>

Linux and MacOS users:

```
chmod +x secretcli
```

### Configure <a href="#setup-the-executable" id="setup-the-executable"></a>

```
secretcli config chain-id pulsar-3
secretcli config output json
secretcli config node https://rpc.pulsar3.scrttestnet.com
```

You can find alternate node endpoints in the [API registry](../../../development/resources-api-contract-addresses/connecting-to-the-network/), or run your own [full node](run-a-full-node.md)\\

### Check the installation <a href="#create-a-new-address" id="create-a-new-address"></a>

```
secretcli status
```

```
{
  "NodeInfo": {
    "protocol_version": {
      "p2p": "8",
      "block": "11",
      "app": "0"
    },
    "id": "a3c9c415fe6b46babd16f000c7dbd4d94be6e450",
    "listen_addr": "tcp://0.0.0.0:26656",
    "network": "pulsar-3",
    "version": "0.34.24",
    "channels": "40202122233038606100",
    "moniker": "pulsator3",
    "other": {
      "tx_index": "on",
      "rpc_address": "tcp://127.0.0.1:26657"
    }
  },
  "SyncInfo": {
    "latest_block_hash": "8295231C26AD045BD2451DB027F149DA089014F0DC69583AB50A3AE24DEE3B13",
    "latest_app_hash": "74070BFAE77578D5DD391EED26677DD6C3EBF535C5ACA15EA2C6FE12BC3DED46",
    "latest_block_height": "117302",
    "latest_block_time": "2023-07-19T18:35:38.186447689Z",
    "earliest_block_hash": "4EB0D9FA820FFCEEDED341FCBC996A05BDE271D155E88A6038CAB1445687FF1A",
    "earliest_app_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
    "earliest_block_height": "1",
    "earliest_block_time": "2023-07-12T14:23:36.016368475Z",
    "catching_up": false
  },
  "ValidatorInfo": {
    "Address": "27BF7A7B7E8C5728150487E6E2C385945CA6DEDB",
    "PubKey": {
      "type": "tendermint/PubKeyEd25519",
      "value": "6Ux76jUesi24eWtXKTSyQWREaTT1VMS+HhEqIB2D5yo="
    },
    "VotingPower": "0"
  }
}
```

### Create a new address <a href="#create-a-new-address" id="create-a-new-address"></a>

```
secretcli keys add <name>
```

See more details on how to use the CLI [here](https://github.com/scrtlabs/SecretNetwork/blob/master/docs/node-guides/secretcli.md)
