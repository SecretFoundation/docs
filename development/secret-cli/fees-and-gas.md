# Fees & Gas

Each transaction supplies fees or gas prices, but never both.

Validator's have a minimum gas price (multi-denom) configuration used to determine if they should include a transaction in a block during `CheckTx`, where `gasPrices >= minGasPrices`.

**Note**: Transactions must supply fees greater than or equal to **any** fees set by validators. Validators may start to prioritize txs by `gasPrice` in the mempool, increasing tx priority based on fees or gas prices.

e.g.

```
# secretcli tx bank send [from_key_or_address] [to_address] [amount] [flags]
secretcli tx bank send ... --fees=50000uscrt
```

or

```
secretcli tx bank send ... --gas-prices=0.0125uscrt
```
