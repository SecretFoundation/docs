A local, instant, zero-config Secret Network blockchain.

- [What is LocalSecret?](#what-is-localsecret)
- [Prerequisites](#prerequisites)
- [Install LocalSecret](#install-localsecret)
- [Start LocalSecret](#start-localsecret)
- [Usage](#usage)
  - [secretcli](#secretcli)
  - [Faucet (AKA getting SCRT)](#faucet-aka-getting-scrt)
    - [1. Using the faucet on port 5000](#1-using-the-faucet-on-port-5000)
    - [2. Using a genesis account](#2-using-a-genesis-account)
  - [secret.js](#secretjs)
  - [Keplr](#keplr)
- [Configure LocalSecret](#configure-localsecret)
  - [Modifying node configuration](#modifying-node-configuration)
  - [Applying the changes](#applying-the-changes)
  - [Pro tip: Speed Up Block Time](#pro-tip-speed-up-block-time)
- [Accounts](#accounts)

# What is LocalSecret?

LocalSecret is a complete Secret Network testnet and ecosystem containerized with Docker. It simplifies the way secret contract developers test their contracts in a sandbox before they deploy them on a testnet or mainnet.

LocalSecret comes preconfigured with opinionated, sensible defaults for standard testing environments. If other projects mention testing on LocalSecret, they are referring to the settings defined in this repo.

LocalSecret has the following advantages over a public testnet:

- Easily modifiable world states
- Quick to reset for rapid iterations
- Simple simulations of different scenarios
- Controllable validator behavior

# Prerequisites

- [Docker](https://www.docker.com/)
- Supported known architectures: x86_64, amd64

# Install LocalSecret

```bash
docker pull ghcr.io/scrtlabs/localsecret
```

# Start LocalSecret

```bash
docker run -it -p 9091:9091 -p 26657:26657 -p 1317:1317 -p 5000:5000 \
  --name localsecret ghcr.io/scrtlabs/localsecret
```

You've now officially created a local Secret Network testnet with chain-id `secretdev-1`. :tada:

Your environment now contains:

| Protocol    | Endpoint               | Usage                                 |
| ----------- | ---------------------- | ------------------------------------- |
| RPC         | http://localhost:26657 | `secretcli`, Keplr, `cosmjs`          |
| gRPC-web    | http://localhost:9091  | `secretjs@beta`                       |
| SCRT Faucet | http://localhost:5000  | To get SCRT                           |
| LCD         | http://localhost:1317  | Keplr, `secretjs@0.17.5` (deprecated) |

Note: You can also use `docker run --rm` to launch LocalSecret. This will delete the container once you exit the terminal, but it also means that you can't edit the node's config as your can't restart the container.

# Usage

Here are some examples of how to use LocalSecret with secretcli, secret.js and Keplr.

## secretcli

To access `secretcli` from inside the docker container:

```bash
docker exec -it localsecret secretcli [command]
```

To configure your local secretcli binary:

```bash
secretcli config chain-id secretdev-1
secretcli config node http://localhost:26657
secretcli config output json
```

## Faucet (AKA getting SCRT)

To send some SCRT to the an example secret address `secret1e6mqxtwgaps7vz3qfa3fcekhh7a02hvfjvtqpt` we have to options:

### 1. Using the faucet on port 5000

```bash
ADDRESS="secret1e6mqxtwgaps7vz3qfa3fcekhh7a02hvfjvtqpt"

curl "http://localhost:5000/faucet?address=${ADDRESS}"
```

The faucet drips 1000 SCRT at a time.

### 2. Using a genesis account

Inside the docker container there are accounts `a`, `b`, `c` & `d` that are pre-seeded with SCRT and can be used to send some to your address.

```bash
ADDRESS="secret1e6mqxtwgaps7vz3qfa3fcekhh7a02hvfjvtqpt"

docker exec -it localsecret secretd tx bank send a ${ADDRESS} 1000000000uscrt -y
```

## secret.js

Connect to the chain through LocalSecret's gRPC-web endpoint.

`npm i secretjs@beta` or `yarn add secretjs@beta`, then:

```ts
import { SecretNetworkClient } from "secretjs";

const secretjs = await SecretNetworkClient.create({
  chainId: "secretdev-1",
  grpcWebUrl: "http://localhost:9091",
});
```

You can read the full secret.js docs at https://github.com/scrtlabs/secret.js#readme

## Keplr

To add a custom chain to Keplr, use this code:

```ts
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

Please note that different instances of LocalSecret need to be re-added to Keplr, so you need to first delete the old LocalSecret from Keplr and then re-run this^ code to add the current LocalSecret.

To also connect Keplr with secret.js see https://github.com/scrtlabs/secret.js#keplr-wallet

# Configure LocalSecret

## Modifying node configuration

You can modify the node configuration of your validator in the `~/.secretd/config/config.toml` and `~/.secretd/config/app.toml` files inside the container.

To enter the docker container to access them, run:

```bash
docker exec -it localsecret bash
```

You can then use commands like `sed` & `perl` to edit these files, or install text editors like `vim` & `nano` using `apt install -y vim nano`.

## Applying the changes

To appply changes that are made to the config file, restart LocalSecret by running:

```bash
docker stop localsecret
docker start -a localsecret
```

## Pro tip: Speed Up Block Time

LocalSecret is often used alongside a script written with the secret.js as a convenient way to do integration tests. You can greatly improve the experience by speeding up the block time.

To decrease block times, edit the `[consensus]` parameters in `~/.secretd/config/config.toml`, and specify your own values.

The following example configures all timeouts to `200ms`:

```diff
##### consensus configuration options #####
[consensus]

wal_file = "data/cs.wal/wal"
- timeout_propose = "3s"
- timeout_propose_delta = "500ms"
- timeout_prevote = "1s"
- timeout_prevote_delta = "500ms"
- timeout_precommit_delta = "500ms"
- timeout_commit = "5s"
+ timeout_propose = "200ms"
+ timeout_propose_delta = "200ms"
+ timeout_prevote = "200ms"
+ timeout_prevote_delta = "200ms"
+ timeout_precommit_delta = "200ms"
+ timeout_commit = "200ms"
```

You can use the following single line to configure the timeouts:

```sh
docker exec localsecret sed -E -i '/timeout_(propose|prevote|precommit|commit)/s/[0-9]+m?s/200ms/' .secretd/config/config.toml
```

To load the changes, restart LocalSecret.

# Accounts

LocalSecret is pre-configured with one validator and 4 accounts with SCRT balances. You can import them into your own testing environment for easier prototyping.

| Account | Address                                                                                                    | Mnemonic                                                                                                                                                     |
| ------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| a       | `secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03`<br/>`secretvaloper1ap26qrlp8mcq2pg6r47w43l0y8zkqm8aynpdzc` | `grant rice replace explain federal release fix clever romance raise often wild taxi quarter soccer fiber love must tape steak together observe swap guitar` |
| b       | `secret1fc3fzy78ttp0lwuujw7e52rhspxn8uj52zfyne`                                                            | `jelly shadow frog dirt dragon use armed praise universe win jungle close inmate rain oil canvas beauty pioneer chef soccer icon dizzy thunder meadow`       |
| c       | `secret1ajz54hz8azwuy34qwy9fkjnfcrvf0dzswy0lqq`                                                            | `chair love bleak wonder skirt permit say assist aunt credit roast size obtain minute throw sand usual age smart exact enough room shadow charge`            |
| d       | `secret1ldjxljw7v4vk6zhyduywh04hpj0jdwxsmrlatf`                                                            | `word twist toast cloth movie predict advance crumble escape whale sail such angry muffin balcony keen move employ cook valve hurt glimpse breeze brick`     |
