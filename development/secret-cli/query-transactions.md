# Query Transactions

## Matching a Set of Events <a href="#matching-a-set-of-events" id="matching-a-set-of-events"></a>

Use the transaction search command to query for transactions matching a specific set of `events`, which are added on every transaction.

Each event contains a key-value pair in the form of `{eventType}.{eventAttribute}={value}`.

Events can be combined to query for more specific results using the `&` symbol.

You can query transactions by `events` as follows:

```
secretcli q txs --events='message.sender=secret1...'
```

And for using multiple `events`:

```
secretcli q txs --events='message.sender=secret1...&message.action=withdraw_delegator_reward'
```

The pagination is supported as well via `page` and `limit`:

```
secretcli q txs --events='message.sender=secret1...' --page=1 --limit=20
```

Note

The action tag always equals the message type returned by the `Type()` function of the relevant message.

You can find a list of available `events` on each of the SDK modules:

* [Staking events](https://github.com/cosmos/cosmos-sdk/blob/master/x/staking/spec/07\_events.md)
* [Governance events](https://github.com/cosmos/cosmos-sdk/blob/master/x/gov/spec/04\_events.md)
* [Slashing events](https://github.com/cosmos/cosmos-sdk/blob/master/x/slashing/spec/06\_events.md)
* [Distribution events](https://github.com/cosmos/cosmos-sdk/blob/master/x/distribution/spec/06\_events.md)
* [Bank events](https://github.com/cosmos/cosmos-sdk/blob/master/x/bank/spec/04\_events.md)

#### [#](https://docs.scrt.network/cli/secretcli.html#matching-a-transaction-hash)Matching a Transaction Hash <a href="#matching-a-transaction-hash" id="matching-a-transaction-hash"></a>

You can query a single transaction by its hash using the following command:

```
secretcli q tx [hash]
```
