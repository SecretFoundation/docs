# Migration Logic

#### Migration Scenarios

| Admin           | RequireGovernance | Behavior                                                        |
| --------------- | ----------------- | --------------------------------------------------------------- |
| ""              | false             | ❌ Not upgradable                                                |
| GovernanceProxy | true              | ✅ Governance-only migration (requires GovernanceProxy contract) |
| Admin           | false             | ✅ Admin-only migration                                          |
| Admin           | true              | ✅ Admin + governance required                                   |

#### Governance-Only Migration Pattern

For contracts that should only be upgradable through governance (no admin), a special migration contract pattern is used:

**The GovernanceProxy Contract Pattern**

1. **Deploy GovernanceProxy Contract**: A simple contract that can execute migration messages
2. **Set Admin**: Set the GovernanceProxy contract as admin of the target contract
3. **Enable Governance**: Set require\_governance = true on the target contract
4. **Migration Flow:**
   1. Governance proposal authorizes migration
   2. Anyone can call GovernanceProxy contract to execute the migration
   3. GovernanceProxy contract calls the migration message

**The example of GovernanceProxy Contract Implementation**&#x20;

```rust
#[entry_point]
pub fn execute(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::MigrateContract {
            contract_addr,
            new_code_id,
            migrate_msg,
            code_hash,
        } => {
            let migrate_msg = CosmosMsg::Wasm(WasmMsg::Migrate {
                contract_addr: contract_addr.clone(),
                code_id: new_code_id,
                msg: migrate_msg,                
                code_hash: code_hash,
            });

            Ok(Response::new()
                .add_message(migrate_msg)
                .add_attribute("method", "migrate_contract")
                .add_attribute("contract_addr", contract_addr)
                .add_attribute("new_code_id", new_code_id.to_string()))
        }
    }
}
```
