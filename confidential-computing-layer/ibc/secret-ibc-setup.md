---
description: >-
  Two local secrets can Inter-blockchainly communicate with each other via a
  Hermes relayer
---

# Secret IBC setup

{% hint style="success" %}
For deployment of production level relaying services and config/guide information for both RLY and Hermes please refer to --> [IBC relayers documentation](../../../infrastructure/resources/ibc-relayers/)
{% endhint %}

### Secret IBC setup

In this demo, you will learn how to create two LocalSecret docker containers that can send IBC token transfers to each other using a Hermes relayer. This tutorial assumes that you already have [SecretCLI](https://docs.scrt.network/secret-network-documentation/development/tools-and-libraries/secret-cli/install) installed on your machine. In order to follow along, [clone the Secret-IBC-setup repo](https://github.com/scrtlabs/examples/tree/master/secret-IBC-setup) before proceeding.&#x20;

Next, install [Hermes relayer.](https://hermes.informal.systems/) You can use the hermes configuration found in the [Secret Labs examples repository](https://github.com/scrtlabs/examples/blob/master/secret-IBC-setup/relayer/config.toml) for your configuration of Hermes.&#x20;

{% hint style="info" %}
If you are using a Mac, you may need to press `Command + Shift + .`(the period key) in order to see your Hermes configuration file.&#x20;

The configuration file can be found in `$HOME/.hermes/bin`
{% endhint %}

### Bootstrapping LocalSecret

Make sure you have [Docker](https://www.docker.com/products/docker-desktop/) installed and running. Then, `cd` into ./secret-ibc-setup/relayer and run:

```
docker compose up
```

This launches two LocalSecret containers:

* localsecret-1 on port 26657
* localsecret-2 on port 36657

Now let's establish an IBC channel with Hermes between the LocalSecret containers in order to make an IBC token transfer.&#x20;

{% hint style="info" %}
If you've never funded a Hermes wallet before, [learn how to do so here](https://github.com/scrtlabs/examples/blob/master/secret-IBC-setup/Wallets.md).

If you would like to do further reading, refer to the [LocalSecret wallet docs](https://docs.scrt.network/secret-network-documentation/development/tools-and-libraries/local-secret) and the [Hermes wallet docs](https://hermes.informal.systems/documentation/commands/keys/index.html). &#x20;
{% endhint %}

#### Creating the IBC transfer channel

To create an IBC transfer channel, make sure both LocalSecret chains are running in Docker, open a new terminal window in your code editor, and then run:&#x20;

{% code overflow="wrap" %}
```sh
hermes create channel --a-chain secretdev-1 --b-chain secretdev-2 --a-port transfer --b-port transfer --new-client-connection
```
{% endcode %}

SecretCLI will ask you to confirm the transaction before signing:&#x20;

<figure><img src="../../../.gitbook/assets/Screen Shot 2023-09-06 at 4.51.59 PM.png" alt=""><figcaption><p>IBC transfer message in LocalSecret</p></figcaption></figure>

Query that the transaction was successful:&#x20;

```bash
secretcli query tx <tx hash>
```

You have successfully created an IBC transfer channel on `channel-0`🎉.&#x20;

Next, start Hermes:&#x20;

```
hermes start
```

#### Send IBC Token transfers

Assuming you have the wallet key `'a'` which is not the relayer's key, run:&#x20;

{% code overflow="wrap" %}
```sh
# be on the source network (secretdev-1)
secretcli config node http://localhost:26657

# check the initial balance of a
secretcli q bank balances secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03

# transfer to the destination network
secretcli tx ibc-transfer transfer transfer channel-0 secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03 1uscrt --from a
```
{% endcode %}

Query that the transaction was successful:&#x20;

```bash
secretcli query tx <tx hash>
```

{% hint style="info" %}
If you run into the error `cannot send packet using client (07-tendermint-0) with status Expired: client is not active` it is [**because the LocalSecret trusting period is 79 seconds.**](https://github.com/writersblockchain/secret-ibc/blob/bb768a505226475a9c11d98ec48cf87dc2d517e1/relayer/config.toml#L50)&#x20;

To resolve this error you must **launch the LocalSecret containers, create the IBC transfer channel, and start Hermes** within 79 seconds of each other.&#x20;
{% endhint %}

Assuming you did not run into an error, switch to the destination network (secretdev-2) and query the bank balance of `wallet a` to confirm that the transaction was successful:&#x20;

```
# switch to the destination network (secretdev-2)
secretcli config node http://localhost:36657

# check that you have an ibc-denom
secretcli q bank balances secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03
```

Congrats 🎉 You should now see the ibc-denom returned in the transaction query:&#x20;

<figure><img src="../../../.gitbook/assets/Screen Shot 2023-09-06 at 6.02.20 PM.png" alt=""><figcaption><p>IBC-denom transaction query</p></figcaption></figure>

