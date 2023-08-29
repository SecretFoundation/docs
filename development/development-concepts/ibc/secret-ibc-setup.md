---
description: >-
  Two local secrets can Inter-blockchainly communicate with each other via a
  Hermes relayer
---

# Secret IBC setup

### Secret IBC setup

In this demo, you will learn how to create two LocalSecret docker containers that can send IBC messages to each other using a [Hermes relayer](https://hermes.informal.systems/). This tutorial assumes that you already have [SecretCLI](https://docs.scrt.network/secret-network-documentation/development/tools-and-libraries/secret-cli/install) installed on your machine. In order to follow along, [clone the Secret-IBC-setup repo](https://github.com/scrtlabs/examples/tree/master/secret-IBC-setup) before proceeding.&#x20;

### Bootstrapping LocalSecret

Make sure you have Docker installed and running. Then run:

```
docker compose up
```

This launches two LocalSecret containers:

* localsecret-1 on port 26657
* localsecret-2 on port 36657

Now let's establish an IBC channel between them in order to make an IBC token transfer.&#x20;

#### Creating the IBC transfer channel

To create an IBC transfer channel, make sure both LocalSecret chains are active and then run:&#x20;

{% code overflow="wrap" %}
```sh
hermes create channel --a-chain secretdev-1 --b-chain secretdev-2 --a-port transfer --b-port transfer --new-client-connection
```
{% endcode %}

{% hint style="info" %}
If you've never funded a Hermes wallet before, [learn how to do so here](https://github.com/scrtlabs/examples/blob/master/secret-IBC-setup/Wallets.md)
{% endhint %}

You should now have successfully created an IBC transfer channel on `channel-0.` &#x20;

#### Verify IBC transfers

Assuming you have a key `'a'` which is not the relayer's key, run:&#x20;

{% code overflow="wrap" %}
```sh
# be on the source network (secretdev-1)
secretcli config node http://localhost:26657

# check the initial balance of a
secretcli q bank balances <a-address>

# transfer to the destination network
secretcli tx ibc-transfer transfer transfer channel-0 secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03 1uscrt --from a

# check a's balance after transfer
secretcli q bank balances <a-address>

# switch to the destination network (secretdev-2)
secretcli config node http://localhost:36657

# check that you have an ibc-denom
secretcli q bank balances <dst-b>
```
{% endcode %}
