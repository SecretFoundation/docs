---
description: Learn how to integrate various web3 wallets with SecretJS.
---

# Wallet Integrations

## Secret Network Client Setup

```javascript
import { SecretNetworkClient, Wallet } from "secretjs";

const wallet = new Wallet("Your mnemonic words go here");

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});
```

## Metamask

```ts
import { SecretNetworkClient, MetaMaskWallet } from "secretjs";

//@ts-ignore
const [ethAddress] = await window.ethereum.request({
  method: "eth_requestAccounts",
});

const wallet = await MetaMaskWallet.create(window.ethereum, ethAddress);

const secretjs = new SecretNetworkClient({
  url: "TODO get from https://github.com/scrtlabs/api-registry",
  chainId: "secret-4",
  wallet: wallet,
  walletAddress: wallet.address,
});
```

Notes:

1. MetaMask supports mobile!
2. MetaMask supports Ledger.
3. Secretjs `MetaMaskWallet` will automatically prompt the user to sign a `personal_sign` message, which is used to recover the users public key and derive the user's Secret Network address.&#x20;
4. You might want to pass `encryptionSeed` to `SecretNetworkClient.create()` to use the same encryption key for the user across sessions. This value should be a true random 32 byte number that is stored securly in your app, such that only the user can decrypt it. This can also be a `sha256(user_password)` but might impair UX.
5. See Keplr's [`getOfflineSignerOnlyAmino()`](https://secretjs.scrt.network/#windowkeplrgetofflinesigneronlyamino) for list of unsupported transactions.

<figure><img src="https://secretjs.scrt.network/media/metamask-signing-example.jpg" alt="" width="375"><figcaption></figcaption></figure>

## Keplr Wallet

The recommended way of integrating Keplr is by using `window.keplr.getOfflineSignerOnlyAmino()`:

```ts
import { SecretNetworkClient } from "secretjs";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

while (
  !window.keplr ||
  !window.getEnigmaUtils ||
  !window.getOfflineSignerOnlyAmino
) {
  await sleep(50);
}

const CHAIN_ID = "secret-4";

await window.keplr.enable(CHAIN_ID);

const keplrOfflineSigner = window.keplr.getOfflineSignerOnlyAmino(CHAIN_ID);
const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();

const url = "TODO get from https://github.com/scrtlabs/api-registry";

const secretjs = new SecretNetworkClient({
  url,
  chainId: CHAIN_ID,
  wallet: keplrOfflineSigner,
  walletAddress: myAddress,
  encryptionUtils: window.keplr.getEnigmaUtils(CHAIN_ID),
});

// Note: Using `window.getEnigmaUtils` is optional, it will allow
// Keplr to use the same encryption seed across sessions for the account.
// The benefit of this is that `secretjs.query.getTx()` will be able to decrypt
// the response across sessions.
```

Notes:

1. No mobile support yet.
2. Keplr supports Ledger.
3. By using `encryptionUtils` you let Keplr handle user encryption keys for you, which allows you to easily decrypt transactions across sessions.

Links:

* [**Official Keplr Website »**](https://www.keplr.app/)
* [**Keplr API Docs »**](https://docs.keplr.app/api)

[`SignerOnlyAmino` vs `Signer` vs `SignerAuto`](https://secretjs.scrt.network/#signeronlyamino-vs-signer-vs-signerauto)

TLDR:

* [`getOfflineSignerOnlyAmino()`](https://secretjs.scrt.network/#windowkeplrgetofflinesigneronlyamino): The recommended way. Supports Ledger, has a nice UI.
* [`getOfflineSigner()`](https://secretjs.scrt.network/#windowkeplrgetofflinesigner): No Ledger support, ugly UI, can send IBC **relayer** txs and submit IBC gov proposals.
* [`getOfflineSignerAuto()`](https://secretjs.scrt.network/#windowkeplrgetofflinesignerauto): If Ledger alias for `getOfflineSignerOnlyAmino()`, otherwise alias for `getOfflineSigner()`.

[**`window.keplr.getOfflineSignerOnlyAmino()`**](https://secretjs.scrt.network/#windowkeplrgetofflinesigneronlyamino)

Although this is the legacy way of signing transactions on cosmos-sdk, it's still the most recommended for connecting to Keplr due to Ledger support & better UI on Keplr.

* 🟩 Looks good on Keplr
* 🟩 Supports users signing with Ledger
* 🟥 Doesn't support signing these transactions:
  * Every tx type under `ibc_client`, `ibc_connection` and `ibc_channel` (meaning IBC relaying, for example with [ts-relayer](https://github.com/confio/ts-relayer))
  * [gov/MsgSubmitProposal/ClientUpdateProposal](https://secretjs.scrt.network/enums/ProposalType#ClientUpdateProposal)
  * [gov/MsgSubmitProposal/UpgradeProposal](https://secretjs.scrt.network/enums/ProposalType#UpgradeProposal)

Note that [ibc\_transfer/MsgTransfer](https://secretjs.scrt.network/classes/MsgTransfer) for sending funds across IBC **is** supported.

<figure><img src="https://secretjs.scrt.network/media/keplr-amino.png" alt="" width="375"><figcaption></figcaption></figure>

[**`window.keplr.getOfflineSigner()`**](https://secretjs.scrt.network/#windowkeplrgetofflinesigner)

The new way of signing transactions on cosmos-sdk, it's more efficient but still doesn't have Ledger support, so it's most recommended for usage in apps that don't require signing transactions with Ledger.

* 🟥 Looks bad on Keplr
* 🟥 Doesn't support users signing with Ledger
* 🟩 Supports signing transactions with all types of Msgs

[**`window.keplr.getOfflineSignerAuto()`**](https://secretjs.scrt.network/#windowkeplrgetofflinesignerauto)

<figure><img src="https://secretjs.scrt.network/media/keplr-proto.png" alt="" width="375"><figcaption></figcaption></figure>

If the connected Keplr account uses Ledger, returns `window.keplr.getOfflineSignerOnlyAmino()`.\
Otherwise returns `window.keplr.getOfflineSigner()`.

## Fina Wallet

Fina implements the Keplr API, so [the above Keplr docs](https://secretjs.scrt.network/#keplr-wallet) applies. If you support Keplr, your app will also work on the Fina Wallet mobile app. This works because the Fina Wallet mobile app has webview to which it injects its objects under `window.keplr`.

Fina supports deep linking into its in-app browser.

Example1: `fina://wllet/dapps?network=secret-4&url=https%3A%2F%2Fdash.scrt.network`

Example2:

If a user accessed your app using a regular mobile browser, you can open your app in the Fina in-app browser using this code:

```ts
const urlSearchParams = new URLSearchParams();
urlSearchParams.append("network", "secret-4");
urlSearchParams.append("url", window.location.href);

window.open(`fina://wllet/dapps?${urlSearchParams.toString()}`, "_blank");
```

Links:

* [**Official Fina Website »**](https://fina.cash/)

## Leap Cosmos Wallet

The recommended way of integrating Leap is by using `window.leap.getOfflineSignerOnlyAmino()`:

```ts
import { SecretNetworkClient } from "secretjs";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

while (
  !window.leap ||
  !window.leap.getEnigmaUtils ||
  !window.leap.getOfflineSignerOnlyAmino
) {
  await sleep(50);
}

const CHAIN_ID = "secret-4";

await window.leap.enable(CHAIN_ID);

const leapOfflineSigner = window.leap.getOfflineSignerOnlyAmino(CHAIN_ID);
const [{ address: myAddress }] = await leapOfflineSigner.getAccounts();

const url = "TODO get from https://github.com/scrtlabs/api-registry";

const secretjs = new SecretNetworkClient({
  url,
  chainId: CHAIN_ID,
  wallet: leapOfflineSigner,
  walletAddress: myAddress,
  encryptionUtils: window.leap.getEnigmaUtils(CHAIN_ID),
});

// Note: Using `window.leap.getEnigmaUtils()` is optional, it will allow
// Leap to use the same encryption seed across sessions for the account.
// The benefit of this is that `secretjs.query.getTx()` will be able to decrypt
// the response across sessions.
```

Links:

* [**Official Leap Website »**](https://www.leapwallet.io/cosmos)
* [**Leap API Docs »**](https://docs.leapwallet.io/cosmos/connect-to-leap/introduction)

## Starshell Wallet

StarShell implements the Keplr API, so [the above Keplr docs](https://secretjs.scrt.network/#keplr-wallet) applies. If you support Keplr, your app will also work on StarShell wallet. This works because StarShell wallet asks the user to turn off Keplr and then overrides `window.keplr` with its objects.

Links:

* [**Official StarShell Website »**](https://starshell.net/)

## Ledger Wallet

`@cosmjs/ledger-amino` can be used to sign transactions with a Ledger wallet running the Cosmos app.

```ts
import { SecretNetworkClient } from 'secretjs';
import { makeCosmoshubPath } from "@cosmjs/amino";
import { LedgerSigner } from "@cosmjs/ledger-amino";

// NodeJS only
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";

// Browser only
//import TransportNodeHid from "@ledgerhq/hw-transport-webusb";

const interactiveTimeout = 120_000;
const accountIndex = 0;
const cosmosPath = makeCosmoshubPath(accountIndex);

const ledgerTransport = await TransportNodeHid.create(interactiveTimeout, interactiveTimeout);
const ledgerSigner = new LedgerSigner(
  ledgerTransport,
  {
    testModeAllowed: true,
    hdPaths: [cosmosPath],
    prefix: 'secret'
  }
);
const [{ address }] = await signer.getAccounts();

const client = new SecretNetworkClient({
  url: "TODO get from https://github.com/scrtlabs/api-registry",
  chainId: "secret-4",
  wallet: ledgerSigner,
  walletAddress: address,
});
```

Notes:

1. Use the appropriate `hw-transport` package for your environment (Node or Browser)
2. The Ledger Cosmos app only supports coin type 118
3. You might want to pass `encryptionSeed` to `SecretNetworkClient.create()` to use the same encryption key for the user across sessions. This value should be a true random 32 byte number that is stored securly in your app, such that only the user can decrypt it. This can also be a `sha256(user_password)` but might impair UX.
4. See Keplr's [`getOfflineSignerOnlyAmino()`](https://secretjs.scrt.network/#windowkeplrgetofflinesigneronlyamino) for list of unsupported transactions.

Links:

* [**@cosmjs/ledger-amino Documentation** ](https://cosmos.github.io/cosmjs/latest/ledger-amino/)
