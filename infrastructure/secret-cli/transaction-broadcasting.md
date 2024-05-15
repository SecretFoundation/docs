# Transaction Broadcasting

Transactions can be broadcast using the following command:&#x20;

```
secretcli tx broadcast tx_signed.json
```

## Broadcast Mode

When broadcasting transactions, `secretcli` can accept a `--broadcast-mode` flag. The value of this flag can be `sync` (default), `async`, or `block.`&#x20;

* `sync` makes the client return a CheckTx response (default)
* `async` makes the client return immediately
* `block` makes the client wait for the Tx to be committed (transaction may fail)

_Note: The `block` mode should **not** be used in most circumstances because broadcasting can timeout, but the Tx may still be included in a block which can create undesirable situations. Therefore, it is best to use `sync` or `async`, and query by Tx hash to determine when the Tx is included in a block._
