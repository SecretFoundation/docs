---
description: How to write Unit Tests for Secret Contracts
---

# Unit Tests

## Writing Secret Contract Unit Tests <a href="#writing-automated-tests" id="writing-automated-tests"></a>

To ensure that Secret smart contract code is reliable and free of errors, it's important to test it thoroughly. One effective way to achieve this is through **unit testing.**

Unit testing involves breaking down a program into its smallest components or units and testing each one in isolation. By testing each unit separately, developers can easily pinpoint the root cause of any errors or bugs and fix them quickly.

In Rust, unit testing is supported by the [Rust testing framework](https://doc.rust-lang.org/book/ch11-01-writing-tests.html), which provides a set of macros and utilities for writing and running tests. Rust's testing framework is built into the standard library and is designed to:

1. Set up any needed data or state.
2. Run the code you want to test.
3. Assert the results are what you expect.

Secret Contracts utilize the Rust testing framework **as well as additional `cosmwasm-std` utilities**, such as  [`mock_dependencies`](https://docs.rs/cosmwasm-std/1.0.0/cosmwasm\_std/testing/fn.mock\_dependencies.html) and [`mock_env`](https://docs.rs/cosmwasm-std/1.0.0/cosmwasm\_std/testing/fn.mock\_env.html) functions.&#x20;

We will explore the basics of unit testing for Secret Contracts, including how to write and run tests, organize test code, and use test-driven development (TDD) to ensure code quality. With this foundation, you'll be well on your way to writing robust and reliable Secret contracts.&#x20;

### Testing a Secret Counter Contract&#x20;

For a practical understanding of writing unit tests for Secret Contracts, navigate to the [`contract.rs` file of the Secret Counter template](https://github.com/scrtlabs/secret-template/blob/7f21404f0ef51a3e2d5cc725319dbe92e419a03b/src/contract.rs#L71). Here you will find 3 unit tests:&#x20;

* `proper_initialization()`
* `increment()`
* `reset()`

Let's examine `proper_initialization()` to understand how unit tests check for correctness of various execution messages in Secret Smart Contracts.&#x20;

#### **proper\_initialization()**

[Review line 71 of the contract.rs file](https://github.com/scrtlabs/secret-template/blob/7f21404f0ef51a3e2d5cc725319dbe92e419a03b/src/contract.rs#L71), which contains the `proper_initialization()` test and tests whether or not **the counter contract is properly instantiated**. Let's break this function down line-by-line so we have a thorough understanding of each piece of the code.&#x20;

```
//examine this code block and then read the analysis below
#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::*;
    use cosmwasm_std::{from_binary, Coin, StdError, Uint128};
    }
```

The `#[cfg(test)]` annotation on the tests module tells Rust to compile and run this test code only when you run `cargo test` , and not when you run `cargo build` . This saves compile time when you only want to build the library and saves space in the resulting compiled artifact because the tests are not included.

The `mod tests { }` block defines a new module named `tests`. This is a conventional way of organizing test functions in Rust. Tests can be run with `cargo test`.

{% hint style="success" %}
If you run **`cargo test`,** `the terminal will return 3 passing tests!`
{% endhint %}

The `use super::*;` line imports all the modules from the parent module ([ie everything that is imported at the top](https://github.com/scrtlabs/secret-template/blob/7f21404f0ef51a3e2d5cc725319dbe92e419a03b/src/contract.rs#L1) of the `contract.rs` file). This allows the test module to access `contract.rs`'s imports and test its functionality.

The `use cosmwasm_std::testing::*;` line imports all the testing utilities from the `cosmwasm_std` crate.&#x20;

The `use cosmwasm_std::{from_binary, Coin, StdError, Uint128};` line  are imports commonly used in CosmWasm smart contracts, and include functions for parsing binary data, working with tokens (Coins), and reporting errors (StdError).

```
 //examine this code block and then read the analysis below
 #[test]
    fn proper_initialization() {
        let mut deps = mock_dependencies();
        let info = mock_info(
            "creator",
            &[Coin {
                denom: "earth".to_string(),
                amount: Uint128::new(1000),
            }],
        );
```

The `#[test]` attribute marks the function as a test function and tells Rust to run this function when you run `cargo test.`

The `let mut deps = mock_dependencies();` line creates a new set of **mock dependencies**, which simulate the necessary dependencies of a smart contract in a testing environment. These dependencies include storage, a message handler, and an API client.

The `let info = mock_info("creator", &[Coin { denom: "earth".to_string(), amount: Uint128::new(1000), }], );` line creates a new mock transaction context, which simulates the context in which a transaction would be executed on the blockchain. This context includes information about the sender of the transaction (in this case, the creator), as well as any tokens (in this case, a single "earth" token with a balance of 1000).

Taken together, these lines set up a mock environment in which the counter contract can be tested. The `proper_initialization()` function can now perform its tests using these mock dependencies and transaction context.

```
//examine this code block and then read the analysis below
let init_msg = InstantiateMsg { count: 17 };

        let res = instantiate(deps.as_mut(), mock_env(), info, init_msg).unwrap();

        assert_eq!(0, res.messages.len());
        
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCount {}).unwrap();
        
        let value: CountResponse = from_binary(&res).unwrap();
        
        assert_eq!(17, value.count);
    }
```

The `let init_msg = InstantiateMsg { count: 17 };` line creates a new `InstantiateMsg` struct with an initial count value of 17. This message is used to initialize the counter contract's state.

{% hint style="info" %}
Remember, [we defined an instantiate message in msg.rs](https://github.com/scrtlabs/secret-template/blob/7f21404f0ef51a3e2d5cc725319dbe92e419a03b/src/msg.rs#L5), which is why this struct is required to instantiate the contract. If there was no instantiation struct with a starting count, the test would fail.&#x20;
{% endhint %}

The `let res = instantiate(deps.as_mut(), mock_env(), info, init_msg).unwrap();` line instantiates the smart contract with the given dependencies that we defined above, as well as the transaction context, and instantiation message. This initializes the smart contract's state and returns a `Response` struct that contains any messages that the contract emits during initialization.

The `assert_eq!(0, res.messages.len());` line checks that no messages were emitted during smart contract instantiation. If any messages were emitted, this assertion would fail and the test would panic.&#x20;

The `let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCount {}).unwrap();` line queries the smart contract's state using the `QueryMsg::GetCount` message. This retrieves the current count value stored in the smart contract's state.

The `let value: CountResponse = from_binary(&res).unwrap();` line deserializes the query response data (which is in binary format) into a `CountResponse` struct. This struct represents the result of the query and contains the current count value.

Finally, the `assert_eq!(17, value.count);` line checks that the current count value retrieved from the smart contract's state is equal to the expected value of 17. If the current count value is not equal to 17, this assertion would fail and the test would panic.&#x20;

#### Next Steps

With this information, examine the other testing functions in the counter contract. You should have all of the resources you need to start writing your very own unit tests! Now let's learn about Multitests! [✨](https://emojipedia.org/sparkles/)
