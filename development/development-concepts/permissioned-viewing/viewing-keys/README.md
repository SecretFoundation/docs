---
description: The original network viewing permission method
---

# Viewing Keys

## What Are Viewing Keys?

Viewing keys can be thought of the password side as a unique Username/Password combination saved to storage. The viewing key `String` is matched to an `Addr` and whenever a user wishes to query permissioned data they must provide both pieces of data. The contract will then check if the two are a match.

## What's The Best Way To Use These?

With recent advances in the efficiency of Certs/Permits, viewing-keys only remain the most efficient option when dealing with permissions between contracts for inter-contract queries. To optimize gas, it is best to only use them in this situation.

To make use of these, all necessary functionality are included in the Secret-Toolkit/Packages/Viewing-Key. Simply add this dependency to your project and make use of the `VK::set` and `VK::check` functions included.

[https://github.com/scrtlabs/secret-toolkit/tree/master/packages/viewing\_key](https://github.com/scrtlabs/secret-toolkit/tree/master/packages/viewing\_key)

## What Does This Look Like In Code?

Below are two example functions from the Secret-Toolkit Viewing-Keys package. Fundamentally, this is simply taking an address and string, and saving them as a pair.

```rust
 /// Set a new viewing key based on a predetermined value.
    fn set<S: Storage>(storage: &mut S, account: &Addr, viewing_key: &str) {
        let mut balance_store = PrefixedStorage::new(Self::STORAGE_KEY, storage);
        balance_store.set(
            account.as_str().as_bytes(),
            &sha_256(viewing_key.as_bytes()),
        );
    }
```

```rust
/// Check if a viewing key matches an account.
    fn check<S: ReadonlyStorage>(
        storage: &S,
        account: &Addr,
        viewing_key: &str,
    ) -> StdResult<()> {
        let balance_store = ReadonlyPrefixedStorage::new(Self::STORAGE_KEY, storage);
        let expected_hash = balance_store.get(account.as_str().as_bytes());
        let expected_hash = match &expected_hash {
            Some(hash) => hash.as_slice(),
            None => &[0u8; VIEWING_KEY_SIZE],
        };
        let key_hash = sha_256(viewing_key.as_bytes());
        if ct_slice_compare(&key_hash, expected_hash) {
            Ok(())
        } else {
            Err(StdError::unauthorized())
        }
    }
```
