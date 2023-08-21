---
description: Optionally perform state migrations of Secret Network smart contracts
---

# Contract Migration

## Contract Migration on Secret Network

Contracts on Secret Network can be initialized as **migratable**, which allows the contract administrator to upload a new version of the contract and then send a `migrate` message to move to the new code, which "migrates" storage from a previous contract to the new contract.&#x20;

There are two key components to a migratable contract:

* A designated `admin` whose address will be allowed to perform migrations.
* The availability of a `MigrateMsg` transaction.

### Contract Admin

On `instantiation`, the contract creator can specify an `admin` address, which can be the contract creator's wallet address, an external account, or a governance contract, etc. Whatever the address is, this `admin` gains the ability to migrate the contract to a new `codeId`, and can also update or clear the `admin` address. When the `admin` invokes the `MigrateMsg` message, the `migrate()` function is called on the new contract `codeId`, where the new contract can optionally perform state migrations from an old contract.&#x20;

### MigrateMsg

Performing a contract migration is a three step process:

1. Write a newer version of the contract you wish to update
2. Upload the new smart contract, but don’t instantiate it
3. Use a dedicated [MigrateMsg](https://github.com/scrtlabs/SecretNetwork/blob/139a0eb18/cosmwasm/contracts/v1/compute-tests/migration/contract-v2/src/contract.rs#L37-L43) transaction to point the new contract to the code you wish to migrate

When migrating, the new contract must have a `migrate` function as an `entry_point.`

{% code overflow="wrap" %}
```rust
#[entry_point]
pub fn migrate(_deps: DepsMut, _env: Env, msg: MigrateMsg) -> StdResult<Response> {
    match msg {
        MigrateMsg::Migrate {} => Ok(Response::default()),
        MigrateMsg::StdError {} => Err(StdError::generic_err("this is an std error")),
    }
}
```
{% endcode %}

The `migrate` function provides the ability to make any desired changes to the contract's state, similar to a database migration.

If the `migrate` function returns an error, the transaction will abort and no state changes will occur.&#x20;

### Execute Migration with Secret.js

{% code overflow="wrap" %}
```javascript
import { SecretNetworkClient, Wallet } from "secretjs";
import dotenv from "dotenv";
dotenv.config();

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});

const codeId = 1; // codeId for new contract
const contractCodeHash = ""; // codeHash for new contract
const contractAddress = ""; // contract address, which doesn't change upon migration

let main = async () => {
  const migrateMsg = {
    remove_users: { a, b }, // this is an example. migrateMsg can be left empty if contract storage is unchanged during migration
  };

  const tx = await secretjs.tx.compute.migrateContract(
    {
      code_id: codeId,
      contract_address: contractAddress,
      sender: wallet.address,
      code_hash: contractCodeHash,
      msg: migrateMsg,
    },
    {
      gasLimit: 400_000,
    }
  );

  console.log(tx.rawLog);
};

main();
```
{% endcode %}
