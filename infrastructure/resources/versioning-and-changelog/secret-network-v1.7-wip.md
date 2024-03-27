# Secret Network v1.7/1.8

## 1.8.0

Fixed a critical bug in 1.7.0 that prevented new nodes from joining the network and existing nodes from restarting their secretd process.

## 1.7.0

* Added the ability to [rotate consensus seed](../../../overview-ecosystem-and-technology/techstack/privacy-technology/encryption-key-management/consensus-seed-rotation.md) during a network upgrade
  * this will be executed during this upgrade
* Added expedited gov proposals
  * Initial params (can be amended with a param change proposal):
    * Minimum deposit: 750 SCRT
    * Voting time: 24 hours
    * Voting treshhold: 2/3 yes to pass
  * If an expedited proposal fails to meet the threshold within the scope of shorter voting duration, the expedited proposal is then converted to a regular proposal and restarts voting under regular voting conditions.
* Added [auto-restaking](../../../development/development-concepts/example-contracts/secret-contract-fundamentals/auto-restaking.md) - an opt-in feature that enables automatic compounding of staking rewards
* Added [light-client validation](../../../development/development-concepts/example-contracts/secret-contract-fundamentals/secret-contracts.md) for blocks
  * Protects against leaking private data using an offline fork attack
  * Enables trusted block heights and block time to be relied on by contracts
