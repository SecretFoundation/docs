# Running the Application

### Executing a Transaction

The way you interact with contracts on a blockchain is by sending contract _**messages**. A_ message contains the description of a specific action that should be taken on behalf of the sender.

{% hint style="info" %}
**Did you know?** Messages aren't free! Each transaction costs a small fee, which represent how many resources were required to complete it. This cost is measured in _**gas**_ units.
{% endhint %}

#### Execute the increment message

```
secretcli tx compute execute $CONTRACT '{"increment": {}}' --from myWallet --keyring-backend test
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

Now that we have called the increment message on the contract, we can now **query** the contract to see that it has been incremented. You can think of queries as questions you can ask an application running on the blockchain. Queries are only run by a single node and cannot change any data. They merely return results based on data as it is currently stored on the blockchain.

```
secretcli query compute query secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg '{"get_count": {}}'
```

If you've done everything correctly, you should now see the final result -

```json
{"count": "101"}
```

### Next Steps

Congratulations! You completed the tutorial and successfully deployed and executed a Secret Contract! The contract is the business logic that powers a blockchain application, but a full application contains other components as well. If you want to learn more about Secret Contracts, or explore what you just did more in depth, feel free to explore these awesome resources:

* [Millionaire's problem breakdown](millionaires-problem-breakdown-extra-credit.md) - explains how a Secret Contract works
* [Intro to Secret Contracts](https://docs.scrt.network/secret-network-documentation/development/intro-to-secret-contracts) - a more in-depth Secret Contract guide
* [CosmWasm Documentation](https://docs.cosmwasm.com/docs/1.0/) - everything you want to know about CosmWasm
* [Secret.JS](https://docs.scrt.network/secret-network-documentation/development/secretjs/templates) - Building a web UI for a Secret Contract
