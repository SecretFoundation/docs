# Running the Application

### Executing a Transaction

The way you interact with applications (= contracts) on a blockchain is by sending _**transactions**. A_ transaction contains the description of a specific action that should be taken on behalf of the sender.

{% hint style="info" %}
**Did you know?** Transactions aren't free! Each transaction costs a small fee, which represent how many resources were required to complete it. This cost is measured in _**gas**_ units.
{% endhint %}

Let's think back to our problem now. We have two millionaires: Alice and Bob. They want to know who is richer, without revealing their own net worth to each other. To do this, we will ask each of them to submit a transaction to the contract we deployed in the earlier stage. On Secret Network all contract transactions are encrypted and private by default. This means that Alice cannot see Bob's data, and vice-versa.&#x20;

For Alice:&#x20;

```
secretcli tx compute execute secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg '{"submit_net_worth": {"name": "Alice", "worth": 2000000}}' --from a -y
```

For Bob:&#x20;

```
secretcli tx compute execute secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg '{"submit_net_worth": {"name": "Bob", "worth": 1300000}}' --from b -y
```

{% hint style="info" %}
**Did you know?** Transactions are executed by all the nodes on the blockchain concurrently! The process of making sure everyone got the same result is called _consensus._
{% endhint %}

Each of these transactions should have generated output similar to this:

```json
{"height":"0","txhash":"E32C5CB40969365D54F95BB7B7B5F0DDA53621DAF0D32DC0BBAD2B597B5AE0CA","codespace":"","code":0,"data":"","raw_log":"[]","logs":[],"info":"","gas_wanted":"0","gas_used":"0","tx":null,"timestamp":"","events":[]}
```

{% hint style="success" %}
**Pro Tip:** SecretCLI automatically encrypts transactions. Only the transaction sender can see the data being sent (and the result). You can think of this as how HTTPS protects your data in transit when accessing a web page
{% endhint %}

### Querying the Result

Now that both Alice and Bob submitted their net worth to the contract, we can now finally ask the contract to tell us who is richer. We achieve this, by using something called a _**query**_. You can think of queries as questions you can ask an application running on the blockchain. Queries are only run by a single node and cannot change any data. They merely return results based on data as it is currently stored on the blockchain.

```
secretcli q compute query secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg '{"who_is_richer": {}}'
```

If you've done everything correctly, you should now see the final result -

```json
{"richer": "Alice"}
```

### Next Steps

Congratulations! You completed the tutorial and successfully solved the Millionaire's problem using a Secret Contract! The contract is the business logic that powers a blockchain application, but a full application contains other components as well. If you want to learn more about Secret Contracts, or explore what you just did more in depth, feel free to explore these awesome resources:

* [Millionaire's problem breakdown](millionaires-problem-breakdown-extra-credit.md) - explains how our Secret Contract works
* [Intro to Secret Contracts](https://docs.scrt.network/secret-network-documentation/development/intro-to-secret-contracts) - a more in-depth Secret Contract guide
* [CosmWasm Documentation](https://docs.cosmwasm.com/docs/1.0/) - everything you want to know about CosmWasm
* [Secret.JS](https://docs.scrt.network/secret-network-documentation/development/secretjs/templates) - Building a web UI for a Secret Contract
