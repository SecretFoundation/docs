---
description: >-
  A fullstack  tutorial for cross-chain confidential voting on IBC-connected
  chains.
---

# Confidential Voting

{% hint style="danger" %}
_**In progress - 12/4/24**_
{% endhint %}

### Overview <a href="#overview" id="overview"></a>

<figure><img src="../../../.gitbook/assets/voting header.png" alt="" width="375"><figcaption></figcaption></figure>

Clone the repo:

```bash
git clone https://github.com/writersblockchain/cosmos-ccl-encrypted-payloads-demo
```

`cd` into next-frontend and install the dependencies:&#x20;

```bash
cd next-frontend && npm install
```

Add environment variables in cosmos-ccl-encrypted-payloads-demo/next-frontend:&#x20;

```
NEXT_PUBLIC_SECRET_MNEMONIC=""
NEXT_PUBLIC_SECRET_CHAIN_ENDPOINT="https://lcd.mainnet.secretsaturn.net"
NEXT_PUBLIC_SECRET_CHAIN_ID="secret-4"
NEXT_PUBLIC_SECRET_TOKEN="uscrt"

NEXT_PUBLIC_CONSUMER_MNEMONIC=""
NEXT_PUBLIC_CONSUMER_CHAIN_ENDPOINT="https://rpc.osmosis.zone:443"
NEXT_PUBLIC_CONSUMER_CHAIN_ID="osmosis-1"
NEXT_PUBLIC_CONSUMER_TOKEN="uosmo"
NEXT_PUBLIC_CONSUMER_PREFIX="osmo"
NEXT_PUBLIC_CONSUMER_GAS_PRICE="0.25"
NEXT_PUBLIC_CONSUMER_DECIMALS=6
```

Start the application:

```bash
npm run dev
```

### Understanding the contract

**Execution Messages**

To encrypt proposals and votes using the CCL SDK, use the `enum` called `InnerMethods`, which wraps the possible actions in the voting smart contract, namely, `CreateProposal` and `Vote,` with the CCL SDK encryption logic:

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

Which translates to:

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

**Query Messages**

To query encrypted votes using the CCL SDK, use the `enum` called `InnerQueries`, which wraps the possible queries in the voting smart contract, namely, `MyVote`, with the CCL SDK encryption logic:

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

Which translates to:

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
