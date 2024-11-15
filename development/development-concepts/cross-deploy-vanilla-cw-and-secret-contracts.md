---
description: >-
  A description of building the same code for both vanilla CosmWasm and the
  Secret version.
---

# Cross-deploy Vanilla CW and Secret Contracts

### Crosschain Contract Demo

The crosschain contract that we are examining can be cloned from [this repo](https://github.com/scrtlabs/crosschain-contract-demo). This repo is a demo of writing a simple voting contract that is intended to be deployed on multiple chains with different types of CosmWasm in a **single codebase**. This demo supports two types of CosmWasm: `vanilla` (i.e. original, like Terra or Juno supported) and `secret` (i.e. SecretNetwork supported).

The contract code uses conditional compilation and feature flags in Rust to support different configurations within a single codebase. If you navigate to [contract.rs](https://github.com/scrtlabs/crosschain-contract-demo/blob/old-std-name/src/contract.rs), you will find two sets of imports for different features, either `"secret"` or `"vanilla"`. The imports are conditionally compiled using `#[cfg(feature = "…")]` attributes. The `"secret"` feature uses the `secret_std` crate, whereas the `"vanilla"` feature uses the `cosmwasm_std` crate.

{% hint style="info" %}
For more information about the feature differences of Standard CosmWasm vs the secret version please visit [this page.](secret-contract-cosmwasm-framework/differences-from-vanilla-cw.md)\
\
**TLDR**: No raw queries, iterators and upgradeability
{% endhint %}



### Contract.rs

Contract.rs defines several functions:

1. `instantiate`: This function initializes the contract and sets the initial vote count for both options to 0. **In this instance, it is the same for both Secret and vanilla CosmWasm.**&#x20;
2. `execute`: This function processes the `ExecuteMsg`, which supports voting. It calls the `vote_impl` function to perform the vote.
3. `vote_impl`: This function is implemented twice, once for each feature (`"secret"` and `"vanilla"`). It checks whether the voter has already voted, and if not, it updates the tally for the chosen option.
4. `query`: This function processes `QueryMsg`, which supports two queries: getting the vote tallies (`Tally`) and getting a list of voters (`Voters`). For the `Tally` query, it returns the vote count for both options. For the `Voters` query, it calls the `voters_query_impl` function.
5. `voters_query_impl`: This function is also implemented twice for each feature. It retrieves the voters list based on the provided page number.

Let's examine the differences in `vote_impl` based on which type of CosmWasm we are using. The overall structure and logic of the function are the same, but there are differences in the specific methods called on the `VOTERS`, `OPTION_1`, and `OPTION_2` objects. **These differences arise from the different crates used for the "secret" and "vanilla" features.**&#x20;

#### fn vote\_impl: Secret

In the "secret" version of `vote_impl`:

1. `VOTERS.contains(deps.storage, &info.sender)` is used to check if the voter already exists in the storage.
2. `VOTERS.insert(deps.storage, &info.sender, &1)` is used to insert the voter into the storage.

```rust
#[cfg(feature = "secret")]
fn vote_impl(deps: DepsMut, info: MessageInfo, option: u64) -> StdResult<Response> {
    if VOTERS.contains(deps.storage, &info.sender) {
        return Err(StdError::generic_err("already voted"));
    }

    VOTERS.insert(deps.storage, &info.sender, &1 /* arbitrary value */)?;

    // Update tally
    match option {
        1 => OPTION_1.update(deps.storage, |tally| Ok(tally + 1))?,
        2 => OPTION_2.update(deps.storage, |tally| Ok(tally + 1))?,
        _ => return Err(StdError::generic_err("unsupported option")),
    };

    Ok(Response::default())
}
```

#### fn vote\_impl: Vanilla CosmWasm

In the "vanilla" version of `vote_impl`:

1. `VOTERS.has(deps.storage, info.sender.clone())` is used to check if the voter already exists in the storage.
2. `VOTERS.save(deps.storage, info.sender, &1)` is used to save the voter into the storage.

```rust
#[cfg(feature = "vanilla")]
fn vote_impl(deps: DepsMut, info: MessageInfo, option: u64) -> StdResult<Response> {
    if VOTERS.has(deps.storage, info.sender.clone()) {
        return Err(StdError::generic_err("already voted"));
    }

    VOTERS.save(deps.storage, info.sender, &1 /* arbitrary value */)?;

    // Update tally
    match option {
        1 => OPTION_1.update(deps.storage, |tally| Ok::<u128, StdError>(tally + 1))?,
        2 => OPTION_2.update(deps.storage, |tally| Ok::<u128, StdError>(tally + 1))?,
        _ => return Err(StdError::generic_err("unsupported option")),
    };

    Ok(Response::default())
}
```

The rest of the function, including the match statement for updating the vote tally, is the same between the two versions. Now let's examine the difference in querying functions between the two versions.&#x20;

#### fn voters\_query\_impl: Secret

Vanilla CosmWasm Iterators are not supported on Secret Network because users cannot iterate over data stored by different users **as there is no access to their dedicated encryption key.** However, iteration is still possible on Secret Network through the use of the `secret_toolkit` for storage in place of `cosmwasm_std`.&#x20;

In the "secret" version of `voters_query_impl`:

* The `VOTERS.paging_keys(deps.storage, page, PAGE_SIZE as u32)?` method is used to retrieve a list of voters corresponding to the requested page. This method is specific to the `secret_toolkit` storage API and directly handles pagination.&#x20;

```rust
#[cfg(feature = "secret")]
fn voters_query_impl(deps: Deps, page: u32) -> StdResult<QueryRes> {
    let voters = VOTERS.paging_keys(deps.storage, page, PAGE_SIZE as u32)?;
    Ok(QueryRes::Voters { voters })
}
```

#### fn voters\_query\_impl: Vanilla

In the "vanilla" version of `voters_query_impl`:

* The `VOTERS.keys(deps.storage, None, None, cosmwasm_std::Order::Ascending)` method is used to retrieve an iterator over all the keys (voters) in the storage. Pagination is implemented manually in the function.

```rust
#[cfg(feature = "vanilla")]
fn voters_query_impl(deps: Deps, page: u32) -> StdResult<QueryRes> {
    use cosmwasm_std::Addr;

    let voters_iter = VOTERS.keys(deps.storage, None, None, cosmwasm_std::Order::Ascending); //.paging_keys(deps.storage, page, 20)?;
    let voters: Vec<Addr> = voters_iter
        .skip((page as usize) * PAGE_SIZE)
        .take(PAGE_SIZE)
        .filter(|v| v.is_ok())
        .map(|v| v.unwrap())
        .collect();
    Ok(QueryRes::Voters { voters: voters })
}
```

The main difference between the two implementations is that the Secret version relies on a `secret_toolkit` pagination method (`paging_keys`), whereas the Vanilla version manually implements pagination using iterator methods.

### State.rs: Secret vs CosmWasm

The contract uses `state_secret` or `state_vanilla` modules for managing the state, depending on the selected feature. The state management includes saving the vote counts for each option and managing the list of voters. Let's examine the differences between `state_secret.rs` and `state_vanilla.rs`.&#x20;

#### state\_secret.rs

In the Secret version:&#x20;

1. The `secret_std::Addr` is used as the address type.
2. The `secret_toolkit::storage::Item` and `secret_toolkit::storage::Keymap` types are used for storage management.
3. The storage objects are initialized with `Keymap::new` and `Item::new` methods, passing the byte representation of the corresponding prefixes.

```rust
#![cfg(feature = "secret")]

use crate::state::{OPTION_1_PREFIX, VOTE_PREFIX};
use secret_std::Addr;
use secret_toolkit::storage::{Item, Keymap};

pub static VOTERS: Keymap<Addr, u8> = Keymap::new(VOTE_PREFIX.as_bytes());
pub static OPTION_1: Item<u128> = Item::new(OPTION_1_PREFIX.as_bytes());
pub static OPTION_2: Item<u128> = Item::new(OPTION_1_PREFIX.as_bytes());rust
```

#### state\_vanilla.rs

In the Vanilla version:

1. The `cosmwasm_std::Addr` is used as the address type.
2. The `cw_storage_plus::Item` and `cw_storage_plus::Map` types are used for storage management.
3. The storage objects are initialized with the `Map::new` and `Item::new` methods, passing the corresponding prefixes directly.

```rust
#![cfg(feature = "vanilla")]

use crate::state::{OPTION_1_PREFIX, VOTE_PREFIX};
use cosmwasm_std::Addr;
use cw_storage_plus::{Item, Map};

pub static VOTERS: Map<Addr, u8> = Map::new(VOTE_PREFIX);
pub static OPTION_1: Item<u128> = Item::new(OPTION_1_PREFIX);
pub static OPTION_2: Item<u128> = Item::new(OPTION_1_PREFIX);
```

Thus, the Secret version relies on the `secret_std` and `secret_toolkit` crates, while the Vanilla version uses the `cosmwasm_std` and `cw_storage_plus` crates.  However, the overall purpose of the state management objects (VOTERS, OPTION\_1, and OPTION\_2) remains the same in both versions.

### How to cross-compilw on different chains

```bash
# Building for Secret
make secret

# Building for Juno
make vanilla
```

