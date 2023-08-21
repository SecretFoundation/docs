---
description: Initiate a contract call with an incoming IBC token transfer using WASM hooks
---

# IBC-hooks

_note: this documentation is currently in progress as of 8/21/23_

### IBC-hooks Overview

IBC-hooks is an IBC middleware that **uses incoming ICS-20 token transfers to initiate smart contract calls**. This allows for arbitrary data to be passed in as a string along with token transfers and is useful for a variety of use cases such as cross-chain token swaps, auto-wrapping of SNIP-20 tokens, General Message Passing (GMP) between Secret Network and EVM chains, and much more! The mechanism enabling this is a `memo` field on every ICS20 transfer packet as of IBC v3.4.0. Wasm hooks is an IBC middleware that parses an ICS20 transfer, and if the `memo` field is of a particular form, it executes a WASM contract call.

{% hint style="info" %}
Note that the metadata in the memo field is not used within ICS-20 itself, but instead, a middleware or custom CosmWasm contract can wrap around the transfer protocol to parse the metadata and execute custom logic based off of it. [See more here.](https://medium.com/the-interchain-foundation/moving-beyond-simple-token-transfers-d42b2b1dc29b)&#x20;
{% endhint %}

### ICS20 Packet Structure

ICS20 is JSON native, so JSON is used for the memo format:

{% code overflow="wrap" %}
```rust
{
  //... other ibc fields omitted for example
  "data": {
    "denom": "denom on counterparty chain (e.g. uatom)", // will be transformed to the local denom (ibc/...)
    "amount": "1000",
    "sender": "addr on counterparty chain", // will be ignored and shown to the contract as a null sender (cannot be verifed over IBC)
    "receiver": "secret1contractAddr",
    "memo": {
      "wasm": {
        "contract": "secret1contractAddr",
        "msg": {
          "raw_message_fields": "raw_message_data"
        }
      }
    }
  }
}
```
{% endcode %}

An ICS20 packet is formatted correctly for WASM hooks if the following all hold:

* `memo` is not blank
* `memo` is valid JSON
* `memo` has at least one key, with value `"wasm"`
* `memo["wasm"]` has exactly two entries, `"contract"` and `"msg"`
* `memo["wasm"]["msg"]` is a valid JSON object
* `receiver == memo["wasm"]["contract"]`

We consider an ICS20 packet as directed towards wasmhooks if:

* `memo` is not blank
* `memo` is valid JSON
* `memo` has at least one key, with name `"wasm"`

{% hint style="info" %}
If an ICS20 packet is not directed towards wasmhooks, wasmhooks doesn't do anything. If an ICS20 packet is directed towards wasmhooks, and is formated incorrectly, then wasmhooks returns an error.
{% endhint %}

### ICS20 Packet Execution Flow

Before WASM hooks:

* Ensure the incoming IBC packet is cryptographically valid
* Ensure the incoming IBC packet has not timed out

In WASM hooks, before packet execution:

* Ensure the packet is correctly formatted (as defined above)
* Edit the receiver to be the hardcoded IBC module account

In WASM hooks, after packet execution:

* Construct wasm message as defined above
* Execute wasm message
* If wasm message has error, return `ErrAck`
* Otherwise continue through middleware

### Auto-wrapping of SNIP-20 Example

[The following contract](https://github.com/scrtlabs/secret.js/blob/e6919420e1650c1a37ff188743b2e6bb33a93823/test/ibc-hooks-contract/src/contract.rs#L22-L46) receives funds from IBC, wraps them as SNIP-20 tokens, and then transfers them to the recipient that is specified in the ibc-hooks message:

{% code overflow="wrap" %}
```rust
#[entry_point]
pub fn execute(_deps: DepsMut, env: Env, info: MessageInfo, msg: Msg) -> StdResult<Response> {
    match msg {
        Msg::Nop {} => Ok(Response::default()),
        Msg::WrapDeposit {
            snip20_address,
            snip20_code_hash,
            recipient_address,
        } => Ok(Response::default().add_messages(vec![
            CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
                contract_addr: snip20_address.clone(),
                code_hash: snip20_code_hash.clone(),
                msg: to_binary(&secret_toolkit::snip20::HandleMsg::Deposit { padding: None })
                    .unwrap(),
                funds: info.funds.clone(),
            }),
            CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
                contract_addr: snip20_address,
                code_hash: snip20_code_hash,
                msg: to_binary(&secret_toolkit::snip20::HandleMsg::Transfer {
                    recipient: recipient_address,
                    amount: info.funds[0].amount,
                    memo: None,
                    padding: None,
                })
                .unwrap(),
                funds: vec![],
            }),
        ])),
        }
    }
```
{% endcode %}

### Ack callbacks

A contract that sends an IBC transfer may need to listen for the acknowledgment (`ACK`) of that packet. To allow contracts to listen to the `ack` of specific packets, we provide **Ack callbacks**. The sender of an IBC transfer packet may specify a callback in the `memo` field of the transfer packet when the `ack` of that packet is received

{% hint style="info" %}
Only the IBC packet sender can set the callback
{% endhint %}

#### Ack callback implementation

For the callback to be processed, the transfer packet's `memo` should contain the following in its JSON:

`{"ibc_callback": "secret1contractAddr"}`

The WASM hooks will keep the mapping from the packet's channel and sequence to the contract in storage. When an `ack` is received, it will notify the specified contract via an `execute` message.

**Interface for receiving the Acks and Timeouts**

[The contract that awaits the callback](https://github.com/scrtlabs/secret.js/blob/e6919420e1650c1a37ff188743b2e6bb33a93823/test/ibc-hooks-contract/src/contract.rs#L66C10-L66C10) should implement the following interface for a sudo message:

{% code overflow="wrap" %}
```rust
#[cw_serde]
pub enum IBCLifecycleComplete {
    #[serde(rename = "ibc_ack")]
    IBCAck {
        /// The source channel (secret side) of the IBC packet
        channel: String,
        /// The sequence number that the packet was sent with
        sequence: u64,
        /// String encoded version of the ack as seen by OnAcknowledgementPacket(..)
        ack: String,
        /// Weather an ack is a success of failure according to the transfer spec
        success: bool,
    },
    #[serde(rename = "ibc_timeout")]
    IBCTimeout {
        /// The source channel (secret side) of the IBC packet
        channel: String,
        /// The sequence number that the packet was sent with
        sequence: u64,
    },
}

/// Message type for `sudo` entry_point
#[cw_serde]
pub enum SudoMsg {
    #[serde(rename = "ibc_lifecycle_complete")]
    IBCLifecycleComplete(IBCLifecycleComplete),
}

#[entry_point]
pub fn sudo(_deps: DepsMut, _env: Env, msg: SudoMsg) -> StdResult<Response> {
    match msg {
        SudoMsg::IBCLifecycleComplete(IBCLifecycleComplete::IBCAck {
            channel,
            sequence,
            ack,
            success,
        }) => todo!(),
        SudoMsg::IBCLifecycleComplete(IBCLifecycleComplete::IBCTimeout {
            channel,
            sequence,
        }) => todo!(),
    }
}
```
{% endcode %}
