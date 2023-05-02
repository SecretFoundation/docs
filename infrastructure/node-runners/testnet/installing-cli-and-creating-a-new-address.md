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
secretcli config chain-id pulsar-2
secretcli config output json
secretcli config node https://rpc.pulsar.griptapejs.com
```

You can find alternate node endpoints in the [API registry](../../../development/connecting-to-the-network/), or run your own [full node](run-a-full-node.md)\\

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
    "id": "4b5e512f8a3c780997296bf832b03162f3df8547",
    "listen_addr": "tcp://0.0.0.0:26656",
    "network": "pulsar-2",
    "version": "0.34.19",
    "channels": "40202122233038606100",
    "moniker": "sod-kiwi",
    "other": {
      "tx_index": "on",
      "rpc_address": "tcp://0.0.0.0:26657"
    }
  },
  "SyncInfo": {
    "latest_block_hash": "A96CACFF7ECDA55CE74B4CB5663CBCB4B81C90EE9C5A782FDE54EF2731B2602C",
    "latest_app_hash": "72265C9D240664114B5147250DFB5D264059FEECD79252299FBC8F1AE5DFAB45",
    "latest_block_height": "3349627",
    "latest_block_time": "2022-06-17T13:26:22.318042433Z",
    "earliest_block_hash": "CE8FAC38B21A89F9D19AA426079FF4E70C3D10C7145B054FA62074A6A4315C4F",
    "earliest_app_hash": "923C58D76166FB56E56223DBF7D3F5D5E351AA9B29508F34230DC37D984AEB88",
    "earliest_block_height": "2732001",
    "earliest_block_time": "2022-05-12T09:02:42.660025803Z",
    "catching_up": false
  },
  "ValidatorInfo": {
    "Address": "A4F9AC96DA2D8FCA823041E7C5CE983661B5366A",
    "PubKey": {
      "type": "tendermint/PubKeyEd25519",
      "value": "xqI/LrMarnyVSEKeYeLGGRWz0EuAKgr22ymD8A6h0B0="
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
