# Secret network v1.9

* New Feature: [Randomness injection for secret contracts](../../../development/development-concepts/example-contracts/secret-contract-fundamentals/secret-vrf-on-chain-randomness.md).
  * Eliminates the need for contracts to bootstrap their own entropy pool.
  * Unique for every contract call.
  * Useful in lotteries, gaming, secure authentication protocols, protocols where unpredictable outcomes are essential for fairness and security, and much more. For more infomation on how to use this feature, see the documentation
* New Feature: [FinalizeTx](../../../development/development-concepts/execution-finalization.md).
  * Contracts can force the transaction to finalize at a certain point, otherwise revert.
  * Example: protect against sandwich attacks and potential transaction rollbacks.
  * Example: protect against cheating in gaming applications, where a malicious player could try to rollback a transaction in which they lost.
* IBC: Updated ibc-go from v3.4.0 to v4.3.0.
* New IBC Feature: Added packet-forward-middleware by Strangelove.
  * Other chains would be able to more easily route SCRT in the interchain. For example, sending SCRT from Osmosis to Hub now becomes a single transaction from `Osmosis -> Secret` rather than a transaction from `Osmosis -> Secret`, then a transaction from `Secret -> Hub`.
* New IBC Feature: Added IBC fee middleware.
  * Creates a fee market for relaying IBC packets.
* New IBC Feature: Added IBC panic button.
  * Quickly shut down IBC in case of an emergency.
* New Feature: Evaporate & Check Gas APIs The new Check Gas and Evaporate APIs allow contract developers to create contracts that consume a constant amount of gas, independently of their code path. This helps harden contracts against information leakage from the amount of gas consumed by a contract.
* Bug Fix: Fixed an issue where nodes would sometimes stop if failing to enter SGX enclave
* Bug Fix: Fixed a bug where stopping and restarting a node would often cause the node to apphash
* Bug Fix: Fixed an issue where storing and deleting a key from storage in the same msg would cause it not to be deleted
