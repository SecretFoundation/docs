# Bridge (messaging/tokens)

Secret network has active integrations with:

* [Axelar GMP](https://docs.axelar.dev/dev/general-message-passing/overview)
  * Using IBC Hooks, a contract on Ethereum can call a contract on Secret and get a response back.
* SnakePath (GMP)
  * Relies on Secrets Privacy to open a TLS connection to any other chain (EVM for now) - find [examples under the EVM developer toolkit.](../ethereum-evm-developer-toolkit/)
* Axelar Satellite/app.squidrouter.com
  * Using the Axelar SDK users can bridge Ethereum and other EVM/Non-EVM assets into Cosmos and Secret arriving immediately as Wrapped SNIP-20 private tokens into their Secret account.
  * [Squid ](https://app.squidrouter.com)is a cheaper (gas wise) version for Axelar based bridging one can use as a widget.&#x20;
* [Andromeda Protocol](https://andromedaprotocol.io/)
  * Leveraging IBC users can utilise andromeda digital objects to improve their development speed and interact more easily with cross-chain app functionality.

Coming soon (can be expedited if needed, let us know!):

* Wormhole - via Gateway (Application was filed)
* Hyperlane - pending Cosmos release

Permissionlessly supported:

* Gravity bridge
