# Query Transactions

## Matching a Set of Events <a href="#matching-a-set-of-events" id="matching-a-set-of-events"></a>

Querying transaction commands use the following format:

```bash
secretcli query tx \
    --type=[hash|acc_seq|signature] \
    [hash|acc_seq|signature] \
    [flags]
```

Use the transaction search command to query for transactions matching a specific set of `events`, which are added on every transaction.

Each event contains a key-value pair in the form of `{eventType}.{eventAttribute}={value}`.

Events can be combined to query for more specific results using the `&` symbol.

You can query transactions by `events` as follows:

```bash
secretcli q txs --query "message.sender='secret1...'"
```

And for using multiple `events`:

```bash
secretcli q txs --query "message.sender='secret1...' AND message.action='/secret.compute.v1beta1.MsgInstantiateContract' "
```

The pagination is supported as well via `page` and `limit`:

```bash
secretcli q txs --query "message.sender='secret1...'" --page=1 --limit=20
```

_**Note:** The action tag always equals the message type returned by the `Type()` function of the relevant message._

## Events List

You can find a list of available `events` on each of the SDK modules:

* [Staking events](https://github.com/cosmos/cosmos-sdk/blob/main/x/staking/README.md)
* [Governance events](https://github.com/cosmos/cosmos-sdk/blob/main/x/gov/README.md)
* [Slashing events](https://github.com/cosmos/cosmos-sdk/blob/main/x/slashing/README.md)
* [Distribution events](https://github.com/cosmos/cosmos-sdk/blob/main/x/distribution/README.md)
* [Bank events](https://github.com/cosmos/cosmos-sdk/blob/main/x/bank/README.md)

## Matching a Transaction Hash <a href="#matching-a-transaction-hash" id="matching-a-transaction-hash"></a>

You can query a single transaction by its hash using the following command:

```bash
secretcli q tx [hash]
```

## Flags

There are four flags associated with querying Secret Network transactions using the `secretcli.`

### Height

The `--height [int]` flag uses a specific height to query the state of the Secret Network (there will be an error if the node is pruning state).

### Node

The `--node [string]` flag uses \<host>:\<port> to connect with the Tendermint RPC for a specific chain (default is "tcp://localhost:26657").

### Type

The `--type [string]` flag is for querying a tx, and can be the 'hash' (default), 'acc\_seq', or 'signature'.

### Help

The `--help` flag will generate an output giving further details on flags to use with the `tx` class of `secretcli` commands, and information about `global flags` to use with the `secretcli`.
