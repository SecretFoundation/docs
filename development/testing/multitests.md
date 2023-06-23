---
description: How to write Multitests for Cosmwasm Smart Contracts
---

# Multitests

{% hint style="warning" %}
When working with Secret Network, it's crucial to understand that official support for multi-tests is not currently provided. As a result, when porting over a standard CosmWasm smart contract, it's advisable to exclude the `integration_tests.rs` file from your project. This page of documentation explains how to write standard CosmWasm multitests, but this is not yet supported on Secret Network.&#x20;
{% endhint %}

## Writing CosmWasm Multitests <a href="#writing-automated-tests" id="writing-automated-tests"></a>

`cw_multi_test` is [a Rust library](https://docs.rs/cw-multi-test/latest/cw\_multi\_test/) that provides utilities for writing **integration tests** for CosmWasm smart contracts. According to the rust docs:

> "Multitest is a design to simulate a blockchain environment in pure Rust. This allows us to run unit tests that involve contract -> contract, and contract -> bank interactions. This is not intended to be a full blockchain app but to simulate the Cosmos SDK x/wasm module close enough to gain confidence in multi-contract deployments before testing them on a live blockchain."

To use `cw_multi_test`, you need to add it to your project's `Cargo.toml` file as a dependency:

```
[dev-dependencies]
cw-multi-test = "0.13.4"
```

For this tutorial, we are analyzing a multitest that is part of the [cw3-fixed-multisig](https://github.com/CosmWasm/cw-plus/tree/main/contracts/cw3-fixed-multisig) CosmWasm repo. This contract is simply a multisig contract with a fixed set of addresses created upon instantiation, and we are testing **whether or not the multisig contract can execute a cw20 contract successfully.**&#x20;

### **Integration\_tests.rs** <a href="#blob-path" id="blob-path"></a>

Start by examining the [`integration_test.rs` file here](https://github.com/CosmWasm/cw-plus/blob/main/contracts/cw3-fixed-multisig/src/integration\_tests.rs).&#x20;

{% hint style="info" %}
The terms "Integration test" and "multitest" are used interchangeably. &#x20;
{% endhint %}

This is a Rust integration test for a cosmwasm smart contract that demonstrates the use of the `cw_multi_test` crate.

The test sets up two contracts: (1) a CW3 multisig contract and (2) a CW20 token contract, and verifies that the multisig contract can control CW20 admin actions. The test case first deploys the CW3 multisig contract with three voters and a voting threshold of 2 (this just means that there are 3 wallet addresses that can vote and they each have equal voting power), and then deploys the CW20 token contract with the multisig contract as the minter.&#x20;

It then creates a proposal to mint new tokens, which is voted on and executed by the multisig contract. Finally, it queries the balance of the mint recipient to verify that the tokens were successfully minted. The test case demonstrates how to use `cw_multi_test` to create a mock app, deploy contracts, and execute transactions with multiple contracts. Let's examine it line-by-line:&#x20;

```
#[cfg(test)]

use cosmwasm_std::{to_binary, Addr, Empty, Uint128, WasmMsg};
use cw20::{BalanceResponse, MinterResponse};
use cw20_base::msg::QueryMsg;
use cw3::Vote;
use cw_multi_test::{App, Contract, ContractWrapper, Executor};
use cw_utils::{Duration, Threshold};

use crate::contract::{execute, instantiate, query};
use crate::msg::{ExecuteMsg, InstantiateMsg, Voter};


fn mock_app() -> App {
    App::default()
}
```

First, the test sets up a mock application and imports the contract dependencies. At the beginning of the test, an[**`App`**](https://docs.rs/cw-multi-test/0.13.4/cw\_multi\_test/struct.App.html) **object is created**. `App` is a core multitest entity representing the virtual blockchain on which we run our contracts.

```
pub fn contract_cw3_fixed_multisig() -> Box<dyn Contract<Empty>> {
    let contract = ContractWrapper::new(execute, instantiate, query);
    Box::new(contract)
}

pub fn contract_cw20() -> Box<dyn Contract<Empty>> {
    let contract = ContractWrapper::new(
        cw20_base::contract::execute,
        cw20_base::contract::instantiate,
        cw20_base::contract::query,
    );
    Box::new(contract)
}
```

The above functions define a CW3 multisig smart contract instance, as well as a CW20 token smart contract instance. `Box::new(contract)` creates a new heap-allocated `Box` that owns the `contract` instance and returns it as a trait object.&#x20;

Here, the `contract` instance is created using the `ContractWrapper::new()` method, which takes in three functions as arguments: `execute`, `instantiate`, and `query`. These functions are defined in the `contract` module and are used to implement the `execute`, `instantiate`, and `query` methods of the `Contract` trait.

Now let's examine the `cw3_controls_cw20()` function:

```
#[test]
fn cw3_controls_cw20() {
    let mut router = mock_app();
    }
```

`mut router` initializes the router mock app.

```
let cw3_id = router.store_code(contract_cw3_fixed_multisig());
```

`cw3_id` stores the cw3 multisig contract code in the router and get its ID.&#x20;

```
let addr1 = Addr::unchecked("addr1");
let addr2 = Addr::unchecked("addr2");
let addr3 = Addr::unchecked("addr3");
```

`addr1, addr2, addr3` are three arbitrary addresses to use as voters for the cw3 multisig account.

```
let cw3_instantiate_msg = InstantiateMsg {
    voters: vec![
        Voter {
            addr: addr1.to_string(),
            weight: 1,
        },
        Voter {
            addr: addr2.to_string(),
            weight: 1,
        },
        Voter {
            addr: addr3.to_string(),
            weight: 1,
        },
    ],
    threshold: Threshold::AbsoluteCount { weight: 2 },
    max_voting_period: Duration::Height(3),
};
```

`cw3_instantiate_msg` creates an instantiation message for the cw3 multisig account.&#x20;

```
let multisig_addr = router
    .instantiate_contract(
        cw3_id,
        addr1.clone(),
        &cw3_instantiate_msg,
        &[],
        "Consortium",
        None,
    )
    .unwrap();
```

`multisig_addr` instantiates the cw3 multisig account and get its address.&#x20;

```
let cw20_id = router.store_code(contract_cw20());

let cw20_instantiate_msg = cw20_base::msg::InstantiateMsg {
    name: "Consortium Token".parse().unwrap(),
    symbol: "CST".parse().unwrap(),
    decimals: 6,
    initial_balances: vec![],
    mint: Some(MinterResponse {
        minter: multisig_addr.to_string(),
        cap: None,
    }),
    marketing: None,
};


let cw20_addr = router
    .instantiate_contract(
        cw20_id,
        multisig_addr.clone(),
        &cw20_instantiate_msg,
        &[],
        "Consortium",
        None,
    )
    .unwrap();
```

`cw20_id` stores the cw20 contract code in the router and get its ID.  &#x20;

`cw20_instantiate_msg` creates an instantiation message for the cw20 contract, setting the multisig account as the minter.&#x20;

`cw20_addr` instantiates the cw20 contract and get its address.&#x20;

```
let mint_recipient = Addr::unchecked("recipient");
let mint_amount = Uint128::new(1000);
let cw20_mint_msg = cw20_base::msg::ExecuteMsg::Mint {
    recipient: mint_recipient.to_string(),
    amount: mint_amount,
};

let execute_mint_msg = WasmMsg::Execute {
    contract_addr: cw20_addr.to_string(),
    msg: to_binary(&cw20_mint_msg).unwrap(),
    funds: vec![],
};

let propose_msg = ExecuteMsg::Propose {
    title: "Mint tokens".to_string(),
    description: "Need to mint tokens".to_string(),
    msgs: vec![execute_mint_msg.into()],
    latest: None,
};
router
    .execute_contract
```

`cw20_mint_msg` creates a message to mint some cw20 tokens according to a proposal result.&#x20;

`execute_mint_msg` create an execute message to execute the cw20\_mint\_msg on the cw20 contract.

`propose_msg` creates a proposal message that includes the `execute_mint_msg` and proposes it to the multisig account.&#x20;

```
// only 1 vote and msg mint fails
    let execute_proposal_msg = ExecuteMsg::Execute { proposal_id: 1 };
    // execute mint
    router
        .execute_contract(addr1, multisig_addr, &execute_proposal_msg, &[])
        .unwrap();

    // check the mint is successful
    let cw20_balance_query = QueryMsg::Balance {
        address: mint_recipient.to_string(),
    };
    let balance: BalanceResponse = router
        .wrap()
        .query_wasm_smart(&cw20_addr, &cw20_balance_query)
        .unwrap();

    // compare minted amount
    assert_eq!(balance.balance, mint_amount);
```

Lastly, the function executes the proposal and checks that the mint was successful by querying the balance of the recipient's address. The line "assert\_eq!(balance.balance, mint\_amount)" is an assertion that checks whether the value of the `balance` variable is equal to the value of the `mint_amount` variable.

In the previous lines of code, the `balance` variable was assigned the value of the balance of the `cw20` token held by the `mint_recipient` address after the minting process. The `mint_amount` variable was assigned the value of `1000` `cw20` tokens which were minted in the process.

Therefore, the assertion is checking whether the `cw20` tokens were minted and the `balance` of `cw20` tokens held by the `mint_recipient` address is equal to the `mint_amount` that was minted. If the assertion fails, the test will panic.&#x20;

