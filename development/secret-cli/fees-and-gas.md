# Fees & Gas

On the Secret Network gas is a special unit used for tracking the the use of resources during code execution (usually paid by the transaction sender). Gas fees are normally paid to execute read / write commands, but can also be used to pay for more resource intensive computational tasks.&#x20;

Gas primarily serves two purposes:&#x20;

1. To ensure each block is not over consuming resources, and that each block will be finalized on-chain. The cost of `gas` consumed during [`message`](https://docs.cosmos.network/v0.44/building-modules/messages-and-queries.html#messages) execution results in a `fee` where `fees = gas * gas-prices`.&#x20;
2. To prevent end-users from spamming and abusing the Secret Network. Most applications implement fee mechanisms to prevent spam, but the `secretcli` does not enforce gas pricing by default.&#x20;

Each transaction supplies fees or gas prices, but never both.

Validator's have a minimum gas price (multi-denom) configuration used to determine if they should include a transaction in a block during `CheckTx`, where `gasPrices >= minGasPrices`.

_**Note**: Transactions must supply fees greater than or equal to **any** fees set by validators. Validators may start to prioritize transactions by `gasPrice` in the mempool, increasing transaction priority based on fees or gas prices._

e.g.

```bash
# secretcli tx bank send [from_key_or_address] [to_address] [amount] [flags]

secretcli tx bank send ... --fees=50000uscrt
```

or

```bash
secretcli tx bank send ... --gas-prices=0.0125uscrt
```
