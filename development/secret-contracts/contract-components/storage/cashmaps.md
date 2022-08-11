# Cashmaps

Cashmaps are an experimental storage object found in `secret-toolkit-incubator` sub-package. The goal of Cashmaps is to provide paging and iterating features. Currently, each contract has to implement their own paging/iteration mechanics for their storage objects.

You would add this dependency to your contract by adding the following line to the `Cargo.toml`

```
secret-toolkit-incubator = { version = "0.3.1", default-features = false, features = ["cashmap"] }
```

## What Are Cashmaps?

Cashmap is another additional structure built on top of standard storage and prefixed storage that adds paging and iteration features to them. Because of these features, whenever Cashmaps are initialized, they must be provided with the type of object they store.

{% hint style="info" %}
Unlike Prefixed Storage, Cashmaps do not extend the Storage trait.
{% endhint %}

The reason Cashmaps don't extend Storage is because Storage is meant to be used for structures that store and retrieve binary. However, Cashmaps only store one type of object and serialize/deserialize it for the user. This is also why Cashmaps don't use the standard wrapper functions used in [Storage](./) and [Prefixed Storage](prefixed-storage.md).

{% hint style="warning" %}
Cashmap uses more gas than standard storage because it stores and operates on additional metadata. So do not use them unless you need the iteration and/or the paging features.
{% endhint %}

## Examples

In this section, we show examples of how to initialize, save, read, iterate, paginate data to/from Cashmaps. Most of the examples below are from the [factory contract template](https://github.com/srdtrk/secret-factory-contract).

### Saving To Cashmaps

We must first initialize the cashmap to save into it. Cashmaps can be initialized with or without prefixes. I'll give examples of both methods below. We use the `.insert(key: &[u8], item: T)` method to save an object into a `Cashmap<T, _>`.

```rust
let mut info_store: CashMap<StoreOffspringInfo, _> =
    CashMap::init(ACTIVE_KEY, &mut deps.storage);
info_store.insert(offspring_addr.as_slice(), offspring.clone())?;
```

The example above initializes a Cashmap with the key `ACTIVE_KEY` and saves a storage struct into it. The cashmap essentially creates a prefixed storage with that key and then attaches the Cashmap struct onto it.

{% hint style="warning" %}
Do not create a Prefixed Storage object with the same key used to create a Cashmap to prevent future collisions.
{% endhint %}

Now I will show how you could attach a Cashmap structure on top of any Storage object without any prefix.

```rust
let mut info_store: CashMap<StoreOffspringInfo, _> =
    CashMap::attach(&mut deps.storage);
info_store.insert(offspring_addr.as_slice(), offspring.clone())?;
```

This is not recommended if you are using the underlying storage (in this case `deps.storage`) for any other purposes to prevent collisions. Attach can be used to convert any storage into essentially a hashmap.

In the examples above, we don't actually need to specify the generic type into `StoreOffspringInfo` because the compiler can use the insert function's arguments to guess this type.

### Reading From Cashmaps

Reading from ReadOnlyCashmaps is identical to reading from Cashmaps. This is why we will only illustrate how to initialize a ReadOnlyCashmap and reading from it. We use the `.get(key: &[u8])` function which returns an `Option<T>` somewhat similar to the wrapper function `may_load` from [Storage](./).

```rust
let info_store: ReadOnlyCashMap<StoreOffspringInfo, _, _> = 
    ReadOnlyCashMap::init(ACTIVE_KEY, &deps.storage);
let info = info_store.get(offspring.as_slice());
```

### Removing From Cashmaps

We remove using the function `.remove(key: &[u8])` that returns a `StdResult<()>`.

```rust
let mut info_store: CashMap<StoreOffspringInfo, _, _> =
    CashMap::init(ACTIVE_KEY, &mut deps.storage);
info_store.remove(offspring_addr.as_slice())?;
```

### Pagination With Cashmaps

One of the main features of Cashmaps is pagination. We use the function `.paging(start_page: u32, size: u32)` which returns `StdResult<Vec<T>>`. The returned vector corresponds to the `start_page`'th page of the full list where the number of elements on each page is `size`.

```rust
let user_store: ReadOnlyCashMap<StoreOffspringInfo, _> = 
    ReadOnlyCashMap::init(ACTIVE_KEY, &deps.storage);
list = user_store.paging(page_number, size)?;
```

The following is an example object printed when `page_number: 0` and `size: 5` from the [factory template](https://github.com/srdtrk/secret-factory-contract).

```typescript
[
  {
    address: 'secret1yncfwvq5fesx8j0ga3ww0gdpmfrcj0vwsexd65',
    label: 'offspring19'
  },
  {
    address: 'secret1sshdl5qajv0q0k6shlk8m9sd4lplpn6gvf82cx',
    label: 'offspring1'
  },
  {
    address: 'secret1vjecguu37pmd577339wrdp208ddzymku0apnlw',
    label: 'offspring2'
  },
  {
    address: 'secret1mrnhvysuz0fed66thpy8fhlw6p253tzwe9pz9d',
    label: 'offspring13'
  },
  {
    address: 'secret1gv07846a3867ezn3uqkk082c5ftke7hpa6v46u',
    label: 'offspring4'
  }
]
```

### Iteration With Cashmaps

Cashmaps use the method `.iter()` to return an Iterator. This iterator iterates over the values that were saved into the Cashmap in no particular order. We can use `.next()` method to get the next item, and use `.nth(n: usize)` to get the nth element of the iterator, this will consume the returned element and all its preceding elements. The following is an example from [secret-toolkit's unit tests](https://github.com/scrtlabs/secret-toolkit/blob/master/packages/incubator/src/cashmap.rs#L958-L984).

```rust
#[test]
fn test_hashmap_iter() -> StdResult<()> {
    let mut storage = MockStorage::new();

    let mut hashmap = CashMap::attach(&mut storage);
    let foo1 = Foo {
        string: "string one".to_string(),
        number: 1111,
    };
    let foo2 = Foo {
        string: "string two".to_string(),
        number: 1111,
    };

    hashmap.insert(b"key1", foo1.clone())?;
    hashmap.insert(b"key2", foo2.clone())?;

    let mut x = hashmap.as_readonly().iter();
    let (len, _) = x.size_hint();
    assert_eq!(len, 2);

    assert_eq!(x.next().unwrap(), foo1);

    assert_eq!(x.next().unwrap(), foo2);

    Ok(())
}
```

### Using Custom Serde For Storage

Cashmaps do the serde for the user, they use bincode2 by default. But the problem of using floats in the deserialization of enum variants that was discussed in a [previous page](./#json-storage-wrapper-functions) also exists here. Cashmaps solve this problem by allowing the user to specify what serde format to use. Any serde format that implements `secret_toolkit_serialization::Serde` can be used by Cashmaps. The two formats implemented by secret toolkit are bincode2 and json. Since bincode2 is used in the above examples, I will show how you would use json in this case. You'd first import json with

```rust
use secret_toolkit_serialization::Json;
```

Then, initialising the Cashmap with a prefix would proceed as follows.

```rust
let mut info_store: CashMap<StoreOffspringInfo, _, Json> = 
    CashMap::attach_with_serialization(&mut deps.storage, Json, Some(ACTIVE_KEY.to_vec()));
```

Initializing a ReadOnlyCashmap is done similarly.

```rust
let mut info_store: ReadOnlyCashMap<StoreOffspringInfo, _, Json> = 
    ReadOnlyCashMap::attach_with_serialization(&deps.storage, Json, Some(ACTIVE_KEY.to_vec()));
```

### Iteration Over Keys

There is currently no support for iteration over the keys of the Cashmap, as only the hashes of the keys are saved internally. You could save the keys as part of the data as a workaround.&#x20;
