# Storage

## How Storage Works&#x20;

CosmWasm uses a key-value storage design. Smart contracts can store data in binary, access it through a storage key, edit it, and save it. Similar to a HashMap, each storage key is associated with a specific piece of data stored in binary. The storage keys are formatted as references to byte arrays (`&[u8]`).

One advantage of the key-value design is that a particular data value is only loaded when the user explicitly loads it using its storage key. This prevents any unnecessary data from being processed, saving resources.

Any type of data may be stored this way as long as the user can serialize/deserialize (serde) the data to/from binary. Doing this manually every single time is cumbersome and repetitive, this is why we have wrapper functions that does this serde process for us.

All the data is actually stored in `deps.storage` , and the examples below show how to save/load data to/from there with a storage key.

## Storage Keys&#x20;

Creating a storage key is simple, any way of generating a constant `&[u8]` suffices. People often prefer generating these keys from strings as shown in the example below.

```rust
pub const CONFIG_KEY: &[u8] = b"config";
```

For example, the above key is likely used to store some data related to core configuration values of the contract. The convention is that storage keys are often all created in `state.rs`, and then imported to `contract.rs`. However, since storage keys are just constants, they could be declared anywhere in the contract.

The example above also highlights that storage keys are not meant to be secret nor hard to guess. Anyone who has the open source code can see what the storage keys are (and of course this is not enough for a user to load any data from the smart contract).

## Storage Wrapper Functions

As mentioned above, serializing/deserializing data while loading/saving it with a key is cumbersome. This is why we often use wrapper functions written by community members. There are three common wrapper functions that are included in the `state.rs` of most secret contract templates.

### Saving To Storage&#x20;

A commonly used wrapper function to save data is the following. This function overwrites previously saved data associated to that storage key.

```rust
/// Returns StdResult<()> resulting from saving an item to storage
///
/// # Arguments
///
/// * `storage` - a mutable reference to the storage this item should go to
/// * `key` - a byte slice representing the key to access the stored item
/// * `value` - a reference to the item to store
pub fn save<T: Serialize, S: Storage>(storage: &mut S, key: &[u8], value: &T) -> StdResult<()> {
    storage.set(key, &Bincode2::serialize(value)?);
    Ok(())
}
```

Note that `value` can be of any Struct type. The only condition is that this Struct must derive the Serialize and Deserialize traits from serde with the following line above its Struct declaration.

```rust
#[derive(Serialize, Deserialize)
```

{% hint style="warning" %}
There are some structs that cannot be serialized/deserialized by the bincode2 struct these wrapper functions use! See [JSON Storage Wrapper Functions ](./#json-storage-wrapper-functions)section below to see what happens in this case.
{% endhint %}

#### Example

The wrapper may be used to save data in the following manner:

```rust
let config = Config {
        owner: deps.api.canonical_address(&env.message.sender)?,
    };

// Save data to storage
save(&mut deps.storage, CONFIG_KEY, &config)?;
```

### Loading From Storage&#x20;

A commonly used wrapper function to load data from storage is the following:

```rust
/// Returns StdResult<T> from retrieving the item with the specified key.  Returns a
/// StdError::NotFound if there is no item with that key
///
/// # Arguments
///
/// * `storage` - a reference to the storage this item is in
/// * `key` - a byte slice representing the key that accesses the stored item
pub fn load<T: DeserializeOwned, S: ReadonlyStorage>(storage: &S, key: &[u8]) -> StdResult<T> {
    Bincode2::deserialize(
        &storage
            .get(key)
            .ok_or_else(|| StdError::not_found(type_name::<T>()))?,
    )
}
```

Note that this function throw an error if there is no data previously saved with that storage key.

#### Example

When loading data, rust must be told what Struct to expect after deserializing.

```rust
let config: Config = load(&deps.storage, CONFIG_KEY)?;
```

### Loading With May Load

In some instances you may be unsure whether there is any data stored with a particular key. In this case you want to use `may_load()` which wraps any data inside within an option. Returning `None` if there is no value saved with that key, and returning `Some(value)` if there is some value saved. An example function for this is:

```rust
/// Returns StdResult<Option<T>> from retrieving the item with the specified key.
/// Returns Ok(None) if there is no item with that key
///
/// # Arguments
///
/// * `storage` - a reference to the storage this item is in
/// * `key` - a byte slice representing the key that accesses the stored item
pub fn may_load<T: DeserializeOwned, S: ReadonlyStorage>(
    storage: &S,
    key: &[u8],
) -> StdResult<Option<T>> {
    match storage.get(key) {
        Some(value) => Bincode2::deserialize(&value).map(Some),
        None => Ok(None),
    }
}
```

#### Example

One of the most common use cases of this function is when retrieving viewing keys for users. However, viewing keys use PrefixedStorage, and we will see this in the next section. So instead, I will show a line of code that retrieves a list of minters for an NFT.

```rust
let minters: Vec<CanonicalAddr> =
            may_load(&deps.storage, MINTERS_KEY)?.unwrap_or_else(Vec::new);
```

This line of code returns the list of minters if it is saved to MINTERS\_KEY, otherwise, it returns an empty list.

### Removing From Storage&#x20;

A commonly used wrapper function to remove saved data from storage is the following. This might be the only wrapper function that does not make anything more convenient, because there is no serialize/deserialize implemented.

```rust
/// Removes an item from storage
///
/// # Arguments
///
/// * `storage` - a mutable reference to the storage this item is in
/// * `key` - a byte slice representing the key that accesses the stored item
pub fn remove<S: Storage>(storage: &mut S, key: &[u8]) {
    storage.remove(key);
}
```

#### Example

The following code removes minters. This code does not let you know if there was any previously saved data to that storage key.

```rust
remove(&mut deps.storage, MINTERS_KEY);
```

## JSON Storage Wrapper Functions

The wrapper functions we learned above use bincode2 struct (from `secret-toolkit`) to serde the data being saved/read on the smart contract. However, bincode2 uses floats when deserializing rust enum variants, thus, bincode2 cannot serde enum variants in cosmwasm. This is why cosmwasm uses Json serde by default, not bincode2.

The following is an example, from the [reference SNIP-721 implementation](https://github.com/baedrik/snip721-reference-impl), of a struct that cannot be saved/loaded by the wrapper functions we saw above because it uses an enum.

```rust
/// permission to view token info/transfer tokens
#[derive(Serialize, Deserialize, Clone, PartialEq, Debug)]
pub struct Permission {
    /// permitted address
    pub address: CanonicalAddr,
    /// list of permission expirations for this address
    pub expirations: [Option<Expiration>; 3],
}

/// at the given point in time and after, Expiration will be considered expired
#[derive(Serialize, Deserialize, Clone, Copy, PartialEq, JsonSchema, Debug)]
#[serde(rename_all = "snake_case")]
pub enum Expiration {
    /// expires at this block height
    AtHeight(u64),
    /// expires at the time in seconds since 01/01/1970
    AtTime(u64),
    /// never expires
    Never,
}
```

In these cases, we can use the Json struct from `secret-toolkit` to serde structs that use enums. This also creates the need for for new wrapper functions

### Saving To Storage

```rust
/// Returns StdResult<()> resulting from saving an item to storage using Json (de)serialization
/// because bincode2 annoyingly uses a float op when deserializing an enum
///
/// # Arguments
///
/// * `storage` - a mutable reference to the storage this item should go to
/// * `key` - a byte slice representing the key to access the stored item
/// * `value` - a reference to the item to store
pub fn json_save<T: Serialize, S: Storage>(
    storage: &mut S,
    key: &[u8],
    value: &T,
) -> StdResult<()> {
    storage.set(key, &Json::serialize(value)?);
    Ok(())
}
```

The usage of this function is extremely similar to the `save` wrapper function we discussed [above](./#saving-to-storage).

{% hint style="info" %}
bincode2 serde is more efficient than json serde
{% endhint %}

### Loading from Storage

```rust
/// Returns StdResult<T> from retrieving the item with the specified key using Json
/// (de)serialization because bincode2 annoyingly uses a float op when deserializing an enum.  
/// Returns a StdError::NotFound if there is no item with that key
///
/// # Arguments
///
/// * `storage` - a reference to the storage this item is in
/// * `key` - a byte slice representing the key that accesses the stored item
pub fn json_load<T: DeserializeOwned, S: ReadonlyStorage>(storage: &S, key: &[u8]) -> StdResult<T> {
    Json::deserialize(
        &storage
            .get(key)
            .ok_or_else(|| StdError::not_found(type_name::<T>()))?,
    )
}
```

The usage of this function is extremely similar to the `load` wrapper function we discussed [above](./#loading-from-storage).

### Loading with May Load

```rust
/// Returns StdResult<Option<T>> from retrieving the item with the specified key using Json
/// (de)serialization because bincode2 annoyingly uses a float op when deserializing an enum.
/// Returns Ok(None) if there is no item with that key
///
/// # Arguments
///
/// * `storage` - a reference to the storage this item is in
/// * `key` - a byte slice representing the key that accesses the stored item
pub fn json_may_load<T: DeserializeOwned, S: ReadonlyStorage>(
    storage: &S,
    key: &[u8],
) -> StdResult<Option<T>> {
    match storage.get(key) {
        Some(value) => Json::deserialize(&value).map(Some),
        None => Ok(None),
    }
}
```

The usage of this function is extremely similar to the `may_load` wrapper function we discussed [above](./#loading-with-may-load).

{% hint style="info" %}
The `remove` wrapper function [above](./#removing-from-storage) works the same because it doesn't serde
{% endhint %}
