---
description: How to setup your contracts to accept snip-20 payments
---

# Snip-20s

## Implementing Snip Payments&#x20;

To pay with Snip-20s in a smart contract you will always call the Snip-20 contract first, which in turn will call the the smart-contract you want to send the payment to. This is done through the `Send` function, which calls a HandleMsg called `Receive` in the destination contract. The `Receive` Enum can be set to receive multiple different message formats, and should setup a match statement to sift through those options.

Within the `Receive` function you will be able to include any logic you need to respond to the payment. This should include checks to ensure both the payment amount and the snip20 contract address are correct.

## Example Code

Here is an example of the `receive` function located in handle.rs.

```rust
pub fn receive<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    env: Env,
    _sender: HumanAddr,
    from: HumanAddr,
    amount: Uint128,
    msg: Option<Binary>,
) -> HandleResult {
    let snip20_address: HumanAddr = load(&deps.storage, SNIP20_ADDRESS_KEY)?;

    if env.message.sender != snip20_address {
        return Err(StdError::generic_err(
            "Address is not correct snip contract",
        ));
    }

    if amount.u128() != MINT_COST {
        return Err(StdError::generic_err(
            "You have attempted to send the wrong amount of tokens",
        ));
    }

    let mut config: Config = load(&deps.storage, CONFIG_KEY)?;

    if let Some(bin_msg) = msg {
        match from_binary(&bin_msg)? {
            HandleReceiveMsg::ReceiveMint {} => mint(
                deps,
                env,
                &mut config,
                ContractStatus::Normal.to_u8(),
                Some(from),
            ),
        }
    } else {
        Err(StdError::generic_err("data should be given"))
    }
}
```

If you have multiple instances where payment will be required in your contract which require different data, it is a good idea to include an enum with different data options which in turn call different functions. In the example above, this enum is called `HandleReceiveMsg`. The enum definition can be seen below:

```rust
#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum HandleReceiveMsg {
    ReceiveMint {},
}
```

## Send Vs Transfer&#x20;
