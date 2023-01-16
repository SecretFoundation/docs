# Contract Migration

The Secret Network's version of the CosmWasm runtime disables the ability to natively migrate contracts. Data written to storage using some contract can only ever be accessed by that same contract. This is done for trust and security reasons. Once a user sends some information to a secret contract, there should not be an easy way for anyone to change the code that has access to this information. If it was possible, then the new code would be able to leak any information entrusted by the user to the old code.

That being said, contracts are fully programmable, and "not easy" is not impossible. If it was, we wouldn't even be here 😉. In some cases, for example when wanting to deliver support to users and deploy bug fixes, it makes sense to have the ability to change the code. This is especially true for services which wish to change algorithms, add features, etc. For these use cases, contracts can be written to allow various modes of migration. Doing so means that the anyone inspecting the source code will be able to _know_ that such a migration is possible and will require that users have a higher level of trust in the contract administrators, as they effectively install a backdoor in their product.

The contracts in this repository show various migration strategies that can be used and adapted in real-world contract. These should not be considered production-ready examples, and some applications may have more specific or creative migration paths.

For examples of implementations of the techniques described here see: [https://github.com/scrtlabs/secret-migrate-example](https://github.com/scrtlabs/secret-migrate-example)

{% hint style="warning" %}
**Did you know?** Contract migration/upgradability in a privacy-preserving way is on the roadmap for Secret Network
{% endhint %}

### Handoff

The idea of a handoff architecture is that the original deployed contract is written in a way that allows a contract admin to give a new contract permission to directly collect private information from it. In order to add a basic level of protection, the reference in this repository makes sure that the information can only be collected by a contract, and not just a regular user.

This is done by exchanging a secret with a contract through a callback. The admin would provide the first contract with the address and hash of the new contract. The first contract would then generate a secret based on some source entropy (internal or external) which it would send to the second contract (A malicious admin can still write a contract that would leek this secret, but we already decided we have to trust the admin). The second contract can then query the first contract, either once or with some paging, to retrieve and store all the previously hidden information. An important detail shown in the example is that the first contract essentially gets locked as soon as the migration starts. This is done in order to make sure the data stored in it doesn't change anymore. New interactions should be with the new contract, after the admin completes the migration.

### Facade

In theory, one could write a contract that only forwards messages to another contract that is configured by the contract admin. Users would then only interact with the facade, rather than the implementation contracts. You can imagine that it would define a small, reserved interface of messages that do not get forwarded, and would only be seen by the facade. Messages such as `ChangeOwner`, `ChangeImplemntation`, etc. This would allow great flexibility for contract authors to just deploy a new version of a contract, and point the facade to the new implementation. Paired with the [Handoff](https://github.com/scrtlabs/secret-migrate-example#handoff) technique, you could have a complete change of implementation, with only a short downtime. (The facade contract can even be written in a way that informs users that the service is temporarily down, and that they should retry in a couple minutes)

Unfortunately, this is currently not feasible, at least not in a pretty way, because of limitations of the available json parsing libraries. The only one i'm aware of that can run on an environment that forbids floats is `serde-json-wasm`, but it doesn't support parsing unstructured messages (like e.g., `serde_json::Value`). A workaround then, is to include the message to the "backend" contract as a serialized JSON in a string field of the message to the facade. It's not as pretty but can be implemented without having to start rewriting ecosystem packages.

Another, less flexible alternative, is to define the full API that you will commit to for the rest of the application's lifetime. Then, you can just parse-reserialize messages that aren't meant for the facade itself.

### Configurable Factory

This is more of a migration technique for products rather than specific contracts, but it's worth mentioning.

The idea is that if your application needs to deploy a new contract every time it serves customers (e.g., game rooms, bids, etc.), then you can write a factory contract that handles some things for you. The factory contract can be used for many things, from providing one authentication method for queries to multiple contracts, for aggregating usage statistics on-chain, for sharing information between contracts in a structured way, and more. Another use for it, is changing the implementation of _new_ contract that will be deployed in the future.

You can think of the factory as a sort of facade, so it can also include a handle that would allow the admin to reconfigure the code-id, and maybe even init parameters, used to open new contracts (game rooms, bids, etc.).

An example of this technique being used in production is [Baedrik's Secret Auctions](https://github.com/baedrik/secret-auction-factory).

### SNIP-20 swap

A SNIP-20 contract can also implement the `Receive` interface and allow users of one token to `Send` a swap request to the new token. The new token will lock those funds in its custody for the rest of time, and mint new tokens, with some exchange rate, to the sender address. This technique will require zero preparation by the original token contract.

A similar technique can be used by applications with similar ideas to SNIP-20.
