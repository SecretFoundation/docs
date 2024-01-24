---
description: >-
  Learn how to use Secret Network smart contracts to encrypt and decrypt votes
  on Polygon testnet.
---

# EVM Confidential Voting

## Intro

In this tutorial you will learn **how to encrypt and decrypt votes on the EVM** with Secret Network smart contracts so that you can build confidential voting on any EVM chain of your choosing. You will be working with two smart contracts:

1. [EVM smart contract](https://github.com/scrtlabs/examples/blob/master/evm-confidential-voting/polygon/contracts/PrivateVoting.sol) deployed on Polygon testnet (voting contract)
2. [Secret Network smart contract](https://github.com/scrtlabs/examples/blob/master/evm-confidential-voting/secret-network/src/contract.rs) deployed on Secret testnet (decryption contract)

**The EVM contract stores encrypted proposals and votes, and the Secret contract decrypts the stored votes and reveals them in a query.**&#x20;

{% hint style="success" %}
See a [live demo here](https://private-voting.vercel.app/), configured for Polygon testnet! _(To use the demo, make sure Polygon testnet is added to your Metamask wallet)_&#x20;
{% endhint %}

You will start by configuring your developer environment and then learn how to generate cryptographic keys in a Secret Network smart contract which you will use to encrypt votes on the EVM. To learn more about Secret Network encryption, see the EVM encryption docs [here](evm-encryption-decryption-with-secret-contracts.md#encryption-scheme-overview).&#x20;

## Getting Started

To get started, clone the [Secret Labs examples repo](https://github.com/scrtlabs/examples):&#x20;

```bash
git clone https://github.com/scrtlabs/examples.git
```

### EVM Prerequisites&#x20;

1. [Add Polygon Mumbai testnet to Metamask](https://docs.polygon.technology/tools/wallets/metamask/add-polygon-network/).
2. [Fund your Mumbai wallet](https://faucet.polygon.technology/).&#x20;

### Secret Network Prerequisites

1. [Add Secret Network testnet to Keplr](https://keplr-connect-pulsar3.vercel.app/).&#x20;
2. [Fund your Secret testnet wallet](https://faucet.pulsar.scrttestnet.com/).&#x20;

### Configuring Environment Variables

`cd` into examples/evm-confidential-voting/polygon:

```bash
cd examples/evm-confidential-voting/polygon
```

Install the node dependencies:

```bash
npm install
```

Update the `env` [file](https://github.com/scrtlabs/examples/blob/master/evm-confidential-voting/polygon/.env) with your Secret Network wallet mnemonic, EVM wallet private key, and [Infura](https://www.infura.io/) API key:

<figure><img src="../../.gitbook/assets/confidential voting env.png" alt=""><figcaption></figcaption></figure>

{% hint style="info" %}
Make sure your Infura API key is configured for Polygon Matic testnet 😎
{% endhint %}

Next, generate encryption keys for your EVM contract and automatically add them to your  `env` file by running `create_keys.js`:&#x20;

```bash
npx hardhat --network polygon run ./scripts/create_keys.js
```

Now you are ready to upload the smart contracts! [🚀](https://emojipedia.org/rocket)

## Upload and Instantiate Secret contract

`cd` into examples/evm-confidential-voting/secret-network:

<pre class="language-bash"><code class="lang-bash"><strong>cd examples/evm-confidential-voting/secret-network
</strong></code></pre>

Compile the Secret Network smart contract:

```bash
make build-mainnet
```

{% hint style="info" %}
If you are on a Mac and run into compilation error:

`error occurred: Command “clang”`

Make sure you have the [latest version](https://developer.apple.com/download/applications/) of Xcode installed and then update your clang path by running the following in your terminal:&#x20;

\
`cargo clean`

`AR=/opt/homebrew/opt/llvm/bin/llvm-ar CC=/opt/homebrew/opt/llvm/bin/clang cargo build --release --target wasm32-unknown-unknown`\
\
See [here](https://github.com/rust-bitcoin/rust-secp256k1/issues/283#issuecomment-1670222980) for instructions on updating your clang path.&#x20;
{% endhint %}

`cd` into examples/evm-confidential-voting/secret-network/node

```bash
cd examples/evm-confidential-voting/secret-network/node
```

Install the node dependencies:&#x20;

```bash
npm install
```

Upload the Secret Network smart contract:

```bash
node index 
```

Upon successful upload a `codeHash` and contract `address` is returned:&#x20;

```bash
Starting deployment…
codeId:  3226
Contract hash: 4fb0433133d3e9441790ab713ad8000bb99c3894a36b679f355ffaea052035b9
Instantiating contract…
contract address:  secret1lft908ws8h034zpa6y2gsq2shpsksekl05gqgq
```

Update the `env` file with your `codeHash` and contract `address`:&#x20;

<figure><img src="../../.gitbook/assets/confidential voting env - updated.png" alt=""><figcaption></figcaption></figure>

## Execute Secret Network Smart Contract

Now that your Secret Network smart contract is instantiated, you can execute the contract **to generate encryption keys as well as decrypt encrypted messages**. To learn more about the encryption schema, see the EVM encryption docs [here](evm-encryption-decryption-with-secret-contracts.md#encryption-scheme-overview).

### Create Keys

To create encryption keys, run `node create_keys`:&#x20;

```bash
node create_keys
```

After you generate your keys successfully, query your public key:

```bash
node get_keys
```

Which returns your public key as a `string`:&#x20;

```markup
2,251,34,75,188,184,127,245,254,38,103,132,60,248,107,222,239,201,55,224,56,34,139,127,66,213,21,19,126,68,113,76,233
```

Add the public\_key to your `env` file:

```properties
SECRET_PUBLIC_KEY=2,251,34,75,188,184,127,245,254,38,103,132,60,248,107,222,239,201,55,224,56,34,139,127,66,213,21,19,126,68,113,76,233
```

Now it's time to upload a Voting contract to the EVM, which you will use to **store encrypted votes that can only be decrypted by your Secret Network smart contract.**&#x20;

## Upload and Instantiate Polygon Smart Contract

`cd` into examples/evm-confidential-voting/polygon:

```bash
cd evm-confidential-voting/polygon
```

Compile your Solidity smart contract:&#x20;

```bash
npx hardhat compile
```

Once the contract is compiled successfully, upload the contract to Polygon testnet:&#x20;

<pre class="language-bash"><code class="lang-bash"><strong>npx hardhat run scripts/deploy.js --network polygon
</strong></code></pre>

Note the contract address:

```bash
PrivateVoting deployed to: 0x90c6C32994c622f3882579C76C4b4c41022da494
```

&#x20;Add the Polygon testnet contract address to your `env` file:

```bash
CONTRACT_ADDRESS="0x90c6C32994c622f3882579C76C4b4c41022da494"
```

## Execute Polygon Testnet Smart Contract

Now that your Polygon smart contract is instantiated, you can execute the contract to **create voting proposals as well as vote on existing proposals**. You can review the solidity contract [here](https://github.com/scrtlabs/examples/blob/master/evm-confidential-voting/polygon/contracts/PrivateVoting.sol).&#x20;

### Create Voting Proposal

To create a [proposal](https://github.com/scrtlabs/examples/blob/master/evm-confidential-voting/polygon/scripts/create\_proposal.js), you must include a **proposal description** (a "yes" or "no" question) as well as a **quorum** number, which is the number of unique wallet addresses required to vote on the proposal before it closes.&#x20;

{% hint style="info" %}
For testing purposes, set `quorum` to 1 unless you want to test with multiple wallet addresses
{% endhint %}

```solidity
  function createProposal(string memory description, uint quorum) external returns (uint proposalId) {
        proposalId = nextProposalId;
        nextProposalId++;
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.description = description;
        proposal.quorum = quorum;
        emit ProposalCreated(proposalId, description);
    }
```

Open `create_proposal.js` and update the [proposal\_description](https://github.com/scrtlabs/examples/blob/d80bb3a801bdedf12f314fd373e92b4f1768562c/evm-confidential-voting/polygon/scripts/create\_proposal.js#L11) to a "yes" or "no" question of your choice:

```javascript
const proposal_description = "Do you love Secret?";
```

Then run `create_proposal.js`:&#x20;

```bash
npx hardhat --network polygon run ./scripts/create_proposal.js
```

A `transaction hash` will be returned upon successful execution:&#x20;

```bash
Transaction hash: 0x1b26f860328a4f01236dac49cd20cfe4a06a80826514bb7a46a7ec890886ca4c
Create Proposal function executed successfully!
```

You can query the proposal by running `query_by_proposal_id`:

```bash
npx hardhat --network polygon run ./scripts/query_by_proposal_id.js
```

{% hint style="info" %}
Be sure to update the `proposalId` in [query\_by\_proposal\_id.js](https://github.com/scrtlabs/examples/blob/9c4d965b02501b07276cf2c9ba3f9f783a4e4bc1/evm-confidential-voting/polygon/scripts/query\_by\_proposal\_id.js#L31) with the `proposalId` you want to query!
{% endhint %}

Which returns your proposal:&#x20;

```bash
Fetched Proposal: { id: 1, description: 'Do you love Secret?', quorum: 1, voteCount: 0 }
```

{% hint style="info" %}
Each time you create a proposal, the **`proposalId`** is incremented by 1. Your first **`proposalId`** is 1, your next **`proposalId`**will be 2, and so on.&#x20;
{% endhint %}

### Vote on Proposal

Now it's time to vote on the proposal you created. Open [`vote.js`](https://github.com/scrtlabs/examples/blob/master/evm-confidential-voting/polygon/scripts/vote.js) and update your proposal answer to either "yes" or "no" in the `msg object:`&#x20;

```javascript
let msg = {
    answer: "yes",
    proposal_id: proposal.id,
    proposal_description: proposal.description,
    salt: Math.random(),
  };
```

`proposal.id` and `proposal.description` will match the proposal info you input for `getProposalById.`&#x20;

{% hint style="info" %}
**This means that each time you vote, you need to make sure you update the `proposal_id` number that you pass to `getProposalById()` so that it matches the proposal you want to vote on!**&#x20;
{% endhint %}

```javascript
let proposal = await getProposalById(1);
```

Once you have updated your `vote` and `proposalId`, execute the vote script:&#x20;

```bash
npx hardhat --network polygon run ./scripts/vote.js
```

Your encrypted data and transaction hash are returned upon successful execution:&#x20;

```bash
Encrypted data: Uint8Array(120) [
  115,  69,  78, 152,  84,  64, 134,  83, 152, 110,  15, 162,
   90, 131,  84,  73, 128, 158, 159,  39, 103,   8, 131, 246,
   61,  95, 230, 131, 220,  79,  25,  68, 203, 174, 180, 168,
  244,  71, 125, 190,  46, 173, 207, 217, 150, 249, 150, 223,
   69, 229,  64,  98, 255, 145, 141, 136, 158, 181,  97, 137,
  148,  71,  25, 213, 184, 165, 116, 224,  80, 201, 138, 211,
    3, 112, 237, 103, 209,  77, 200,  23,  52, 178, 220, 147,
  143, 153, 120, 151,  74, 140, 137, 174,  86,   3,  38, 200,
   64, 197, 168, 165,
  ... 20 more items
]
Transaction hash: 0xd69235d34c0c326cf224661264035feec453eacd5749cbabdf7a018b6285d4f2
vote function executed successfully!
```

## Decrypt Votes

Now it's time to decrypt your vote! First, query that the vote was successfully added to the proposal by running `query_proposal_votes.js`: &#x20;

{% hint style="info" %}
Be sure to update the [`proposalId`](https://github.com/scrtlabs/examples/blob/0281fc4bef181e583a88c938107287df35c335d2/evm-confidential-voting/polygon/scripts/query\_proposal\_votes.js#L25) with the proposal you want to query.&#x20;
{% endhint %}

```bash
npx hardhat --network polygon run ./scripts/query_proposal_votes.js
```

`query_proposal_vote` returns your encrypted vote for the supplied `proposalId`:&#x20;

```bash
[
  '0x73454e9854408653986e0fa25a835449809e9f27670883f63d5fe683dc4f1944cbaeb4a8f4477dbe2eadcfd996f996df45e54062ff918d889eb56189944719d5b8a574e050c98ad30370ed67d14dc81734b2dc938f9978974a8c89ae560326c840c5a8a5be6dc79233f0bd9ed378e18ab56aa447e8c46883'
]
```

Run `decrypt.js` to decrypt the vote:&#x20;

```bash
npx hardhat --network polygon run ./scripts/decrypt.js
```

{% hint style="info" %}
In [`decrypt.js`](https://github.com/scrtlabs/examples/blob/master/evm-confidential-voting/polygon/scripts/decrypt.js#L29), update the [`proposalId`](https://github.com/scrtlabs/examples/blob/bb3fc88b9e1f0d835bd6bd73502eca07fa02f6ed/evm-confidential-voting/polygon/scripts/decrypt.js#L29) with the proposal you want to query.&#x20;
{% endhint %}

Which returns your decrypted vote:

```bash
{
  votes: [
    '{"answer":"yes","proposal_id":1,"proposal_description":"Do you love Secret?","salt":0.20849165534651148}'
  ]
}
```

### Conclusion

Congrats! You have now deployed smart contracts on Polygon and Secret Network and implemented private cross-chain voting. If you have any questions or run into any issues, post them on the [Secret Developer Discord ](https://discord.gg/secret-network-360051864110235648)and somebody will assist you shortly.&#x20;
