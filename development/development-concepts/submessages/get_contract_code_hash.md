---
description: get_contract_code_hash helper function
---

# get\_contract\_code\_hash

## Contract code hash helper function&#x20;

To retrieve a Secret Network smart contract's code hash from within a Secret contract call, you can use [Stargate queries](https://docs.rs/cosmwasm-std/latest/cosmwasm\_std/enum.QueryRequest.html) to directly query the on-chain data from inside the contract.&#x20;

This helper function is particularly interesting if you desire to make complicated contract structures that involve submessages or just cross-contract messages to different Secret Network contracts. With this code snippet, you do not need to supply the `code_hash` of each contract  that you are going to call in submessage or normal messages. It is sufficient to know the contract address of the other contract, the code snipped will fetch the latest on chain `code_hash` for you.

{% hint style="warning" %}
Be aware that contracts can be upgraded on Secret Network! Since this code snippet always fetch the `code_hash` directly from the chain without any extra check (which was implictly done by manually supplying the `code_hash`), you need to be careful about silently (perhaps maliciously) upgraded contracts which potentially releveal confidential information.
{% endhint %}

The Secret Network [team](https://github.com/SecretSaturn) has designed a helper function, `get_contract_code_hash`, exactly for this purpose.&#x20;

{% hint style="info" %}
See an example usage of get\_contract\_code\_hash [here](https://github.com/writersblockchain/secret-submessages/blob/c2e31c440ec73e4cc753be90a630dd926fdc714d/manager/src/contract.rs#L54).&#x20;
{% endhint %}

Simply add the Anybuf package and the `"stargate"` feature for cosmwasm-std to your `cargo.toml`:&#x20;

```rust
[dependencies]
cosmwasm-std = { package = "secret-cosmwasm-std", version = "1.1.10", features = ["stargate"]}
anybuf = {version = "0.5.0"}
```

And then add the function to your contract:&#x20;

```rust
fn get_contract_code_hash(deps: DepsMut, contract_address: String) -> StdResult<String> {
    let code_hash_query: cosmwasm_std::QueryRequest<cosmwasm_std::Empty> = cosmwasm_std::QueryRequest::Stargate {
        path: "/secret.compute.v1beta1.Query/CodeHashByContractAddress".into(),
        data: Binary(Anybuf::new()
        .append_string(1, contract_address)
        .into_vec())
    };

    let raw = to_vec(&code_hash_query).map_err(|serialize_err| {
        StdError::generic_err(format!("Serializing QueryRequest: {}", serialize_err))
    })?;

    let code_hash = match deps.querier.raw_query(&raw) {
        SystemResult::Err(system_err) => Err(StdError::generic_err(format!(
            "Querier system error: {}",
            system_err
        ))),
        SystemResult::Ok(ContractResult::Err(contract_err)) => Err(StdError::generic_err(format!(
            "Querier contract error: {}",
            contract_err
        ))),
        SystemResult::Ok(ContractResult::Ok(value)) => Ok(value)
    }?;

    // Remove the "\n@" if it exists at the start of the code_hash
    let mut code_hash_str = String::from_utf8(code_hash.to_vec()).map_err(|err| {
        StdError::generic_err(format!("Invalid UTF-8 sequence: {}", err))
    })?;

    if code_hash_str.starts_with("\n@") {
        code_hash_str = code_hash_str.trim_start_matches("\n@").to_string();
    }

    Ok(code_hash_str)
}
```
