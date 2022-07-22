---
description: A local, instant, zero-config Secret Network blockchain.
---

# Local Secret

## What Is LocalSecret? <a href="#what-is-localsecret" id="what-is-localsecret"></a>

LocalSecret is a complete Secret Network testnet and ecosystem containerized with Docker. It simplifies the way secret contract developers test their contracts in a sandbox before they deploy them on a testnet or mainnet.

LocalSecret comes preconfigured with opinionated, sensible defaults for standard testing environments. If other projects mention testing on LocalSecret, they are referring to the settings defined in this repo.

### Advantages Of LocalSecret Vs. A Public Testnet

1. Easily modifiable world states
2. Quick to reset for rapid iterations
3. Simple simulations of different scenarios
4. Controllable validator behavior

## Prerequisites <a href="#prerequisites" id="prerequisites"></a>

* [Docker](https://www.docker.com/)
* Supported known architectures: x86\_64, amd64

## Install LocalSecret <a href="#install-localsecret" id="install-localsecret"></a>

```bash
docker pull ghcr.io/scrtlabs/localsecret
```

## Start LocalSecret <a href="#start-localsecret" id="start-localsecret"></a>

```bash
docker run -it -p 9091:9091 -p 26657:26657 -p 1317:1317 -p 5000:5000 \
  --name localsecret ghcr.io/scrtlabs/localsecret
```

You've now officially created a local Secret Network testnet with chain-id `secretdev-1`. 🎉

Your environment now contains:

| Protocol    | Endpoint               | Usage                                 |
| ----------- | ---------------------- | ------------------------------------- |
| RPC         | http://localhost:26657 | `secretcli`, Keplr, `cosmjs`          |
| gRPC-web    | http://localhost:9091  | `secretjs@beta`                       |
| SCRT Faucet | http://localhost:5000  | To get SCRT                           |
| LCD         | http://localhost:1317  | Keplr, `secretjs@0.17.5` (deprecated) |

{% hint style="info" %}
_You can also use `docker run --rm` to launch LocalSecret. This will delete the container once you exit the terminal, but it also means that you can't edit the node's config as stopping the container automatically deletes it._
{% endhint %}

## Usage <a href="#usage" id="usage"></a>

Here are some examples of how to use LocalSecret with `secretcli`, `secret.js`_,_ and `Keplr`.

### Access And Configure Secretcli <a href="#secretcli" id="secretcli"></a>

To access `secretcli` from inside the docker container:

```bash
docker exec -it localsecret secretcli [command]
```

To configure & test your local secretcli binary:

```bash
secretcli config chain-id secretdev-1
secretcli config node http://localhost:26657
secretcli config output json

SGX_MODE=SW secretcli status
```

{% hint style="info" %}
The environment variable `SGX_MODE=SW` must be applied when using a local `secretcli` binary.
{% endhint %}

### Faucet (AKA Getting SCRT) <a href="#faucet-aka-getting-scrt" id="faucet-aka-getting-scrt"></a>

To send some SCRT to the example secret address `secret1e6mqxtwgaps7vz3qfa3fcekhh7a02hvfjvtqpt` we have to options:

#### Using The Faucet On Port 5000 <a href="#_1-using-the-faucet-on-port-5000" id="_1-using-the-faucet-on-port-5000"></a>

```bash
ADDRESS="secret1e6mqxtwgaps7vz3qfa3fcekhh7a02hvfjvtqpt"

curl "http://localhost:5000/faucet?address=${ADDRESS}"
```

The faucet drips 1000 SCRT at a time.

#### Using A Genesis Account <a href="#_2-using-a-genesis-account" id="_2-using-a-genesis-account"></a>

Inside the docker container there are accounts `a`, `b`, `c` & `d` that are pre-seeded with SCRT and can be used to send some to your address.

```bash
ADDRESS="secret1e6mqxtwgaps7vz3qfa3fcekhh7a02hvfjvtqpt"

docker exec -it localsecret secretd tx bank send a ${ADDRESS} 1000000000uscrt -y
```

### Connect To LocalSecret With secret.js <a href="#secret-js" id="secret-js"></a>

Connect to the chain through LocalSecret's gRPC-web endpoint.

`npm i secretjs@beta` or `yarn add secretjs@beta`, then:

```javascript
import { SecretNetworkClient } from "secretjs";

const secretjs = await SecretNetworkClient.create({
  chainId: "secretdev-1",
  grpcWebUrl: "http://localhost:9091",
});
```

{% hint style="info" %}
[Read the full secret.js docs here.](https://github.com/scrtlabs/secret.js#readme)
{% endhint %}

### Keplr <a href="#keplr" id="keplr"></a>

To add a custom chain to Keplr, use this code:

```javascript
await window.keplr.experimentalSuggestChain({
  chainId: "secretdev-1",
  chainName: "LocalSecret",
  rpc: "http://localhost:26657",
  rest: "http://localhost:1317",
  bip44: {
    coinType: 529,
  },
  bech32Config: {
    bech32PrefixAccAddr: "secret",
    bech32PrefixAccPub: "secretpub",
    bech32PrefixValAddr: "secretvaloper",
    bech32PrefixValPub: "secretvaloperpub",
    bech32PrefixConsAddr: "secretvalcons",
    bech32PrefixConsPub: "secretvalconspub",
  },
  currencies: [
    {
      coinDenom: "SCRT",
      coinMinimalDenom: "uscrt",
      coinDecimals: 6,
      coinGeckoId: "secret",
    },
  ],
  feeCurrencies: [
    {
      coinDenom: "SCRT",
      coinMinimalDenom: "uscrt",
      coinDecimals: 6,
      coinGeckoId: "secret",
    },
  ],
  stakeCurrency: {
    coinDenom: "SCRT",
    coinMinimalDenom: "uscrt",
    coinDecimals: 6,
    coinGeckoId: "secret",
  },
  coinType: 529,
  gasPriceStep: {
    low: 0.1,
    average: 0.25,
    high: 1,
  },
  features: ["secretwasm", "stargate", "ibc-transfer", "ibc-go"],
});
```

{% hint style="info" %}
_Different instances of LocalSecret need to be re-added to Keplr, so you need to first delete the old LocalSecret from Keplr and then re-run this^ code to add the current LocalSecret._
{% endhint %}

{% hint style="info" %}
[Learn how to connect Keplr with secret.js.](https://github.com/scrtlabs/secret.js#keplr-wallet)
{% endhint %}

## Configure LocalSecret <a href="#configure-localsecret" id="configure-localsecret"></a>

### Modifying Node Configuration <a href="#modifying-node-configuration" id="modifying-node-configuration"></a>

You can modify the node configuration of your validator in the `~/.secretd/config/config.toml` and `~/.secretd/config/app.toml` files inside the container.

To enter the docker container to access them, run:

```bash
docker exec -it localsecret bash
```

You can then use commands like `sed` & `perl` to edit these files, or install text editors like `vim` & `nano` using `apt install -y vim nano`.

### Applying The Changes <a href="#applying-the-changes" id="applying-the-changes"></a>

To apply changes that are made to the config file, restart LocalSecret by running:

```bash
docker stop localsecret
docker start -a localsecret
```

### Speed Up Block Time <a href="#pro-tip-speed-up-block-time" id="pro-tip-speed-up-block-time"></a>

LocalSecret is often used alongside a script written with the secret.js as a convenient way to do integration tests. You can greatly improve the experience by speeding up the block time.

To decrease block times, edit the `[consensus]` parameters in `~/.secretd/config/config.toml`, and specify your own values.

The following example configures block time to be roughly `200ms`:

```toml
##### consensus configuration options #####
[consensus]

wal_file = "data/cs.wal/wal"
- timeout_propose = "3s"
- timeout_propose_delta = "500ms"
- timeout_prevote = "1s"
- timeout_prevote_delta = "500ms"
- timeout_precommit_delta = "500ms"
- timeout_commit = "5s"
+ timeout_propose = "120ms"
+ timeout_propose_delta = "20ms"
+ timeout_prevote = "40ms"
+ timeout_prevote_delta = "20ms"
+ timeout_precommit_delta = "20ms"
+ timeout_commit = "200ms"
```

You can use the following commands to configure the above timeouts:

```bash
docker exec localsecret perl -i -pe 's/^timeout_propose =.*/timeout_propose = "120ms"/' .secretd/config/config.toml
docker exec localsecret perl -i -pe 's/^timeout_propose_delta =.*/timeout_propose_delta = "20ms"/' .secretd/config/config.toml
docker exec localsecret perl -i -pe 's/^timeout_prevote =.*/timeout_prevote = "40ms"/' .secretd/config/config.toml
docker exec localsecret perl -i -pe 's/^timeout_prevote_delta =.*/timeout_prevote_delta = "20ms"/' .secretd/config/config.toml
docker exec localsecret perl -i -pe 's/^timeout_precommit_delta =.*/timeout_precommit_delta = "20ms"/' .secretd/config/config.toml
docker exec localsecret perl -i -pe 's/^timeout_commit =.*/timeout_commit = "200ms"/' .secretd/config/config.toml
```

To load the changes, restart LocalSecret.

{% hint style="info" %}
_It may take some time for the container to setup before you can edit `.secretd/config/config.toml`, so when scripting this you might want to check when this file is present or simply wait for 5-10 seconds._
{% endhint %}

To complement this, when testing with secret.js you can lower `broadcastCheckIntervalMs` to `100` from the default of `6000` ([example](https://github.com/scrtlabs/secret.js/blob/70f1852/test/test.ts#L357-L360)).

## Accounts <a href="#accounts" id="accounts"></a>

LocalSecret is pre-configured with one validator and 4 accounts with SCRT balances. You can import them into your own testing environment for easier prototyping.

| Account | Address                                         | Mnemonic                                                                                                                                                     |
| ------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| a       | `secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03` | `grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar` |
| b       | `secret1fc3fzy78ttp0lwuujw7e52rhspxn8uj52zfyne` | `jelly shadow frog dirt dragon use armed praise universe win jungle close inmate rain oil canvas beauty pioneer chef soccer icon dizzy thunder meadow`       |
| c       | `secret1ajz54hz8azwuy34qwy9fkjnfcrvf0dzswy0lqq` | `chair love bleak wonder skirt permit say assist aunt credit roast size obtain minute throw sand usual age smart exact enough room shadow charge`            |
| d       | `secret1ldjxljw7v4vk6zhyduywh04hpj0jdwxsmrlatf` | `word twist toast cloth movie predict advance crumble escape whale sail such angry muffin balcony keen move employ cook valve hurt glimpse breeze brick`     |
