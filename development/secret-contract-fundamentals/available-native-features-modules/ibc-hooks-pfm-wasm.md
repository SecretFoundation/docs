# IBC (Hooks, PFM, Wasm)

Secret supports IBC-Go v4 and several additional tools and middleware. ICA is supported but functions are not yet enabled nor is the host module live, if you need this please reach out to the Devrel team via discord or Telegram.\
\
Tools supported:

* [IBC hooks](../../ibc/ibc-hooks/) by Osmosis Labs -  Secret - v1.11
  * WASM hooks: allows ICS-20 token transfers to initiate contract calls, serving various use cases.
    * Example: Sending tokens to Secret and immediately wrapping them as SNIP-20 token. For example, `ATOM on Hub -> ATOM on Secret -> sATOMS on Secret` (2 transactions on 2 chains) now becomes `ATOM on Hub -> sATOM on Secret` (1 transaction).
      * Example: Cross-chain swaps. Using IBC Hooks, an AMM on Secret can atomically swap tokens that originated on a different chain and are headed to Secret. The AMM can also send those tokens back to the originating chain.
      * [Axelar GMP](https://docs.axelar.dev/dev/general-message-passing/overview): Using IBC Hooks, a contract on Ethereum can call a contract on Secret and get a response back.
      * Ack callbacks: allow non-IBC contracts that send an `IbcMsg::Transfer` to listen for the ack/timeout of the token transfer. This allows these contracts to definitively know whether the transfer was successful or not and act accordingly (refund if failed, continue if succeeded). See usage example [here](https://github.com/scrtlabs/secret.js/blob/4293219/test/ibc-hooks-contract/src/contract.rs#L47-L91).
* Packet forward middleware (PMF) by Strangelove - Secret v1.9
  * Other chains are able to more easily route SCRT in the interchain. For example, sending SCRT from Osmosis to Hub now becomes a single transaction from `Osmosis -> Secret` rather than a transaction from `Osmosis -> Secret`, then a transaction from `Secret -> Hub`.
