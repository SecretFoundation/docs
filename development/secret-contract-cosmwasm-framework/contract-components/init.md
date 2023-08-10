---
description: An explainer of the Instantiate file inside of the CosmWasm code framework
---

# Instantiation Message

## What Is Instantiation?

The Instantiate function is the function that will run once (and only once) immediately upon initializing your smart contract after uploading it to the network. It is meant to set up the smart contract with all vital code that must be run first before any users have the ability to execute the contract. For those familiar with a solidity constructor on Ethereum, Instantiate serves the exact same purpose.

If you have any vital info to save to the state such as Config parameters or an admin/operator address to name a few options, those should probably be specified here. In addition, if your contract requires entropy for randomization or needs to register to receive a SNIP-20 token for payment, those operations should also be performed here, as other execution messages will rely on that data to be already instantiated.

**Instantiate** takes four arguments:&#x20;

<pre class="language-rust"><code class="lang-rust"><strong>#[entry_point]
</strong>pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: Empty,
) -> StdResult&#x3C;Response> {
    Ok(Response::new())
}
</code></pre>

* `"deps"`:  allows the contract to interact with the outside world by reading and updating the contract state, accessing other contract states, and using helper functions to work with contract addresses.
* `"env":`  is an object that represents the current state of the blockchain when the contract is executed, including the blockchain's height, timestamp, and the address of the contract being called.
* `"info"`: metadata about the message that triggered the contract's execution, such as the sender's address and the native tokens that were sent with the message.
* `"msg":` is the message that triggers the contract's execution, which is currently represented by the "Empty" type in the codeblock above.&#x20;
