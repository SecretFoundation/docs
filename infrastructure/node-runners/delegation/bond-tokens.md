# Bond Tokens

On the Secret Network mainnet, we delegate `uscrt`, where `1scrt = 1000000uscrt`. Here's how you can bond tokens to a validator (_i.e._ delegate):

```bash
secretcli tx staking delegate \
	<validator-operator-address>
	<amount> \
	--from=<key-alias>
```

Example:

```bash
secretcli tx staking delegate \
	secretvaloper1l2rsakp388kuv9k8qzq6lrm9taddae7fpx59wm \
	1000uscrt \
	--from <key-alias>
```

`<validator-operator-address>` is the operator address of the validator to which you intend to delegate. If you are running a full node, you can find this with:

```bash
secretcli keys show <key-alias> --bech val
```

Where `<key-alias>` is the name of the key you specified when you initialized `secretd`.

While tokens are bonded, they are pooled with all the other bonded tokens in the network. Validators and delegators obtain a percentage of shares that equal their stake in this pool.\\
