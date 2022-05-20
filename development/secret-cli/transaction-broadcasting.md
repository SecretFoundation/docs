# Transaction Broadcasting

When broadcasting transactions, `secretcli` accepts a `--broadcast-mode` flag. This flag can have a value of `sync` (default), `async`, or `block`, where `sync` makes the client return a CheckTx response, `async` makes the client return immediately, and `block` makes the client wait for the tx to be committed (or timing out).

It is important to note, that the `block` mode should **not** be used in most circumstances because broadcasting can timeout, but the tx may still be included in a block. This can result in many undesirable situations. Therefore, it is best to use `sync` or `async` and query by tx hash to determine when the tx is included in a block.
