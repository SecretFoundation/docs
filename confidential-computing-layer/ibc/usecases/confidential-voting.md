---
description: >-
  A fullstack  tutorial for cross-chain confidential voting on IBC-connected
  chains.
---

# Confidential Voting

## Overview <a href="#overview" id="overview"></a>

This tutorial explains how to upload a confidential voting contract on Secret Network, which you can execute and query for private voting on any IBC-connected chain. 🚀&#x20;

{% hint style="info" %}
In this example,  **you will learn how to deploy a confidential voting contract on Secret Network which you will execute from Osmosis mainnet**.&#x20;
{% endhint %}

**The SDK abstracts IBC interactions with the Secret Network for applications that use Cosmos wallets**. It introduces a secure method for generating confidential messages and reliably authenticating users at the same time using the `chacha20poly1305` algorithm.

{% hint style="info" %}
View the typescript SDK [here](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/tree/main/next-frontend/src/ccl-sdk), which we will learn how to implement shortly :tada:
{% endhint %}

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

[**Create Proposal**](confidential-voting.md#overview)**:**&#x20;

```rust
  const create_proposal = async (name: string, description: string, end_time: string = "60") => {
    const contract = contractConfig.votes;
    const msg = { create_proposal: { name, description, end_time } }
    return await execute_gateway_contract(contract, msg);
  }
```

[**Vote on Proposal**](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1aa91625546547960fd9556e17f14f31d99d726f/next-frontend/src/functions/Gateway.ts#L71)**:**&#x20;

```rust
 const vote_proposal = async (proposal_id: string, vote: string) => {
    const contract = contractConfig.votes;
    const msg = { vote: { proposal_id, vote } }
    return await execute_gateway_contract(contract, msg);
  }
```

Both of these functions access a confidential voting `contract` already deployed on Secret Network (at the end of this tutorial, you will learn how to deploy your own).&#x20;

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

There are two types of queries using the CCL SDK:&#x20;

1. **Unauthenticated queries** ie `Extension`, which are queries that don’t require sensitive or protected data. Example: Retrieving a list of proposals or votes, which is public.
2. **Authenticated queries** ie `Inner Queries` (`WithPermit`, `WithAuthData`), which are queries that require `auth_data` from the caller for permission validation. Example: `MyVote { proposal_id }` retrieves a user-specific vote.

|   | **Extended Queries** | **Inner Queries** |
| - | -------------------- | ----------------- |

| **Data Access Level** | Public or general data | Private or user-specific data |
| --------------------- | ---------------------- | ----------------------------- |

| **Authorization** | No extra authentication required | Requires `auth_data` or `permit` |
| ----------------- | -------------------------------- | -------------------------------- |

| **Processing Function** | `query::query_extended` | `query::query_with_auth_data` |
| ----------------------- | ----------------------- | ----------------------------- |

| **Use Cases** | Public info like proposals, votes | Personal data like a user’s vote |
| ------------- | --------------------------------- | -------------------------------- |

To query encrypted votes using the CCL SDK, use the `enum` [`InnerQueries`](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1aa91625546547960fd9556e17f14f31d99d726f/deploy-scripts/contracts/secret-voting/src/msg.rs#L35), which wraps the possible queries in the voting smart contract, namely, `MyVote`, with the CCL SDK encryption logic:

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

`InnerMethods` leverages the SDK by using the [`GatewayQueryMsg`](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1aa91625546547960fd9556e17f14f31d99d726f/deploy-scripts/packages/sdk/src/gateway.rs#L33) types to query encrypted cross-chain votes. You have the choice of using two different types of encrypted queries: `query_with_auth_data` and `query_with_permit.` In this tutorial,  you we will learn how to implement `query_with_permit`.&#x20;

1. [WithAuthData](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1429ba2e713f8156f4a82a782827dd1830628865/deploy-scripts/contracts/secret-voting/src/query.rs#L31):

```rust
pub fn query_with_auth_data(
    deps        :   Deps, 
    env         :   Env, 
    auth_data   :   CosmosAuthData,
    query       :   InnerQueries
) -> StdResult<Binary> {
    auth_data.verify(deps.api)?;
    auth_data.check_data(deps.storage, &env)?;
    let address = auth_data.primary_address()?;
    query_inner(deps, env,address, query)
}
```

2. [WithPermit](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1429ba2e713f8156f4a82a782827dd1830628865/deploy-scripts/contracts/secret-voting/src/query.rs#L12):

```rust
pub fn query_with_permit(
    deps        :   Deps, 
    env         :   Env, 
    permit      :   Permit,
    hrp         :   Option<String>,
    query       :   InnerQueries
) -> StdResult<Binary> {
    let address = secret_toolkit::permit::validate(
        deps, 
        PERMIT_PREFIX, 
        &permit, 
        env.contract.address.to_string(), 
        hrp.as_deref()
    )?;
    query_inner(deps, env, address, query)
}
```

Now let's take a look at the frontend code to see how query\_with\_permit is implemente&#x64;**.** :smile:

### **Frontend Query Logic**&#x20;

The Next.js query decryption logic can be found in [Gateway.ts](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/main/next-frontend/src/functions/Gateway.ts):

[Query proposals](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1aa91625546547960fd9556e17f14f31d99d726f/next-frontend/src/functions/Gateway.ts#L163):&#x20;

```rust
const query_proposals = (): Promise<[number, Proposal][]> => {
    return query_contract_public(contractConfig.votes, { extension: { query: { proposals: { } } } });
  }
```

[Query votes](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1aa91625546547960fd9556e17f14f31d99d726f/next-frontend/src/functions/Gateway.ts#L151C3-L153C4):

```rust
const query_my_vote = (proposal_id: number, message?: string) => {
    return query_contract_auth(contractConfig.votes, { my_vote: { proposal_id } }, message);
  }
```

Because votes are encrypted, we must decrypt them in order to query a wallet's votes. The frontend function [`query_contract_auth`](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1aa91625546547960fd9556e17f14f31d99d726f/next-frontend/src/functions/Gateway.ts#L116) securely queries the Secret smart contract using **query permits**, ensuring that only authorized users can access sensitive data. Query permits are cryptographic credentials that:

* Prove the user’s ownership of a wallet.
* Allow contracts to verify the user’s identity.
* Avoid exposing the private key.

```rust
const query_contract_auth = async (
    contract: Contract,
    query: object,
    data: string = "Query Permit"
  ): Promise<any> => {

    const storageKey = `${keplrAddress}:${contract.address}:queryPermit}`;
    const queryPermitStored = localStorage.getItem(storageKey);

    let credential: CosmosCredential;

    if (queryPermitStored) {
      credential = JSON.parse(queryPermitStored) as CosmosCredential;
    } else {
      const toSign: DataToSign = {
        chain_id: "secret-4",
        contract_address: contract.address,
        nonce: toBase64(Random.getBytes(32)),
        data: btoa(data)
      }
      const message = toUtf8(JSON.stringify(toSign));
      const signRes = await (window as any).keplr.signArbitrary(chainId, keplrAddress!, JSON.stringify(toSign))
      credential = {
        message: toBase64(message),
        signature: signRes.signature,
        pubkey: signRes.pub_key.value,
        hrp: keplrAddress!.split("1")[0]
      }
      localStorage.setItem(storageKey, JSON.stringify(credential));
    }
    const res = await queryGatewayAuth(contract, query, [credential]);
    console.log("query:", query, " res:", res);
    return res;
  }
```

You now should have all the tools you need to use the IBC CCL toolkit! Lastly, let's learn how to deploy your own voting contract on Secret Network :clap:

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

Finally, update [config.ts](https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo/blob/1429ba2e713f8156f4a82a782827dd1830628865/next-frontend/src/ccl-sdk/config.ts#L68) with your contract's code\_hash and address:

```typescript
const contractMultiConfig: ContractMultiConfig = {
    votes: {
        address: "secret1jtc7f8cj5hhc2mg9v5uknd84knvythvsjhd66a",
        hash: "ff8443878e8a339637c45c13abc4385c4f0c5668b992afc912e5f59e5d098654"
    },
};
```

## Conclusion

Congratulations on completing this on using Secret Network's IBC SDK to encrypt votes cross-chain using Secret smart contracts! 🎉 You've explored the intricacies of encrypted messaging, cross-chain IBC interactions, and secure smart contract execution using the Secret Network CCL SDK. By building and running the fullstack application, you’ve gained hands-on experience in contract deployment, frontend integration, and secure querying with query permits. 🚀
