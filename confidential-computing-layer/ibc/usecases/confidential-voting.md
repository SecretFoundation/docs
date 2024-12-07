---
description: >-
  A fullstack  tutorial for cross-chain confidential voting on IBC-connected
  chains.
---

# Confidential Voting

## Overview <a href="#overview" id="overview"></a>

This tutorial explains how to upload a confidential voting contract on Secret Network, which you can execute and query for private voting on any IBC-connected chain. 🚀 In this example,  **you will learn how to deploy a confidential voting contract on Secret Network which you will execute from Osmosis mainnet**.&#x20;

In this tutorial you will learn:&#x20;

1. How to run the fullstack cross-chain Next.js application in your browser.&#x20;
2. How to use the core smart contract logic for confidential cross-chain votes and proposals using IBC hooks.&#x20;
3. How to deploy your very own voting contract on Secret Network.&#x20;

{% hint style="info" %}
See a fullstack demo[ here](https://cosmos-ccl-encrypted-payloads-demo-89b2.vercel.app/)!
{% endhint %}

<figure><img src="../../../.gitbook/assets/voting header.png" alt="" width="375"><figcaption><p>Fullstack Confidential Voting on Secret Network</p></figcaption></figure>

{% hint style="info" %}
The only requirement for using Secret Network's IBC toolkit is an existing IBC transfer channel. 🤓 You can view existing channels [here](https://www.mintscan.io/secret/relayers) or [create](https://ibc.cosmos.network/tutorials/channel-upgrades/open-channel/) a channel of your own.&#x20;
{% endhint %}

## Getting Started

Clone the repo:

```bash
git clone https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo
```

`cd` into `next-frontend` and install the dependencies:&#x20;

```bash
cd next-frontend && npm install
```

Add [environment variables](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/main/next-frontend/.env) in `cosmos-ccl-encrypted-payloads-demo/next-frontend`:&#x20;

```bash
NEXT_PUBLIC_SECRET_CHAIN_ENDPOINT="https://lcd.mainnet.secretsaturn.net"
NEXT_PUBLIC_SECRET_CHAIN_ID="secret-4"
NEXT_PUBLIC_CONSUMER_CHAIN_ID="osmosis-1"
```

Start the application:

```bash
npm run dev
```

The fullstack Next.js application should now be running in your browser! You can use it to create confidential votes and proposals. Now that you have the application running in your browser, let's dive into the smart contract logic!&#x20;

## Understanding the contract

### **Execution Messages**

To encrypt proposals and votes using the SDK, we use the `enum` called [`InnerMethods`](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1aa91625546547960fd9556e17f14f31d99d726f/deploy-scripts/contracts/secret-voting/src/msg.rs#L13), which wraps the possible actions in the voting smart contract, namely, [`CreateProposal`](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1aa91625546547960fd9556e17f14f31d99d726f/deploy-scripts/contracts/secret-voting/src/contract.rs#L69) and [`Vote`](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1aa91625546547960fd9556e17f14f31d99d726f/deploy-scripts/contracts/secret-voting/src/contract.rs#L97), with the  SDK encryption logic:

```rust
#[cw_serde]
pub enum InnerMethods {
    CreateProposal {
        name: String,
        description: String,
        end_time: Uint64
    },

    Vote {
        proposal_id: Uint64,
        vote: VoteOption
    },
}

pub type ExecuteMsg   =   GatewayExecuteMsg<InnerMethods>;
```

`InnerMethods` leverage the SDK by using the [`GatewayExecuteMsg`](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1aa91625546547960fd9556e17f14f31d99d726f/deploy-scripts/packages/sdk/src/gateway.rs#L9) to structure encrypted execution messages for cross-chain proposal management and voting:

```rust
#[cw_serde]
pub enum ExecuteMsg {

    Encrypted {
        payload             :   Binary,
        payload_signature   :   Binary,
        payload_hash        :   Binary,
        user_key            :   Binary,
        nonce               :   Binary,
    }

    ResetEncryptionKey  { },

    Extension {
        msg: {
            CreateProposal { ... }   /   Vote { ... },   
        }
    }
}
```

**Understanding the Encryption SDK**

The magic of Secret Network's encryption SDK happens [here](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1aa91625546547960fd9556e17f14f31d99d726f/deploy-scripts/contracts/secret-voting/src/contract.rs#L49C5-L54C8), with `handle_encrypted_wrapper:`&#x20;

```rust
let (
        msg, 
        info
    ) = sdk::handle_encrypted_wrapper(
        deps.api, deps.storage, info, msg
    )?;
```

The `Extension` variant in`ExecuteMsg` leverages the functionality of `handle_encrypted_wrapper` because the wrapper decrypts and verifies the entire message payload before the `Extension` message is processed. Here’s how it works:

1. **`handle_encrypted_wrapper` Applies to the Entire Input:**
   * When the `execute` function is called, the `msg` and `info` parameters are initially encrypted.
   *   `handle_encrypted_wrapper` is invoked with these parameters:

       ```rust
        let (msg, info) = sdk::handle_encrypted_wrapper(deps.api, deps.storage, info, msg)?;
       ```
   * This function decrypts and verifies the wrapper (encrypted payload) to produce:
     * A decrypted `msg` (of type `ExecuteMsg`).
     * A decrypted `info` (with verified sender details).
2. **Decrypted `msg` Can Contain `ExecuteMsg::Extension`:**
   * After decryption, the `msg` can match any variant of `ExecuteMsg`, including `ExecuteMsg::Extension`.
   *   For example:

       ```rust
       ExecuteMsg::Extension { msg } => {
           match msg {
               InnerMethods::CreateProposal { name, description, end_time } => { /* logic */ },
               InnerMethods::Vote { proposal_id, vote } => { /* logic */ },
           }
       },
       ```
   * Here, `Extension` contains an additional layer of messages (`InnerMethods`) which define specific functionality.
3. **How `handle_encrypted_wrapper` Affects `Extension`:**
   * The `msg` inside `ExecuteMsg::Extension` (i.e., `InnerMethods`) is also encrypted in the original input.
   * `handle_encrypted_wrapper` ensures:
     * The outer `msg` is decrypted (revealing `Extension`).
     * The inner data (e.g., `InnerMethods`) is now in cleartext and ready for logical execution.
   * Without this decryption, the contract could not access or process `InnerMethods` within the `Extension`.
4. **Validation and Security:**
   * By verifying and decrypting the entire payload at the wrapper level, the contract ensures:
     * The `Extension` message is authentic and unaltered.
     * The sender (`info`) is authenticated and valid.
     * Any operations within `InnerMethods` (like creating proposals or voting) are authorized based on the decrypted `info` and secure data.

### **Frontend Encryption Logic**&#x20;

Now that you understand how the encryption SDK functions, let's look how it's connected to the frontend. The Next.js encryption logic can be found in [Gateway.ts](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/main/next-frontend/src/functions/Gateway.ts):

[Create Proposal](confidential-voting.md#overview):&#x20;

```rust
  const create_proposal = async (name: string, description: string, end_time: string = "60") => {
    const contract = contractConfig.votes;
    const msg = { create_proposal: { name, description, end_time } }
    return await execute_gateway_contract(contract, msg);
  }
```

[Vote on Proposal](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1aa91625546547960fd9556e17f14f31d99d726f/next-frontend/src/functions/Gateway.ts#L71):&#x20;

```rust
 const vote_proposal = async (proposal_id: string, vote: string) => {
    const contract = contractConfig.votes;
    const msg = { vote: { proposal_id, vote } }
    return await execute_gateway_contract(contract, msg);
  }
```

Both of these functions access a confidential voting `contract` we have previously deployed on Secret Network contract.&#x20;

Then, we call the `execute_gateway_contract` function, which is where all of the cross-chain SDK logic is implemented using IBC hooks:&#x20;

```rust
const execute_gateway_contract = async (contract: Contract, msg: object) => {
    const ibcConfig = loadIbcConfig(chainId);
    const keplrOfflineSigner = (window as any).getOfflineSigner(chainId);

    const response = await sendIBCToken(
      cosmosjs!,
      keplrAddress!,
      contract.address,
      token!,
      "1",
      ibcConfig.consumer_channel_id,
      await gatewayChachaHookMemo(
        keplrOfflineSigner,
        { extension: { msg } },
        chainId!,
        contract,
      )
    );
    return response;
  };
```

You can further examine `sendIBCToken` and `gatewayChachaHookMemo` in the CCL-SDK `ibc.ts` file [here](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/main/next-frontend/src/ccl-sdk/ibc.ts).&#x20;

### **Query Messages**

To query encrypted votes using the CCL SDK, use the `enum` called [`InnerQueries`](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1aa91625546547960fd9556e17f14f31d99d726f/deploy-scripts/contracts/secret-voting/src/msg.rs#L35), which wraps the possible queries in the voting smart contract, namely, `MyVote`, with the CCL SDK encryption logic:

```rust
#[cw_serde]
pub enum ExtendedQueries {
    Proposals {},
    Proposal { proposal_id: u64 },
    AllVotes { proposal_id: u64 },
}

#[cw_serde]
pub enum InnerQueries {
    MyVote { proposal_id: u64 },
}

pub type QueryMsg   =   GatewayQueryMsg<InnerQueries, sdk::CosmosAuthData, ExtendedQueries>;
```

`InnerMethods` leverage the SDK by using the [`GatewayQueryMsg`](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1aa91625546547960fd9556e17f14f31d99d726f/deploy-scripts/packages/sdk/src/gateway.rs#L33) types to structure to query encrypted query cross-chain votes:

```rust
#[cw_serde]
pub enum QueryMsg {
    EncryptionKey  {},

    WithAuthData {
        auth_data    :   sdk::CosmosAuthData,
        query        :   { MyVote { proposal_id: u64 } }
    },

    WithPermit {
        permit       :   secret_toolkit::permit::Permit,
        hrp          :   Option<String>,
        query        :   { MyVote { proposal_id: u64 } }
    },

    Extension {
        query        :  { Proposals {}  /  Proposal { proposal_id: u64 }  /  AllVotes { proposal_id: u64 }  }
    }
}
```

## How to upload a voting contract to Secret Network

`cd` into `deploy-scripts` and install the dependencies:&#x20;

```bash
cd deploy-scripts && npm install
```

Add your wallet mnemonic to [`.env`](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/main/deploy-scripts/.env).  Then compile the contract:&#x20;

```bash
make build-mainnet-reproducible
```

{% hint style="info" %}
The compile script requires [Docker](https://www.docker.com/) to be open for successful compilation
{% endhint %}

Compile the typescript upload script so you can upload the compiled voting contract:&#x20;

```bash
npm run build
```

Once you run the above command, the typescript upload file in .`/src` will be compiled as javascript file in `./dist`.

Upload and instantiate the voting contract on Secret Network Mainnet:

```bash
node dist/deploy_voting.js
```

In your terminal, a `codeID`, `codeHash`, and `contractAddress` will be returned:

```
"code_id": 8882,
"code_hash": "f3c2e28cd1574d128ded60ce967cdb46f7515d807be49127bcc9249c5fd97802",
"address": "secret1q0mycclu927u5m0tn50zgl5af4utrlkzz706lm"
```

## Conclusion

{% hint style="danger" %}
_**In progress 12.6.24**_
{% endhint %}
