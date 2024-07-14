---
description: Full example guide on mitigating privacy risks.
---

# Mitigate privacy risks - full guide

### Execute messages

Here we use a sample contract for selling a secret message to illustrate padding, gas evaporation, and side-chain attack prevention using a trusted actor to confirm transactions. In the contract we define three methods: posting a secret for sale, buying a secret, and confirming purchases. All three message types have two optional parameters: `gas_target` and `padding`. These will be used to help mask which message is being called.

```rust
#[derive(Serialize, Deserialize, Clone, Debug, Eq, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum ExecuteMsg {
    PostSecret {
        /// secret message
        message: String,
        /// price to purchase secret
        price: Uint128,
        /// optional gas target for evaporation
        gas_target: Option<u32>,
        /// optional message length padding
        padding: Option<String>,
    },
    BuySecret {
        /// unique id for message
        message_id: String,
        /// optional gas target for evaporation
        gas_target: u32,
        /// optional message length padding
        padding: Option<String>,
    },
    ConfirmPurchase {
        /// transaction id being confirmed
        tx_id: String,
        /// optional gas target for evaporation
        gas_target: u32,
        /// optional message length padding
        padding: Option<String>,
    }
}
```

### Using padding and evaporation in `execute`

Padding and evaporation are parameters that are set for all message types.

The `padding` parameter is used by the client to pad the size of message being sent to the contract. The `padding` parameter is not used within the contract itself and is only necessary when using Keplr's amino format. In other cases the dapp or wallet can simply add extra space characters to the end of the json message.

We also want to pad the result sent back to the client. We can use the `pad_handle_result` function from secret toolkit to format the response to a fixed block size. If you have responses that are large, you will need a sufficiently large block size to successfully mask the method being run.

After padding the result at the end of `execute` entry point function, we use `gas_target` along with the evaporation api functions to evaporate any remaining gas to hit the gas target. Note, we simply ignore both the `padding` and the `gas_target` message parameters using `..` in the match statement.

```rust
#[entry_point]
pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg) -> StdResult<Response> {
    let response = match msg {
        ExecuteMsg::PostSecret { message, price, .. } => try_post_secret(...),
        ExecuteMsg::BuySecret { message_id, .. } => try_buy_secret(...),
        ExecuteMsg::ConfirmPurchase { tx_id, .. } => try_confirm_purchase(...),
    };

    // use secret toolkit `pad_handle_result` to pad the response to blocks of 256 bytes
    let response = pad_handle_result(response, 256);

    // evaporate any remaining gas
    if let Some(gas_target) = msg.gas_target {
        let gas_used = deps.api.check_gas()? as u32;
        if gas_used < gas_target {
            let to_evaporate = gas_target - gas_used;
            deps.api.gas_evaporate(to_evaporate)?;
        }
    }

    // return the response
    response
}
```

### Making data written to chain constant size

Just like we want to use padding to hide the message type when sending between the client and the contract, the number of bytes written to the chain can leak information about what is written. For example, a coin amount stored as a `Uint128` will write a different number of bytes depending on the size of the number, and also in our example the secret message could leak information based on its length. For data structs we want to store on chain we usually create a _stored_ version and create conversion methods between the unstored and stored versions. Note in the example, we use the secret toolkit `space_pad` function to make all secrets stored as 256 bytes long masking the content.

```rust
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub struct Secret {
    pub owner: Addr,
    pub message: String,
    pub price: Uint128,
}

impl Secret {
    pub fn to_stored(self, api: &dyn Api) -> StdResult<StoredSecret> {
        let mut message = self.message.as_bytes().to_vec();
        space_pad(&mut message, 256);
        Ok(StoredSecret {
            owner: api.addr_canonicalize(self.owner.as_str())?,
            message,
            price: self.price.u128(),
        })
    }
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, Eq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub struct StoredSecret {
    pub owner: CanonicalAddr,
    pub message: Vec<u8>,
    pub price: u128,
}
```

### Preventing a side chain attack

Padding and evaporation help to protect privacy about what types of functions are being called in a contract and about what data is being read and written from storage. However, our contract is still vulnerable to a side chain attack if a buyer can simply purchase a secret without a trusted actor confirming the transaction. This is because a malicious actor could fork the chain and buy the secret on the forked chain without ever paying any coins on the mainnet.&#x20;

In our case a trusted actor who can confirm the purchase is the seller of the secret. If all purchases must have the `ConfirmPurchase` transaction performed after buying, then it is impossible for the side-chain attack to occur. Other contracts that need to implement this functionality might require a trusted third-party actor instead, for example a game contract where turns are executed on-chain.
