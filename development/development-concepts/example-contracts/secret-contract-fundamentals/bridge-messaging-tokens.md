# Bridge (messaging/tokens)

Secret network has active integrations with:

* [Axelar GMP](https://docs.axelar.dev/dev/general-message-passing/overview)
  * Using IBC Hooks, a contract on Ethereum can call a contract on Secret and get a response back.
* Axelar Satellite/Squid Router
  * Using the Axelar SDK users can bridge Ethereum and other EVM/Non-EVM assets into Cosmos and Secret arriving immediately as Wrapped SNIP-20 private tokens into their Secret account.
  * [Squid ](https://app.squidrouter.com)is a cheaper (gas wise) version for Axelar based bridging one can use as a widget.&#x20;
* [SecretPath](../../../ethereum-evm-developer-toolkit/basics/cross-chain-messaging/secretpath/)
  * Uses Secret's confidential computation to open a connection to any EVM chain  - find [examples under the EVM developer toolkit.](../../../ethereum-evm-developer-toolkit/)
* [Gravity Bridge](https://bridge.blockscape.network/)

Coming soon:

* [Wormhole](https://wormhole.com/)
* [Union](https://union.build/)

To access all of our current token bridging interfaces, see the [Secret Dashboard bridge page.](https://dashboard.scrt.network/bridge)
