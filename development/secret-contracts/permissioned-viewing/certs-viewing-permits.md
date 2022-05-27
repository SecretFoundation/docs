---
description: >-
  Permits are the successor to viewing keys. With increases in efficiency made
  in the Shockwave update they are now the defacto viewing permission method in
  almost every situation.
---

# Certs/Viewing Permits

## What is a Permit?

Permits are simply a dummy transaction signed by a wallet. The wallet is able to use this signature as proof that the transactor is who they say they are. Any wallet capable of using Tendermint is able to carry out this process. Generating a permit happens outside of the smart-contract, but checking them in your smart contract is extremely simple. Once again the Secret-Toolkit provides a package for us, aptly named `permit`. The function that checks the permit is called `validate` shown below.

```rust
pub fn validate<Permission: Permissions, S: Storage, A: Api, Q: Querier>(
    deps: &Extern<S, A, Q>,
    storage_prefix: &str,
    permit: &Permit<Permission>,
    current_token_address: HumanAddr,
    hrp: Option<&str>,
) -> StdResult<String> {
    let account_hrp = hrp.unwrap_or("secret");

    if !permit.check_token(&current_token_address) {
        return Err(StdError::generic_err(format!(
            "Permit doesn't apply to token {:?}, allowed tokens: {:?}",
            current_token_address.as_str(),
            permit
                .params
                .allowed_tokens
                .iter()
                .map(|a| a.as_str())
                .collect::<Vec<&str>>()
        )));
    }

    // Derive account from pubkey
    let pubkey = &permit.signature.pub_key.value;

    let base32_addr = pubkey_to_account(pubkey).0.as_slice().to_base32();
    let account: String = bech32::encode(account_hrp, &base32_addr, Variant::Bech32).unwrap();

    // Validate permit_name
    let permit_name = &permit.params.permit_name;
    let is_permit_revoked = RevokedPermits::is_permit_revoked(
        &deps.storage,
        storage_prefix,
        &HumanAddr(account.clone()),
        permit_name,
    );
    if is_permit_revoked {
        return Err(StdError::generic_err(format!(
            "Permit {:?} was revoked by account {:?}",
            permit_name,
            account.as_str()
        )));
    }

    // Validate signature, reference: https://github.com/enigmampc/SecretNetwork/blob/f591ed0cb3af28608df3bf19d6cfb733cca48100/cosmwasm/packages/wasmi-runtime/src/crypto/secp256k1.rs#L49-L82
    let signed_bytes = to_binary(&SignedPermit::from_params(&permit.params))?;
    let signed_bytes_hash = sha_256(signed_bytes.as_slice());

    let verified = deps
        .api
        .secp256k1_verify(&signed_bytes_hash, &permit.signature.signature.0, &pubkey.0)
        .map_err(|err| StdError::generic_err(err.to_string()))?;

    if !verified {
        return Err(StdError::generic_err(
            "Failed to verify signatures for the given permit",
        ));
    }

    Ok(account)
}
```

To use this, simply call `validate` inside of your query provided with the necessary permit variables.

## When is it Best to Use Permits?

Permits can be used at any time, and are amazing for almost every permissioned viewing application. The only time it may be more efficient to use viewing keys instead is during inter-contract communication.
