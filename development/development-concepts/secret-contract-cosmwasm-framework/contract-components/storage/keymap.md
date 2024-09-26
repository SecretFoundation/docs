---
description: This hashmap-like storage structure uses generic typed keys to store objects.
---

# Keymap

## What are K**eymaps?**

A **Keymap** is [Secret toolkit](https://github.com/scrtlabs/secret-toolkit/tree/master/packages/storage) hashmap-like storage structure that uses generic typed keys to store objects. It allows iteration with paging over keys and/or items without guaranteed ordering, although the order of insertion is preserved until you remove objects.&#x20;

An example use-case for a keymap is if you want to contain a large amount of votes and iterate over them in the future. Since iterating over large amounts of data at once may be prohibitive, a keymap allows you to specify the amount of data that will be returned in each page. We will implement this voting example below to show how keymaps can be utilized in your own projects.&#x20;

### **Importing the subpackage**

To import this package (and also the packages that we will be using for unit tests), add the following dependencies to your `Cargo.toml` file

```rust
cosmwasm-std = { package = "secret-cosmwasm-std", version = "1.1.10" }
cosmwasm-storage = { package = "secret-cosmwasm-storage", version = "1.1.10" }
secret-toolkit-storage = "0.9.0"
```

### Configuring the testing environment&#x20;

To import and initialize a keymap, use the following packages in your test environment:&#x20;

```rust
#[cfg(test)]
mod tests {
    use secret_toolkit_storage::{Item, Keymap};
    use serde::{Deserialize, Serialize};
    use cosmwasm_std::testing::MockStorage;
    use cosmwasm_std::StdResult;
    };
```

Now let's write our first test!&#x20;

#### Inserting key-value pairs into a Keymap

Let's start by creating a function that **inserts key-value pairs into a keymap.** This code defines a test function called `test_keymap_perf_vote_insert()` that creates a new `Keymap` that maps `Vec<u8>` keys to `String` values, and then inserts 1000 key-value pairs into the `Keymap`. Each key is a `Vec<u8>` containing an integer from 0 to 999, and each value is a `String` containing the text "I vote yes".&#x20;

```rust
#[test]
    fn test_keymap_perf_vote_insert() -> StdResult<()> {
        let mut storage = MockStorage::new();

        let total_items = 1000;

        let keymap: Keymap<Vec<u8>, String> = Keymap::new(b"votes");

        for i in 0..total_items {
            let key: Vec<u8> = (i as i32).to_be_bytes().to_vec();
            let value = String::from("I vote yes");
            keymap.insert(&mut storage, &key, &value)?;
        }

        assert_eq!(keymap.get_len(&storage)?, 1000);

        Ok(())
    }
```

This test is passing! Which means that it asserts that the `Keymap` contains 1000 key-value pairs, which map a number from 0 - 999 with the string "I vote yes."&#x20;

**Iterating with Keymaps**

There are two methods that create an iterator in Keymap. These are `.iter` and `.iter_keys`. `iter_keys` only iterates over the keys whereas `iter` iterates over (key, item) pairs.  Let's use `iter` to test the iterator functionality of a`Keymap` that maps `Vec<u8>` keys to a struct `Vote.`

We are going to create a new `Keymap` that maps `Vec<u8>` keys to a struct `Vote` that has two fields, `vote` and `person`. It then inserts two key-value pairs into the `Keymap`, where the keys are the byte vectors `b"key1".to_vec()` and `b"key2".to_vec()`, and the values are `Vote` structs containing information about the vote and the person who cast it.

We then use `iter()` to check that the size of the iterator is 2, which means there are two key-value pairs in the `Keymap:`&#x20;

```rust
 #[test]
    fn test_keymap_votes_iter() -> StdResult<()> {
        let mut storage = MockStorage::new();

        let alice = "alice";
        let bob = "bob";

        #[derive(Serialize, Deserialize, Eq, PartialEq, Debug, Clone)]
        struct Vote {
            vote: String,
            person: String,
        }

        let keymap: Keymap<Vec<u8>, Vote> = Keymap::new(b"votes");
        let vote1 = Vote {
            vote: "I vote yes".to_string(),
            person: alice.to_string(),
        };
        let vote2 = Vote {
            vote: "I vote no".to_string(),
            person: bob.to_string(),
        };

        keymap.insert(&mut storage, &b"key1".to_vec(), &vote1)?;
        keymap.insert(&mut storage, &b"key2".to_vec(), &vote2)?;

        let mut x = keymap.iter(&storage)?;
        let (len, _) = x.size_hint();
        assert_eq!(len, 2);

        assert_eq!(x.next().unwrap()?, (b"key1".to_vec(), vote1));

        assert_eq!(x.next().unwrap()?, (b"key2".to_vec(), vote2));

        Ok(())
    }
```

Our test is passing! This means that the first element returned by the iterator matches the expected key-value pair for `key1`, and that the second element returned by the iterator matches the expected key-value pair for `key2`. &#x20;

### **Additional Resources**

For further examples demonstrating the usage of keymaps, refer to the [Secret Toolkit repo here](https://github.com/scrtlabs/secret-toolkit/tree/master/packages/storage). \


