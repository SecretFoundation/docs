---
description: >-
  General Overview of Inter-Contract Interaction. Note: This section is
  incomplete, and is a work-in-progress and will be actively expanded upon
---

# Inter contract interactions

While Inter-Contract communication may seem complex to those coming from Solidity or even other Cosmos Ecosystems, it is simple when using the proper tools.

## Why is this different to other Cosmos chains?

Unlike other Cosmos chains, Secret requires the hash of the smart contract in addition to the address when executing calls to smart contracts. For a user, the interaction with the code hash is transparent, but it is something that is important when writing Secret Contracts and dApps, since we need to include this code hash when we call another contract.

Contract hashes are what binds a transaction to the specific contract code being called. Otherwise, it would be possible to perform a replay attack in a forked chain with a modified contract that decrypts and prints the input message.

## How to Get a Contract Hash

### SecretCLI

One way to manually get the hash of a contract is with SecretCLI. Simply use the following command:

```
secretcli q compute contract-hash secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek
```

### REST

Another way is via the REST API.

```
curl http://api.scrt.network/wasm/contract/secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek/code-hash
```

### SecretJS

Lastly, if you are developing using SecretJS (or any other sdk) you can programmatically fetch the contract hash using the code-id (the identifier of the code you [_stored_](../../getting-started/compile-and-deploy.md#storing-the-contract)_)_

```
const contractCodeHash = await secretjs.query.compute.codeHash(codeId);
```

## Calling a Contract

Having said all that, calling a contract from another contract is not too different from what you would expect from a CosmWasm contract. The following is an example of calling a contract when you don't care about getting a response (or you are using manual callbacks, and not sub-messages):

<pre class="language-rust"><code class="lang-rust"><strong>// initialize an empty vector
</strong><strong>let mut messages = vec![];
</strong>
// push the new contract execute message
messages.extend(vec![CosmosMsg::Wasm(WasmMsg::Execute {
    contract_addr: msg.bank_address,
    // note this is where we include the target contract's code hash
    callback_code_hash: msg.bank_code_hash,
    // optional data to pass to the target contract
    msg: to_binary(&#x26;bank_msg::HandleMsg::UpdateGameAddress {
        address: env.contract.address.clone(),
    })?,
    send: vec![],
})]);
 
Ok(InitResponse {
    messages,
    log: vec![],
})
</code></pre>

{% hint style="info" %}
This snippet is from [SecretJack ](https://github.com/scrtlabs/SecretJack/blob/5ed8efb89cbb4ec35cd6254deff5f05f71b5e9d0/contract/game/src/contract.rs#L55)- a Proof-of-Concept on-chain Blackjack game
{% endhint %}
