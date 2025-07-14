# Overview

#### Concepts

**High level Mechanism**

* add schedule using governance proposals \[Permissioned - Main DAO];
* remove schedule using governance proposals \[Permissioned - Main DAO or Security subDAO];
* every given block period execute cosmwasm msgs for added schedules.

**General Mechanics**

The module allows to receive `MsgAddSchedule` and `MsgRemoveSchedule` governance messages.

It also contains permissions:

* `MsgAddSchedule` can only be executed as main dao governance proposal
* `MsgRemoveSchedule` can only be executed as main dao governance proposal OR security subdao proposal

In BeginBlocker and EndBlocker module searches for all schedules (with limit by `Params.Limit`) that are ready to be executed, using `last_execute_height`.

That way after the schedule was added it will be executed every `period` of blocks (or more than `period` if too many schedules ready to execute).

**Example**

**Adding schedule**

To add schedule we need to send governance proposal:

```json
{
  "messages": [
    {
      "@type": "/secret.cron.MsgAddSchedule",
      "authority": "secret10d07y265gmmuvt4z0w9aw880jnsr700jc88vt0",
      "name": "custom",
      "period": "2",
      "msgs": [
        {
          "contract": "secret1mfk7n6mc2cg6lznujmeckdh4x0a5ezf6hx6y8q",
          "msg": "7fc422718d9ba824726425866666f408aa66c0d4413803dc064e4ec115bbbbf7{\"increment\":{}}"
        }
      ]
    }
  ],
  "metadata": "ipfs://CID",
  "deposit": "10000000000uscrt",
  "title": "increase counter",
  "summary": "increase counter",
  "expedited": false
}
```

**Removing schedule**

To remove schedule we need to send governance proposal:

```json
{
  "messages": [
    {
      "@type": "/secret.cron.MsgRemoveSchedule",
      "authority": "secret10d07y265gmmuvt4z0w9aw880jnsr700jc88vt0",
      "name": "custom"
    }
  ],
  "metadata": "ipfs://CID",
  "deposit": "10000000000uscrt",
  "title": "remove schedule",
  "summary": "summary",
  "expedited": false
}
```

**Key Innovation: Implicit Hash Consensus**

The core breakthrough is the addition of an `implicit_hash` field to Tendermint block headers, enabling **deterministic consensus on scheduled execution**.

**Header Extension**: Tendermint block headers now include `implicit_hash` - a SHA-256 hash of scheduled messages for the next round.

**Two-Phase Execution**:

1. **Commitment Phase (Block N-1 EndBlock)**: Calculate hash of scheduled messages → store in `tm-secret-enclave`
2. **Execution Phase (Block N BeginBlock)**: Retrieve hash → include in header → verify and execute

**Architecture**

The implementation requires coordinated changes across five repositories:

| Repository            | Role                  | Key Changes                                           |
| --------------------- | --------------------- | ----------------------------------------------------- |
| **SecretNetwork**     | Application Logic     | Cron scheduling, message encryption, hash calculation |
| **tm-secret-enclave** | Secure State Bridge   | Cross-block hash storage                              |
| **tendermint-go**     | Consensus Integration | Header creation with implicit hash                    |
| **cosmos-sdk**        | ABCI Coordination     | Header propagation across ABCI methods                |
| **tendermint-rs**     | Rust Validation       | Header structure validation                           |

**Execution Flow**

<figure><img src="../.gitbook/assets/Editor _ Mermaid Chart-2025-06-27-134120.png" alt=""><figcaption></figcaption></figure>

**Message Types**

The formats are as follows:

**MsgAddSchedule** - adds new schedule to the cron module:

```protobuf
message MsgAddSchedule {
  string authority = 1;                    // Governance account address
  string name = 2;                         // Schedule identifier
  uint64 period = 3;                       // Execution interval in blocks
  repeated MsgExecuteContract msgs = 4;    // Messages to execute
}
```

**MsgRemoveSchedule** - removes schedule from the cron module:

```protobuf
message MsgRemoveSchedule {
  string authority = 1;                    // Governance account address
  string name = 2;                         // Schedule identifier to remove
}
```

**MsgExecuteContract** - contract execution specification:

```protobuf
message MsgExecuteContract {
  string contract = 1;                     // Smart contract address
  string msg = 2;                          // JSON-encoded message
}
```

After collecting all schedules ready for execution, we execute them in order.

For each schedule, every stored msg is complemented with more necessary fields to form `wasmtypes.MsgExecuteContract`:

```go
// wasmtypes.MsgExecuteContract
msg := types.MsgExecuteContract{
    Sender:    senderAddr,        // Cron module account
    Contract:  contractAddr,      // Passed with Schedule.Msgs
    Msg:       encryptedMsg,      // Encrypted message content
    SentFunds: sdk.NewCoins(),    // Empty Coins
}
```

Then it's executed using wasmd WasmMsgServer implementation within the secure enclave.

For state to be modified, all messages in a given schedule should return successful result. If any cosmwasm msg fails to execute for any reason, all messages in a given schedule will be rolled back.
