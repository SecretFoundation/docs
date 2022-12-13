# Keymap

This hashmap-like storage structure allows the user to use generic typed keys to store objects. Allows iteration with paging over keys and/or items (without guaranteed ordering, although the order of insertion is preserved until you start removing objects).
An example use-case for such a structure is if you want to contain a large amount of votes, deposits, or bets and iterate over them at some time in the future.
Since iterating over large amounts of data at once may be prohibitive, this structure allows you to specify the amount of data that will
be returned in each page.

#### **Init**

To import and initialize this storage object as a static constant in `state.rs`, do the following:

```ignore
use secret_toolkit::storage::{Keymap, KeymapBuilder}
```

```ignore
pub static ADDR_VOTE: Keymap<Addr, Foo> = Keymap::new(b"vote");
pub static BET_STORE: Keymap<u32, BetInfo> = Keymap::new(b"bet");
```
> ❗ Initializing the object as const instead of static will also work but be less efficient since the variable won't be able to cache length data.
 
You can use Json serde algorithm by changing the signature to `Keymap<Addr, Uint128, Json>`, similar to all the other storage objects above. However, keep in mind that the Serde algorithm is used to serde both the stored object (`Uint128`) AND the key (`Addr`).

If you need to associate a keymap to a user address (or any other variable), then you can also do this using the `.add_suffix` method.

For example, suppose that in your contract, a user can make multiple bets. Then, you'd want a Keymap to be associated to each user. You would achieve this by doing the following during execution in `contract.rs`.

```ignore
// The compiler knows that user_bet_store is AppendStore<u32, BetInfo>
let user_count_store = BET_STORE.add_suffix(info.sender.to_string().as_bytes());
```

#### **Advanced Init**

It is also possible to modify some of the configuration settings of the Keymap structure so that it suits better to a specific use case. In this case, we use a struct called `KeymapBuilder` to build a keymap with specialized config. Currently, we can use KeymapBuilder to modify two attributes of keymaps.

One is to disable the iterator feature altogether using `.without_iter()`. This basically turns a keymap into a typed PrefixedStorage, but it also saves a ton of gas by not storing the keys and the length of the keymap.

The other feature is to modify the page size of the internal indexer (only if the iterator feature is enabled, i.e. this setting is irrelevant if `.without_iter()` is used). Keymap iterates by using internal index pages allowing it to load the next 5 objects at the same time. You can change the default 5 to any `u32` greater than zero by using `.with_page_size(num)`. This allows the user to optimize the gas usage of Keymap.

The following is used to produce a Keymap without an iterator in `state.rs`

```ignore
pub static JSON_ADDR_VOTE: Keymap<String, Foo, Json, WithoutIter> =
            KeymapBuilder::new(b"json_vote").without_iter().build();

pub static BINCODE_ADDR_VOTE: Keymap<String, Foo, Bincode2, WithoutIter> =
            KeymapBuilder::new(b"bincode_vote").without_iter().build();
```

The following is used to produce a Keymap with modified index page size:

```ignore
pub static ADDR_VOTE: Keymap<Addr, Foo> = KeymapBuilder::new(b"page_vote").with_page_size(13).build();

pub static JSON_VOTE: Keymap<Addr, Foo, Json> =
            KeymapBuilder::new(b"page_vote").with_page_size(3).build();
```

#### **Read/Write**

You can find more examples of using keymaps in the unit tests of Keymap in `keymap.rs`.

To insert, remove, read from the keymap, do the following:

```ignore
let user_addr: Addr = info.sender;

let foo = Foo {
    message: "string one".to_string(),
    votes: 1111,
};

ADDR_VOTE.insert(deps.storage, &user_addr, &foo)?;
// Compiler knows that this is Foo
let read_foo = ADDR_VOTE.get(deps.storage, &user_addr).unwrap();
assert_eq!(read_foo, foo1);
ADDR_VOTE.remove(deps.storage, &user_addr)?;
assert_eq!(ADDR_VOTE.get_len(deps.storage)?, 0);
```

#### **Iterator**

There are two methods that create an iterator in Keymap. These are `.iter` and `.iter_keys`. `iter_keys` only iterates over the keys whereas `iter` iterates over (key, item) pairs. Needless to say, `.iter_keys` is more efficient as it does not attempt to read the item.

Keymap also has two paging methods, these are `.paging` and `.paging_keys`. `paging_keys` only paginates keys whereas `iter` iterates over (key, item) pairs. Needless to say, `.iter_keys` is more efficient as it does not attempt to read the item.

Here are some select examples from the unit tests:

```ignore
fn test_keymap_iter_keys() -> StdResult<()> {
    let mut storage = MockStorage::new();

    let keymap: Keymap<String, Foo> = Keymap::new(b"test");
    let foo1 = Foo {
        string: "string one".to_string(),
        number: 1111,
    };
    let foo2 = Foo {
        string: "string two".to_string(),
        number: 1111,
    };

    let key1 = "key1".to_string();
    let key2 = "key2".to_string();

    keymap.insert(&mut storage, &key1, &foo1)?;
    keymap.insert(&mut storage, &key2, &foo2)?;

    let mut x = keymap.iter_keys(&storage)?;
    let (len, _) = x.size_hint();
    assert_eq!(len, 2);

    assert_eq!(x.next().unwrap()?, key1);

    assert_eq!(x.next().unwrap()?, key2);

    Ok(())
}
```

```ignore
fn test_keymap_iter() -> StdResult<()> {
    let mut storage = MockStorage::new();

    let keymap: Keymap<Vec<u8>, Foo> = Keymap::new(b"test");
    let foo1 = Foo {
        string: "string one".to_string(),
        number: 1111,
    };
    let foo2 = Foo {
        string: "string two".to_string(),
        number: 1111,
    };

    keymap.insert(&mut storage, &b"key1".to_vec(), &foo1)?;
    keymap.insert(&mut storage, &b"key2".to_vec(), &foo2)?;

    let mut x = keymap.iter(&storage)?;
    let (len, _) = x.size_hint();
    assert_eq!(len, 2);

    assert_eq!(x.next().unwrap()?.1, foo1);

    assert_eq!(x.next().unwrap()?.1, foo2);

    Ok(())
}
```
