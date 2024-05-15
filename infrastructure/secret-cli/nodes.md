# Nodes

If you are running a full node or a validator node, view the status by typing:

```bash
secretcli status

# Use the -n, --node flag to connect to a
# specific node (default "tcp://localhost:26657")
```

Example output for `secretcli status | jq`:&#x20;

```bash
{
  "NodeInfo": {
    "protocol_version": {
      "p2p": "8",
      "block": "11",
      "app": "0"
    },
    "id": "38bee11836e06fec5cb9b3eb6ca66a44abf6c2ea",
    "listen_addr": "174.138.172.52:26656",
    "network": "secret-4",
    "version": "0.34.19",
    "channels": "40202122233038606100",
    "moniker": "anode1-node02",
    "other": {
      "tx_index": "on",
      "rpc_address": "tcp://174.138.172.52:26657"
    }
  },
  "SyncInfo": {
    "latest_block_hash": "8B56C543B4D58378C514EFF0643A9FE392E31E4F35C10E57EF355D422E0BAD6D",
    "latest_app_hash": "72286A7DDA4DFC38737DC6B6381235003166C46A99DD77955801660669AC889D",
    "latest_block_height": "4060469",
    "latest_block_time": "2022-06-28T12:10:32.992861612Z",
    "earliest_block_hash": "C168FE742EC3DCD6911B31CEE7F0C58EF7621EB85E87193875CD9C2C7E74473C",
    "earliest_app_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
    "earliest_block_height": "813800",
    "earliest_block_time": "2021-11-10T15:00:00Z",
    "catching_up": false
  },
  "ValidatorInfo": {
    "Address": "FAABDCF81803E51DE9A7C6EA7447F1D403B50C1F",
    "PubKey": {
      "type": "tendermint/PubKeyEd25519",
      "value": "7eb9uBzsF2v83pT9JxTzE2B4cAdHpSfrF/tLUyIQQvU="
    },
    "VotingPower": "0"
  }
}
```
