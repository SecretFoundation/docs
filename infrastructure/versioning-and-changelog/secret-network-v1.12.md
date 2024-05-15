# Secret Network v1.12

* Fix the hardcoded admins feature
* Add hardcoded admins according to proposals [269](https://dev.mintscan.io/secret/proposals/269) (Shillables) & [270](https://dev.mintscan.io/secret/proposals/270) (Sienna).
* Fix PFM to stop dropping packets of IBC contracts.
  * This has always been a bug in PFM. It was introduced in v1.9 and was missed because of a bug in our CI system.
  * Fixed the bug in PFM and updated the dependency.
  * For more info see [cosmos/ibc-apps#105](https://github.com/cosmos/ibc-apps/pull/105).
* Add `admin` to `WasmMsg::Instantiate` in cosmwasm-std (Thanks [@luca992](https://github.com/luca992)!).
  * This allows contracts to specify an admin address when instantiating other contracts.
  * See usage example [here](https://github.com/scrtlabs/SecretNetwork/blob/eedfac881/cosmwasm/contracts/v1/compute-tests/test-compute-contract/src/contract.rs#L245-L259).
* Update IBC to v4.5.0
* Fixed a bug in the v1.12 upgrade handler ([8a67990](https://github.com/scrtlabs/SecretNetwork/commit/8a67990529b4033918c483168e0330c1869b2b83))
* Fixed Rosetta server
* Patch a security issue (IBC vulnerability)
