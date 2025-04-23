# Emergency migration test on mainnet version 1.18

## Motivation

Recently the Secret Network underwent a transformation into **MRENCLAVE** sealing. Means, only the specific build of the secret node has access to the most sensitive secrets (such as the network seed).
To support future network upgrades, there's a migration (a.k.a. secrets handover) mechanism.

Here's the detailed description of how this mechanism works: https://github.com/SecretFoundation/docs/blob/gitbook/infrastructure/resources/upgrade-instructions/mrenclave.md

It's crucially important to make sure that this mechanism works correctly. If this mechanism stops working - there's a risk to disable future upgrades, and even "brick" the network completely.

We've done numerous tests on testnet (`pulsar-3`). However, considering the importance of the subject, it's important to perform some tests on mainnet too.

## What we'd like to test

As described in the above link, there're 2 migration mechanisms: on-chain and off-chain (a.k.a. emergency).

Currently we intend to test only the emergency migration procedure. The reason for this is that it'll be less intrusive for the users. The network doesn't need to be stopped, most users won't be affected by this at all.
While, at the same time, we'll be confident the migration works correctly, and there's no considerable risk.

## Test procedure

We at secret will build a new version of the Secret Node. We'll perform a *cosmetic* change to the secret enclave source code, just to create a distinct version. We'll publish the **MRENCLAVE** measurement of it, along with the source code,
to demonstrate that the changes are purely *cosmetic*, and there's no privacy leak risk.

Each validator with the voting power should run this command:
```
secretd emergency_approve_upgrade XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

(whereas `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX` will be replaced by the actual **MRENCLAVE** of the experimental enclave, once we build it)

**Note:** this command can be run while the node is running. No need to stop the node.

The output should look like this:
```
Signature: {"86BA1F5334D21B1260AE3816BC0CEEAD90CAEC0B":["9TPTQRn/uMAV/fPyc4cC1IIgzVNQM1woDbE7BDTErOo=","vi/PaNbqZ601x6c0MYIydIi+pUCBOV31TW27nj3y1PuKGZ5a17Co0FzLDNhfHWNDaGzHuxHVbD+nXlMlZd5PCA=="]
```

All those outputs should be sent to us. We'll combine them into a file, and will test the migration procedure. We'll check:
- The validator sigantures are correctly verified
- Voting power of the approvers is correctly calculated
- The enclave allows the migration iff the appropriate criterias are met, w.r.t. the voting power, number of whitelisted signers, emergency upgrade whitelist, and etc.

We'll complete the migration to the experimental version locally, make sure the procedure works correctly, and that the experimental version is able to run normally.
Others won't need to do that, it's sufficient to test this on one machine.

Then we'll publish the test results.
