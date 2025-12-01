# Summary of Key Changes

#### Before

* Admin-only model: Contracts could only be migrated by their admin
* Binary upgradeability: Contracts were either upgradable (with admin) or not upgradable (without admin)
* No governance integration: No way for governance to control contract upgrades

#### After

* Hybrid model: Admin + governance control combinations
* Governance integration: On-chain proposals can authorize specific migrations
* One-way governance flag: Contracts can irreversibly require governance approval
* Four upgrade scenarios: Multiple combinations of admin and governance requirements
* Batch migrations: Single governance proposal can authorize multiple contract migrations
* Governance-only migration pattern: New mechanism for contracts with no admin but governance control<br>

The schematics of the updated system is shown below:

<figure><img src="../../../../.gitbook/assets/image (39).png" alt=""><figcaption></figcaption></figure>
