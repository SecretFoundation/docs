# Emergency migration test on mainnet version 1.18

## Motivation

Recently the Secret Network underwent a transformation into **MRENCLAVE** sealing. Means, only the specific build of the secret node has access to the most sensitive secrets (such as the network seed).
To support future network upgrades, there's a migration (a.k.a. secrets handover) mechanism.

Here's the detailed description of how this mechanism works: https://github.com/SecretFoundation/docs/blob/gitbook/infrastructure/resources/upgrade-instructions/mrenclave.md

It's crucially important to make sure that the Emergency Upgrade mechanism works correctly. 

We've done numerous tests on testnet (`pulsar-3`). However, considering the importance of the subject, it's important to perform some testing on Mainnet too.

## What we'd like to test

As described in the above link, there're 2 migration mechanisms: on-chain and off-chain (a.k.a. emergency).

Currently we intend to test only the emergency migration procedure. The reason for this is that it'll be less intrusive for the users. The network doesn't need to be stopped, users won't be affected by this at all.
While, at the same time, we'll be confident the migration works correctly.

## Test procedure
SCRT Labs built a new version of the Secret Node. Based on the officially released v1.18, we've made a *cosmetic* change, just to create a distinct version. Here's the change:
https://github.com/scrtlabs/SecretNetwork/commit/f45cc994f41473e1ecf8300df99addd10f308c4a

The **MRENCLAVE** measurement of this modified version is: `de8cfc1e6d0abf64416e7ae430e23c12dba909e0c1919fdd0eab70cc6e086646`. We've built it locally (and used our **MRSIGNER** publisher key to sign it), everyone is more than welcome to repeat the build locally,
and make sure this is indeed the correct measurement.

Each validator with the voting power should run the following command:
```
secretd emergency_approve_upgrade de8cfc1e6d0abf64416e7ae430e23c12dba909e0c1919fdd0eab70cc6e086646
```

**Note:** this command can be run while the node is running. No need to stop the node.

The output should look like this:
```
Signature: {"86BA1F5334D21B1260AE3816BC0CEEAD90CAEC0B":["9TPTQRn/uMAV/fPyc4cC1IIgzVNQM1woDbE7BDTErOo=","vi/PaNbqZ601x6c0MYIydIi+pUCBOV31TW27nj3y1PuKGZ5a17Co0FzLDNhfHWNDaGzHuxHVbD+nXlMlZd5PCA=="]
```

All those outputs should be sent to us. We'll combine them into a file, and  test the migration procedure. We'll check:
- The validator sigantures are correctly verified
- Voting power of the approvers is correctly calculated
- The enclave allows the migration iff the appropriate criterias are met, w.r.t. the voting power, number of whitelisted signers, emergency upgrade whitelist, and etc.

We'll complete the migration to the experimental version locally, make sure the procedure works correctly, and that the experimental version is able to run normally.
Others won't need to do that, it's sufficient to test this on one machine.

Then we'll publish the test results.
