---
description: 'Note: this page is currently in development'
---

# Testing Secret Contracts

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

Let's examine each of these functions individually to understand how unit tests check for correctness of various execution messages in Secret Smart Contracts.&#x20;

#### **proper\_initialization()**

[Review line 71 of the contract.rs file](https://github.com/scrtlabs/secret-template/blob/7f21404f0ef51a3e2d5cc725319dbe92e419a03b/src/contract.rs#L71), which contains the `proper_initialization()` test and tests that the counter contract is properly instantiated.&#x20;

```
#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm_std::testing::*;
    use cosmwasm_std::{from_binary, Coin, StdError, Uint128};

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
        let init_msg = InstantiateMsg { count: 17 };

        // we can just call .unwrap() to assert this was a success
        let res = instantiate(deps.as_mut(), mock_env(), info, init_msg).unwrap();

        assert_eq!(0, res.messages.len());

        // it worked, let's query the state
        let res = query(deps.as_ref(), mock_env(), QueryMsg::GetCount {}).unwrap();
        let value: CountResponse = from_binary(&res).unwrap();
        assert_eq!(17, value.count);
    }
```



