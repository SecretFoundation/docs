---
description: >-
  Learn how to use SecretCLI to handle messages to query and modify contract
  state.
---

# Running the Application

## Contract Messages

The way you interact with contracts on a blockchain is by sending contract _****_** messages**_. A_ message contains the JSON description of a specific action that should be taken on behalf of the sender, and in most Rust smart contracts they are defined in the `msg.rs` file.&#x20;

In our `msg.rs` file,  there are two enums: `ExecuteMsg`, and `QueryMsg`. They are enums because each variant of them represents a different message which can be sent. For example, the `ExecuteMsg::Increment` corresponds to the `try_increment` message in our `contract.rs` file.

In the previous section, we compiled, uploaded and instantiated our counter smart contract. Now we are going to query the contract and also execute messages to update the contract state. Let's start by querying the counter contract we instantiated.&#x20;

### Query Message

A **Query Message** is used to request information from a contract; unlike `execute messages`, query messages do not change contract state, and are used just like database queries. You can think of queries as questions you can ask a smart contract.&#x20;

Let's query our counter smart contract to return the current count. It should be 1, because that was the count we instantiated in the previous section. We query the count by calling the Query Message `get_count {}`, which is defined in our msg.rs file.&#x20;

<pre><code><strong>secretcli query compute query secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg '{"get_count": {}}'
</strong></code></pre>

The query returns:&#x20;

```json
{"count": "1"}
```

Great! Now that we have queried the contract's starting count, let's execute an `increment{}` message to modify the contract state.&#x20;

### Execute Message

An **Execute Message** is used for handling messages which modify contract state. They are used to perform actual actions.&#x20;

{% hint style="info" %}
**Did you know?** Messages aren't free! Each transaction costs a small fee, which represents how many resources were required to complete it. This cost is measured in _**gas**_ units.
{% endhint %}

The counter contract consists of two execute messages: `increment{}`, which increments the count by 1,  and `reset{}`, which resets the count to any `i32` you want. The current count is 1, let's call the Execute Message `increment{}` to increase the contract count by 1:&#x20;

```
secretcli tx compute execute secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg '{"increment": {}}' --from myWallet
```

{% hint style="success" %}
**Pro Tip:** SecretCLI automatically encrypts transactions. Only the transaction sender can see the data being sent (and the result). You can think of this as how HTTPS protects your data in transit when accessing a web page.
{% endhint %}

SecretCLI will ask you to confirm the transaction before signing and broadcasting. Upon successful confirmation of the transaction, the terminal will return a `transaction hash` representing your transaction:

<figure><img src="../../.gitbook/assets/LocalSecret - transaction hash.png" alt=""><figcaption><p>confirming a transaction using SecretCLI</p></figcaption></figure>

Nice work! Now we can query the contract once again to see if the contract state was successfully incremented by 1:&#x20;

```
secretcli query compute query secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg '{"get_count": {}}'
```

The query returns:&#x20;

```json
{"count": "2"}
```

Now, we will call one final execute message, `reset{}`. This will reset the count to an `i32` __ that we specify. I am going to reset the count to 0 by running the following code in SecretCLI:&#x20;

```
secretcli tx compute execute secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg '{"reset": {"count": 0}}' --from myWallet
```

{% hint style="warning" %}
Make sure your JSON message is formatted properly!

**`` '{"reset": {"count": 0}}` ``**
{% endhint %}

The query returns:&#x20;

```json
{"count": "0"}
```

Way to go! You have now successfully interacted with a Secret Network smart contract using SecretCLI.&#x20;

### Next Steps

Congratulations! You completed the tutorial and successfully compiled, uploaded, deployed and executed a Secret Contract! The contract is the business logic that powers a blockchain application, but a full application contains other components as well. If you want to learn more about Secret Contracts, or explore what you just did more in depth, feel free to explore these awesome resources:

* [Secret University counter contract breakdown ](https://github.com/secretuniversity/secret-counter-vuejs-box/blob/main/app/tutorial/guide.md)- explains the counter contract in depth
* [Millionaire's problem breakdown](https://docs.scrt.network/secret-network-documentation/development/secret-by-example/millionaires-problem) - explains how a Secret Contract works
* [CosmWasm Documentation](https://book.cosmwasm.com/) - everything you want to know about CosmWasm
* [Secret.JS](https://docs.scrt.network/secret-network-documentation/development/secretjs/templates) - Building a web UI for a Secret Contract
