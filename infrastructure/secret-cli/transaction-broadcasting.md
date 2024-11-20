# Transaction Broadcasting

Transactions can be broadcast using the following command:

```
secretcli tx broadcast tx_signed.json
```

## Broadcast Mode

When broadcasting transactions, `secretcli` can accept a `--broadcast-mode` flag. The value of this flag can be `sync` (default), `async``.`

* `sync` makes the client return a CheckTx response (default)
* `async` makes the client return immediately
