# 🔐 Ledger with SecretCLI

For a more advanced user, it is possible to interface with the CLI utility, SecretCLI with a Ledger device. You can get it [here](https://github.com/scrtlabs/SecretNetwork/releases/latest). These are some basic examples of commands you can use with your Ledger device. You may notice that most commands stay the same, you just need to add the `--ledger` flag.

#### Import an account

> Note: You can use any number you'd like for your account number. Be sure to remember the number you used, so you can recover if needed. The default for the account number is 0.

```bash
secretcli keys add <account name> --ledger --account <account number> 
```

#### Display your account address

```bash
secretcli keys show -a <account name>
```

#### Add an account to `secretcli` that already exists on your Ledger device

_You'll use this when you, say, using a different machine._

```bash
secretcli keys add <account name> --ledger --account <account number on your Ledger device> --recover 
```

{% hint style="danger" %}
**Warning: if you run the above command without the `--ledger` flag, the CLI will prompt you to enter your BIP39 mnemonic, which is your Ledger device recovery phrase. YOU DO NOT WANT TO DO THIS. This will essentially save your private key locally, which defeats the purpose of using a Ledger device.**
{% endhint %}

_The commands below assume that you run them on the same machine where you have a Secret Network node running. If you wish to connect to a remote Secret Network node while you interact with your Ledger device locally, the following command will use a publicly available node or pick one from_ [connecting-to-the-network](../../development/resources-api-contract-addresses/connecting-to-the-network/ "mention")_:_

```bash
secretd config node https://rpc.mainnet.secretsaturn.net
```

#### Send tokens

```bash
secretcli tx bank send <account name or address> <to_address> <amount> --ledger 
```

#### Delegate SCRT to a validator

```bash
secretcli tx staking delegate <validator address> <amount to bond> --from <account key> --ledger
```

#### Collect rewards and commission

```bash
secretcli tx distribution withdraw-rewards --from <account name> --commission --ledger
```

#### Vote on proposals

```bash
secretcli tx gov vote <proposal-id> <vote> --from <account name> --ledger
```

#### Deposit snip-20 token

```bash
secretcli tx snip20 deposit <contract address or label> --amount <amount> --from <account name> --ledger
```

#### Transfer snip-20 token

```bash
secretcli tx snip20 transfer <contract address or label> <to_address> <amount> --from <account name> --ledger
```

### Support

For support please contact the Secret Support [here](https://linktr.ee/SCRTSupport).
