---
description: Optionally perform state migrations of Secret Network smart contracts
---

# Contract Migration

In some cases, for example when wanting to deliver support to users and deploy bug fixes, it makes sense to have the ability to change the code. This is especially true for services which wish to change algorithms, add features, etc. For these use cases, contracts can be written to allow various modes of migration. Doing so means that the anyone inspecting the source code will be able to _know_ that such a migration is possible and will require that users have a higher level of trust in the contract administrators, as they effectively install a backdoor in their product.

**Secret used to not support the native CosmWasm implementation of contract migrateability, since V1.11 it does.**\
\
The old manual examples are still displayed here as a reference.\


{% hint style="info" %}
During the V1.11 upgrade a set of old contracts were allowed to become migrateable, these contracts behave slightly different in that they are callable by both their new and old code hash.\
\
**For more information about the transition period** please read [this forum post!](https://forum.scrt.network/t/an-update-on-the-contract-upgrade-feature/7012)
{% endhint %}
