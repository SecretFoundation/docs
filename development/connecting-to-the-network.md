# Connecting to the Network

### Secret Network API Registry

* [secret-4 mainnet](connecting-to-the-network.md#secret-4-mainnet)
  * [Binaries](connecting-to-the-network.md#binaries)
  * [Explorers](connecting-to-the-network.md#explorers)
  * [API endpoints](connecting-to-the-network.md#api-endpoints)
  * [Seed nodes](connecting-to-the-network.md#seed-nodes)
* [pulsar-2 testnet](connecting-to-the-network.md#pulsar-2-testnet)
  * [Binaries](connecting-to-the-network.md#binaries)
  * [Explorers](connecting-to-the-network.md#explorers)
  * [Faucets](connecting-to-the-network.md#faucets)
  * [API endpoints](connecting-to-the-network.md#api-endpoints-1)
  * [Peer nodes](connecting-to-the-network.md#peer-nodes)
* [Usage examples](connecting-to-the-network.md#usage-examples)
  * [RPC](connecting-to-the-network.md#rpc)
  * [gRPC-web](connecting-to-the-network.md#grpc-web)
  * [LCD](connecting-to-the-network.md#lcd)
  * [Seeds](connecting-to-the-network.md#seeds)
  * [Peers](connecting-to-the-network.md#peers)

{% hint style="success" %}
**Are we missing your endpoint or tool?** Submit a Pull Request at [https://github.com/SecretFoundation/docs/blob/gitbook/development/api-endpoints.md](api-endpoints.md)
{% endhint %}

## Secret-4 mainnet

### Binaries

* [https://github.com/scrtlabs/SecretNetwork/releases/](https://github.com/scrtlabs/SecretNetwork/releases/)

### Explorers

* [https://secretnodes.com/secret](https://secretnodes.com/secret)
* [https://www.mintscan.io/secret](https://www.mintscan.io/secret)
* [https://ping.pub/secret](https://ping.pub/secret)

### API endpoints

{% hint style="warning" %}
⚠️ These endpoints are offered to the public for free, please be mindful and don't spam them. The recommended endpoint for high traffic applications is [https://secret.express](https://secret.express), a combined endpoint maintained by multiple Secret validator teams and funded via governance.
{% endhint %}



| Type     | API                                                 | Courtesy of                                                                                                                                        |
| -------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| RPC      | `https://rpc.secret.express`                        | [secret.express](https://secret.express)                                                                                                           |
| RPC      | `https://scrt.public-rpc.com`                       | [Ankr](https://scrt.public-rpc.com/)                                                                                                               |
| RPC      | `https://secret-4.api.trivium.network:26657`        | [Trivium \| Trivium.Network](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1ahawe276d250zpxt0xgpfg63ymmu63a0svuvgw) |
| RPC      | `https://rpc.spartanapi.dev`                        | [secretnodes.com ❄️☄️](https://secretnodes.com/secret/validators/secretvaloper1hjd20hjvkx06y8p42xl0uzr3gr3ue3nkvd79jj)                             |
| RPC      | `https://scrt-rpc.blockpane.com` (archive node)     | [\[block pane\]](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1tmtcu980raqvypdf0dd6hsgh6qcm7ex7l29u58)             |
| RPC      | `https://rpc.secret.forbole.com/`                   | [Forbole](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1kvp570cd6zvzh8ffrhz7lmytt6v6u2gxz8tl0g)                    |
| RPC      | `https://secret.rpc.consensus.one`                  | [Consensus One](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1sa8av4qw3xerr58kwvnm8wvd87zgp36mv6cnyg)              |
| RPC      | `https://secretnetwork-rpc.stakely.io`              | [Stakely.io](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1vzkdmu0sa8gaj686jh5all7hpmmsp8x87vyz8z)                 |
| RPC      | `https://scrt-rpc.agoranodes.com`                   | [AgoraNodes.com](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1xmu8meef8ynlsev3a9hpl5wdxhpzzj0efmzpcj)             |
| RPC      | `https://secret-rpc.lavenderfive.com:443`           | [Lavender.Five Nodes 🐝](https://github.com/LavenderFive)                                                                                          |
| gRPC-web | `https://wgrpc.secret.express`                      | [secret.express](https://secret.express)                                                                                                           |
| gRPC-web | `https://secret-4.api.trivium.network:9091`         | [Trivium \| Trivium.Network](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1ahawe276d250zpxt0xgpfg63ymmu63a0svuvgw) |
| gRPC-web | `https://wgrpc.spartanapi.dev`                      | [secretnodes.com ❄️☄️](https://secretnodes.com/secret/validators/secretvaloper1hjd20hjvkx06y8p42xl0uzr3gr3ue3nkvd79jj)                             |
| gRPC-web | `http://scrt-rpc.blockpane.com:9091` (archive node) | [\[block pane\]](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1tmtcu980raqvypdf0dd6hsgh6qcm7ex7l29u58)             |
| gRPC-web | `https://grpc.mainnet.secretsaturn.net`             | [🪐 𝕊ecret 𝕊aturn](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1q0rth4fu4svxnw63vjd7w74nadzsdp0fmkhj3d)         |
| gRPC-web | `https://scrt-grpc.agoranodes.com`                  | [AgoraNodes](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1xmu8meef8ynlsev3a9hpl5wdxhpzzj0efmzpcj)                 |
| gRPC     | `https://grpc.spartanapi.dev`                       | [secretnodes.com ❄️☄️](https://secretnodes.com/secret/validators/secretvaloper1hjd20hjvkx06y8p42xl0uzr3gr3ue3nkvd79jj)                             |
| gRPC     | `https://grpc.secret.forbole.com/`                  | [Forbole](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1kvp570cd6zvzh8ffrhz7lmytt6v6u2gxz8tl0g)                    |
| gRPC     | `https://secret-grpc.lavenderfive.com:443`          | [Lavender.Five Nodes 🐝](https://github.com/LavenderFive)                                                                                          |
| LCD      | `https://lcd.secret.express`                        | [secret.express](https://secret.express)                                                                                                           |
| LCD      | `https://secret-4.api.trivium.network:1317`         | [Trivium \| Trivium.Network](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1ahawe276d250zpxt0xgpfg63ymmu63a0svuvgw) |
| LCD      | `https://scrt-lcd.blockpane.com` (archive node)     | [\[block pane\]](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1tmtcu980raqvypdf0dd6hsgh6qcm7ex7l29u58)             |
| LCD      | `https://api.secret.forbole.com/`                   | [Forbole](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1kvp570cd6zvzh8ffrhz7lmytt6v6u2gxz8tl0g)                    |
| LCD      | `https://lcd.spartanapi.dev`                        | [secretnodes.com ❄️☄️](https://secretnodes.com/secret/validators/secretvaloper1hjd20hjvkx06y8p42xl0uzr3gr3ue3nkvd79jj)                             |
| LCD      | `https://secret.api.consensus.one`                  | [Consensus One](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1sa8av4qw3xerr58kwvnm8wvd87zgp36mv6cnyg)              |
| LCD      | `https://secretnetwork-lcd.stakely.io`              | [Stakely.io](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1vzkdmu0sa8gaj686jh5all7hpmmsp8x87vyz8z)                 |
| LCD      | `https://scrt-lcd.agoranodes.com`                   | [AgoraNodes](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1xmu8meef8ynlsev3a9hpl5wdxhpzzj0efmzpcj)                 |
| LCD      | `https://secret-api.lavenderfive.com:443`           | [Lavender.Five Nodes 🐝](https://github.com/LavenderFive)                                                                                          |

{% hint style="info" %}
Additional API nodes may be found in the [Cosmos chain registry](https://github.com/cosmos/chain-registry/blob/master/secretnetwork/chain.json)&#x20;
{% endhint %}

### Seed nodes

* `6fb7169f7630da9468bf7cc0bcbbed1eb9ed0d7b@scrt-seed-01.scrtlabs.com:26656`
* `ab6394e953e0b570bb1deeb5a8b387aa0dc6188a@scrt-seed-02.scrtlabs.com:26656`
* `9cdaa5856e0245ecd73bd464308fb990fbc53b57@scrt-seed-03.scrtlabs.com:26656`
* `20e1000e88125698264454a884812746c2eb4807@seeds.lavenderfive.com:17156`
* `ebc272824924ea1a27ea3183dd0b9ba713494f83@secret.mainnet.seed.autostake.net:26656`

### pulsar-2 testnet

### Binaries

* [https://github.com/scrtlabs/SecretNetwork/releases/v1.4.1-beta-2](https://github.com/scrtlabs/SecretNetwork/releases/v1.4.1-beta-2) (use the testnet binaries)

### Explorers

* [https://secretnodes.com/pulsar](https://secretnodes.com/pulsar)
* [https://testnet.ping.pub/secret](https://testnet.ping.pub/secret)

### Faucets

* [https://faucet.secrettestnet.io](https://faucet.secrettestnet.io/)
* [https://faucet.pulsar.scrttestnet.com](https://faucet.pulsar.scrttestnet.com/)

### API endpoints

| Type     | API                                          | Courtesy of                                                                                                                                        |
| -------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| RPC      | `https://rpc.testnet.secretsaturn.net`       | [🪐 𝕊ecret 𝕊aturn](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1q0rth4fu4svxnw63vjd7w74nadzsdp0fmkhj3d)         |
| RPC      | `https://rpc.pulsar.scrttestnet.com`         | SCRT Testnet Committee                                                                                                                             |
| GRPC     | `http://grpcbin.pulsar.scrttestnet.com:9099` | SCRT Testnet Committee                                                                                                                             |
| gRPC-web | `https://grpc.testnet.secretsaturn.net`      | [🪐 𝕊ecret 𝕊aturn](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1q0rth4fu4svxnw63vjd7w74nadzsdp0fmkhj3d)         |
| gRPC-web | `https://grpc.pulsar.scrttestnet.com`        | SCRT Testnet Committee                                                                                                                             |
| LCD      | `http://testnet.securesecrets.org:1317`      | [Trivium \| Trivium.Network](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1ahawe276d250zpxt0xgpfg63ymmu63a0svuvgw) |
| LCD      | `https://lcd.testnet.secretsaturn.net`       | [🪐 𝕊ecret 𝕊aturn](https://wallet.keplr.app/#/secret/stake?modal=detail\&validator=secretvaloper1q0rth4fu4svxnw63vjd7w74nadzsdp0fmkhj3d)         |
| LCD      | `https://api.pulsar.scrttestnet.com`         | SCRT Testnet Committee                                                                                                                             |

### Peer nodes

* `7a421a6f5f1618f7b6fdfbe4854985746f85d263@108.62.104.102:26656`
* `a72e376dca664bac55e8ce55a2e972a8ae2c995e@144.202.126.98:26656`
* `a941999e72f4726d276ef055a09cb8bedf8e7a9a@45.35.77.30:26656`
* `f95ba3da4a9eec559397f4b47b1539e24af6904c@52.190.249.47:26656`
* `cd2f8266380c6587989f62308434d679928622ac@178.162.151.73:26656`
* `6cf03ad11825d71b4c03e9c83b4cb65f29f63072@178.162.151.71:26656`
* `29bb32d07d3e749f24226653a447f43e69502a1a@212.7.211.39:26656`

### Usage examples

### RPC

With `secretcli` (replace `"$URL"`):

```
$ secretcli config node "$URL"
$ secretcli config chain-id secret-4 # or pulsar-2
```

Or:

```
$ secretcli status --node "$URL" --chain-id secret-4 # or --chain-id pulsar-2
```

### gRPC-web

With `secretjs@beta` (replace `"$URL"`):

```
import { SecretNetworkClient } from "secretjs";

const grpcWebUrl = "$URL";
const chainId = "secret-4"; // or "pulsar-2"

// Readonly Client
const secretjs = await SecretNetworkClient.create({
  grpcWebUrl,
  chainId,
});

// Or a signer client with Keplr integration
await window.keplr.enable(chainId);
const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();

const secretjs = await SecretNetworkClient.create({
  grpcWebUrl,
  chainId,
  wallet: window.getOfflineSignerOnlyAmino(chainId),
  walletAddress: myAddress,
  encryptionUtils: window.getEnigmaUtils(chainId),
});
```

### LCD

Swagger/OpenAPI UI can be found under `$URL/swagger/` and `$URL/openapi/`.

With (the deprecated) `secretjs` (replace `"$URL"`):

```
import { CosmWasmClient, SigningCosmWasmClient } from "secretjs";

const lcdUrl = "$URL";
const chainId = "secret-4"; // or "pulsar-2"

// Readonly Client
const queryJs = new CosmWasmClient(lcdUrl);

// Or a signer client with Keplr integration
await window.keplr.enable(chainId);
const offlineSigner = window.getOfflineSigner(chainId);
const enigmaUtils = window.getEnigmaUtils(chainId);
const accounts = await offlineSigner.getAccounts();

const secretJS = new SigningCosmWasmClient(
  lcdUrl,
  accounts[0].address,
  offlineSigner,
  enigmaUtils
);
```

### Seeds

Usage example:

```
$ perl -i -pe 's/^seeds =.*/seeds = "${URL_1},${URL_2},${URL_3}"/' ~/.secretd/config/config.toml
```

Note that when you initialize a node with `secretd init --chain-id secret-4` these seeds are automatically populated into `~/.secretd/config/config.toml`.

### Peers

Usage example:

```
$ perl -i -pe 's/^persistent_peers =.*/persistent_peers = "${URL_1},${URL_2},${URL_3}"/' ~/.secretd/config/config.toml
```
