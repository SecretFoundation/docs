# Usage examples

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

