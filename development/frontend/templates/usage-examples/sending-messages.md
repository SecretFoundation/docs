---
description: Learn how to send messages with SecretJS.
---

# Sending Messages

### Secret Network Client setup

```javascript
import { SecretNetworkClient, Wallet } from "secretjs";

const wallet = new Wallet("Your mnemonic words go here");

const secretjs = new SecretNetworkClient({
  chainId: "pulsar-3",
  url: "https://api.pulsar3.scrttestnet.com",
  wallet: wallet,
  walletAddress: wallet.address,
});
```

### SecretJS Messages

On a signer secret.js, `secretjs.tx` is used to broadcast transactions. Every function under `secretjs.tx` can receive an optional [TxOptions](https://secretjs.scrt.network/modules#TxOptions).

[**Full API »**](https://secretjs.scrt.network/modules#TxSender)

[**`secretjs.tx.broadcast()`**](https://secretjs.scrt.network/#secretjstxbroadcast)

Used to send a complex transactions, which contains a list of messages. The messages are executed in sequence, and the transaction succeeds if all messages succeed.

For a list of all messages see: [https://secretjs.scrt.network/interfaces/Msg](https://secretjs.scrt.network/interfaces/Msg)

```ts
const addMinterMsg = new MsgExecuteContract({
  sender: MY_ADDRESS,
  contract_address: MY_NFT_CONTRACT,
  code_hash: MY_NFT_CONTRACT_CODE_HASH, // optional but way faster
  msg: { add_minters: { minters: [MY_ADDRESS] } },
  sent_funds: [], // optional
});

const mintMsg = new MsgExecuteContract({
  sender: MY_ADDRESS,
  contract_address: MY_NFT_CONTRACT,
  code_hash: MY_NFT_CONTRACT_CODE_HASH, // optional but way faster
  msg: {
    mint_nft: {
      token_id: "1",
      owner: MY_ADDRESS,
      public_metadata: {
        extension: {
          image: "https://scrt.network/secretnetwork-logo-secondary-black.png",
          name: "secretnetwork-logo-secondary-black",
        },
      },
      private_metadata: {
        extension: {
          image: "https://scrt.network/secretnetwork-logo-primary-white.png",
          name: "secretnetwork-logo-primary-white",
        },
      },
    },
  },
  sent_funds: [], // optional
});

const tx = await secretjs.tx.broadcast([addMinterMsg, mintMsg], {
  gasLimit: 200_000,
});
```

[**`secretjs.tx.simulate()`**](https://secretjs.scrt.network/#secretjstxsimulate)

Used to simulate a complex transactions, which contains a list of messages, without broadcasting it to the chain. Can be used to get a gas estimation or to see the output without actually committing a transaction on-chain.

The input should be exactly how you'd use it in `secretjs.tx.broadcast()`, except that you don't have to pass in `gasLimit`, `gasPriceInFeeDenom` & `feeDenom`.

Notes:

* On mainnet, it's recommended to not simulate every transaction as this can burden your node provider. Instead, use this while testing to determine the gas limit for each of your app's transactions, then in production use hard-coded values.
* Gas estimation is known to be a bit off, so you might need to adjust it a bit before broadcasting.
* `MsgInstantiateContract`, `MsgExecuteContract`, `MsgMigrateContract`, `MsgUpdateAdmin` & `MsgClearAdmin` simulations are not supported for security reasons.

```ts
const sendToAlice = new MsgSend({
  from_address: bob,
  to_address: alice,
  amount: stringToCoins("1uscrt"),
});

const sendToEve = new MsgSend({
  from_address: bob,
  to_address: eve,
  amount: stringToCoins("1uscrt"),
});

const sim = await secretjs.tx.simulate([sendToAlice, sendToEve]);

const tx = await secretjs.tx.broadcast([sendToAlice, sendToEve], {
  // Adjust gasLimit up by 10% to account for gas estimation error
  gasLimit: Math.ceil(sim.gasInfo.gasUsed * 1.1),
});
```

[**`secretjs.tx.signTx()`**](https://secretjs.scrt.network/#secretjstxsigntx)

Used to sign transactions independently from the broadcast process.\
This is useful when you want to keep your seed safe and sign transactions offline.

[**`secretjs.tx.broadcastSignedTx()`**](https://secretjs.scrt.network/#secretjstxbroadcastsignedtx)

Used to send offline signed transactions.

```ts
const bob = "secret1dgqnta7fwjj6x9kusyz7n8vpl73l7wsm0gaamk";
const msg = new MsgSend({
  from_address: myAddress,
  to_address: bob,
  amount: stringToCoins("1000000uscrt"),
});

let signedTX = await secretjs.tx.signTx([msg], {
  gasLimit: 20_000,
  gasPriceInFeeDenom: 0.1,
  feeDenom: "uscrt",
});

let tx = await secretjs.tx.broadcastSignedTx(signedTX);
```

[**`secretjs.tx.authz.exec()`**](https://secretjs.scrt.network/#secretjstxauthzexec)

MsgExec attempts to execute the provided messages using authorizations granted to the grantee. Each message should have only one signer corresponding to the granter of the authorization.

Input: [MsgExecParams](https://secretjs.scrt.network/interfaces/MsgExecParams)

[**`secretjs.tx.authz.exec.simulate()`**](https://secretjs.scrt.network/#secretjstxauthzexecsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.authz.grant()`**](https://secretjs.scrt.network/#secretjstxauthzgrant)

MsgGrant is a request type for Grant method. It declares authorization to the grantee on behalf of the granter with the provided expiration time.

Input: [MsgGrantParams](https://secretjs.scrt.network/interfaces/MsgGrantParams)

[**`secretjs.tx.authz.grant.simulate()`**](https://secretjs.scrt.network/#secretjstxauthzgrantsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.authz.revoke()`**](https://secretjs.scrt.network/#secretjstxauthzrevoke)

MsgRevoke revokes any authorization with the provided sdk.Msg type on the granter's account with that has been granted to the grantee.

Input: [MsgRevokeParams](https://secretjs.scrt.network/interfaces/MsgRevokeParams)

[**`secretjs.tx.authz.revoke.simulate()`**](https://secretjs.scrt.network/#secretjstxauthzrevokesimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.bank.multiSend()`**](https://secretjs.scrt.network/#secretjstxbankmultisend)

MsgMultiSend represents an arbitrary multi-in, multi-out send message.

Input: [MsgMultiSendParams](https://secretjs.scrt.network/interfaces/MsgMultiSendParams)

```ts
const tx = await secretjs.tx.bank.multiSend(
  {
    inputs: [
      {
        address: myAddress,
        coins: stringToCoins("2uscrt"),
      },
    ],
    outputs: [
      {
        address: alice,
        coins: stringToCoins("1uscrt"),
      },
      {
        address: bob,
        coins: stringToCoins("1uscrt"),
      },
    ],
  },
  {
    gasLimit: 20_000,
  },
);
```

```
##### `secretjs.tx.bank.multiSend.simulate()`
```

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.bank.send()`**](https://secretjs.scrt.network/#secretjstxbanksend)

MsgSend represents a message to send coins from one account to another.

Input: [MsgSendParams](https://secretjs.scrt.network/interfaces/MsgSendParams)

```ts
const tx = await secretjs.tx.bank.send(
  {
    from_address: myAddress,
    to_address: alice,
    amount: stringToCoins("1uscrt"),
  },
  {
    gasLimit: 20_000,
  },
);
```

[**`secretjs.tx.bank.send.simulate()`**](https://secretjs.scrt.network/#secretjstxbanksendsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.compute.storeCode()`**](https://secretjs.scrt.network/#secretjstxcomputestorecode)

Upload a compiled contract to Secret Network

Input: [MsgStoreCodeParams](https://secretjs.scrt.network/interfaces/MsgStoreCodeParams)

```ts
const tx = await secretjs.tx.compute.storeCode(
  {
    sender: myAddress,
    wasm_byte_code: fs.readFileSync(
      `${__dirname}/snip20-ibc.wasm.gz`,
    ) as Uint8Array,
    source: "",
    builder: "",
  },
  {
    gasLimit: 1_000_000,
  },
);

const codeId = Number(
  tx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
    .value,
);
```

[**`secretjs.tx.compute.storeCode.simulate()`**](https://secretjs.scrt.network/#secretjstxcomputestorecodesimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.compute.instantiateContract()`**](https://secretjs.scrt.network/#secretjstxcomputeinstantiatecontract)

Instantiate a contract from code id

Input: \[MsgInstantiateContractParams]\([https://secretjs.scrt.network/interfaces/MsgInstanti](https://secretjs.scrt.network/interfaces/MsgInstanti)

ateContractParams)

```ts
const tx = await secretjs.tx.compute.instantiateContract(
  {
    sender: myAddress,
    admin: myAddress, // optional admin address that can perform code migrations
    code_id: codeId,
    code_hash: codeHash, // optional but way faster
    initMsg: {
      name: "Secret SCRT",
      admin: myAddress,
      symbol: "SSCRT",
      decimals: 6,
      initial_balances: [{ address: myAddress, amount: "1" }],
      prng_seed: "eW8=",
      config: {
        public_total_supply: true,
        enable_deposit: true,
        enable_redeem: true,
        enable_mint: false,
        enable_burn: false,
      },
      supported_denoms: ["uscrt"],
    },
    label: "sSCRT",
    init_funds: [], // optional
  },
  {
    gasLimit: 100_000,
  },
);

const contractAddress = tx.arrayLog.find(
  (log) => log.type === "message" && log.key === "contract_address",
).value;
```

[**`secretjs.tx.compute.instantiateContract.simulate()`**](https://secretjs.scrt.network/#secretjstxcomputeinstantiatecontractsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

WARNING: `secretjs.tx.compute` simulations are not supported for security reasons.

[**`secretjs.tx.compute.executeContract()`**](https://secretjs.scrt.network/#secretjstxcomputeexecutecontract)

Execute a function on a contract

Input: [MsgExecuteContractParams](https://secretjs.scrt.network/interfaces/MsgExecuteContractParams)

```ts
const tx = await secretjs.tx.compute.executeContract(
  {
    sender: myAddress,
    contract_address: contractAddress,
    code_hash: codeHash, // optional but way faster
    msg: {
      transfer: {
        recipient: bob,
        amount: "1",
      },
    },
    sent_funds: [], // optional
  },
  {
    gasLimit: 100_000,
  },
);
```

[**`secretjs.tx.compute.executeContract.simulate()`**](https://secretjs.scrt.network/#secretjstxcomputeexecutecontractsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

WARNING: `secretjs.tx.compute` simulations are not supported for security reasons.

[**`secretjs.tx.compute.migrateContract()`**](https://secretjs.scrt.network/#secretjstxcomputemigratecontract)

Migrate a contract's code while keeping the same address. Invokes the `migrate()` function on the new code.

Input: [MsgMigrateContractParams](https://secretjs.scrt.network/interfaces/MsgMigrateContractParams)

```ts
const tx = await secretjs.tx.compute.migrateContract(
  {
    sender: myAddress,
    contract_address: contractAddress,
    code_id: newCodeId,
    code_hash: codeHash, // optional but way faster
    msg: {
      migrate_state_to_new_format: {},
    },
    sent_funds: [], // optional
  },
  {
    gasLimit: 100_000,
  },
);
```

[**`secretjs.tx.compute.migrateContract.simulate()`**](https://secretjs.scrt.network/#secretjstxcomputemigratecontractsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

WARNING: `secretjs.tx.compute` simulations are not supported for security reasons.

[**`secretjs.tx.compute.updateAdmin()`**](https://secretjs.scrt.network/#secretjstxcomputeupdateadmin)

Update a contract's admin.

Input: [MsgUpdateAdminParams](https://secretjs.scrt.network/interfaces/MsgUpdateAdminParams)

```ts
const tx = await secretjs.tx.compute.updateAdmin(
  {
    sender: currentAdminAddress,
    contract_address: contractAddress,
    new_admin: newAdminAddress,
  },
  {
    gasLimit: 100_000,
  },
);
```

[**`secretjs.tx.compute.updateAdmin.simulate()`**](https://secretjs.scrt.network/#secretjstxcomputeupdateadminsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

WARNING: `secretjs.tx.compute` simulations are not supported for security reasons.

[**`secretjs.tx.compute.clearAdmin()`**](https://secretjs.scrt.network/#secretjstxcomputeclearadmin)

clear a contract's admin.

Input: [MsgClearAdminParams](https://secretjs.scrt.network/interfaces/MsgClearAdminParams)

```ts
const tx = await secretjs.tx.compute.clearAdmin(
  {
    sender: currentAdminAddress,
    contract_address: contractAddress,
  },
  {
    gasLimit: 100_000,
  },
);
```

[**`secretjs.tx.compute.clearAdmin.simulate()`**](https://secretjs.scrt.network/#secretjstxcomputeclearadminsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

WARNING: `secretjs.tx.compute` simulations are not supported for security reasons.

[**`secretjs.tx.crisis.verifyInvariant()`**](https://secretjs.scrt.network/#secretjstxcrisisverifyinvariant)

MsgVerifyInvariant represents a message to verify a particular invariance.

Input: [MsgVerifyInvariantParams](https://secretjs.scrt.network/interfaces/MsgVerifyInvariantParams)

[**`secretjs.tx.crisis.verifyInvariant.simulate()`**](https://secretjs.scrt.network/#secretjstxcrisisverifyinvariantsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.distribution.fundCommunityPool()`**](https://secretjs.scrt.network/#secretjstxdistributionfundcommunitypool)

MsgFundCommunityPool allows an account to directly fund the community pool.

Input: [MsgFundCommunityPoolParams](https://secretjs.scrt.network/interfaces/MsgFundCommunityPoolParams)

```ts
const tx = await secretjs.tx.distribution.fundCommunityPool(
  {
    depositor: myAddress,
    amount: stringToCoins("1uscrt"),
  },
  {
    gasLimit: 20_000,
  },
);
```

[**`secretjs.tx.distribution.fundCommunityPool.simulate()`**](https://secretjs.scrt.network/#secretjstxdistributionfundcommunitypoolsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.distribution.setWithdrawAddress()`**](https://secretjs.scrt.network/#secretjstxdistributionsetwithdrawaddress)

MsgSetWithdrawAddress sets the withdraw address for a delegator (or validator self-delegation).

Input: [MsgSetWithdrawAddressParams](https://secretjs.scrt.network/interfaces/MsgSetWithdrawAddressParams)

```ts
const tx = await secretjs.tx.distribution.setWithdrawAddress(
  {
    delegator_address: mySelfDelegatorAddress,
    withdraw_address: myOtherAddress,
  },
  {
    gasLimit: 20_000,
  },
);
```

[**`secretjs.tx.distribution.setWithdrawAddress.simulate()`**](https://secretjs.scrt.network/#secretjstxdistributionsetwithdrawaddresssimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.distribution.withdrawDelegatorReward()`**](https://secretjs.scrt.network/#secretjstxdistributionwithdrawdelegatorreward)

MsgWithdrawDelegatorReward represents delegation withdrawal to a delegator from a single validator.

Input: [MsgWithdrawDelegatorRewardParams](https://secretjs.scrt.network/interfaces/MsgWithdrawDelegatorRewardParams)

```ts
const tx = await secretjs.tx.distribution.withdrawDelegatorReward(
  {
    delegator_address: myAddress,
    validator_address: someValidatorAddress,
  },
  {
    gasLimit: 20_000,
  },
);
```

[**`secretjs.tx.distribution.withdrawDelegatorReward.simulate()`**](https://secretjs.scrt.network/#secretjstxdistributionwithdrawdelegatorrewardsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.distribution.withdrawValidatorCommission()`**](https://secretjs.scrt.network/#secretjstxdistributionwithdrawvalidatorcommission)

MsgWithdrawValidatorCommission withdraws the full commission to the validator address.

Input: [MsgWithdrawValidatorCommissionParams](https://secretjs.scrt.network/interfaces/MsgWithdrawValidatorCommissionParams)

```ts
const tx = await secretjs.tx.distribution.withdrawValidatorCommission(
  {
    validator_address: myValidatorAddress,
  },
  {
    gasLimit: 20_000,
  },
);
```

Or a better one:

```ts
const tx = await secretjs.tx.broadcast(
  [
    new MsgWithdrawDelegatorReward({
      delegator_address: mySelfDelegatorAddress,
      validator_address: myValidatorAddress,
    }),
    new MsgWithdrawValidatorCommission({
      validator_address: myValidatorAddress,
    }),
  ],
  {
    gasLimit: 30_000,
  },
);
```

[**`secretjs.tx.distribution.withdrawValidatorCommission.simulate()`**](https://secretjs.scrt.network/#secretjstxdistributionwithdrawvalidatorcommissionsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.evidence.submitEvidence()`**](https://secretjs.scrt.network/#secretjstxevidencesubmitevidence)

MsgSubmitEvidence represents a message that supports submitting arbitrary evidence of misbehavior such as equivocation or counterfactual signing.

Input: [MsgSubmitEvidenceParams](https://secretjs.scrt.network/interfaces/MsgSubmitEvidenceParams)

[**`secretjs.tx.evidence.submitEvidence.simulate()`**](https://secretjs.scrt.network/#secretjstxevidencesubmitevidencesimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.feegrant.grantAllowance()`**](https://secretjs.scrt.network/#secretjstxfeegrantgrantallowance)

MsgGrantAllowance adds permission for Grantee to spend up to Allowance of fees from the account of Granter.

Input: [MsgGrantAllowanceParams](https://secretjs.scrt.network/interfaces/MsgGrantAllowanceParams)

```ts
const newWallet = new Wallet();

const txGranter = await secretjsGranter.tx.feegrant.grantAllowance({
  granter: secretjsGranter.address,
  grantee: newWallet.address,
  allowance: {
    spend_limit: stringToCoins("1000000uscrt"),
  },
});

const secretjsGrantee = new SecretNetworkClient({
  url: "http://localhost:1317",
  chainId: "secretdev-1",
  wallet: newWallet,
  walletAddress: newWallet.address,
});

// Send a tx from newWallet with secretjs.address as the fee payer
cosnt txGrantee = await secretjsGrantee.tx.gov.submitProposal(
  {
    proposer: secretjsGrantee.address,
    type: ProposalType.TextProposal,
    initial_deposit: [],
    content: {
      title: "Send a tx without any balance",
      description: `Thanks ${secretjsGranter.address}!`,
    },
  },
  {
    feeGranter: secretjsGranter.address,
  },
);
```

[**`secretjs.tx.feegrant.grantAllowance.simulate()`**](https://secretjs.scrt.network/#secretjstxfeegrantgrantallowancesimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.feegrant.revokeAllowance()`**](https://secretjs.scrt.network/#secretjstxfeegrantrevokeallowance)

MsgRevokeAllowance removes any existing Allowance from Granter to Grantee.

Input: [MsgRevokeAllowanceParams](https://secretjs.scrt.network/interfaces/MsgRevokeAllowanceParams)

```ts
const tx = await secretjs.tx.feegrant.revokeAllowance({
  granter: secretjs.address,
  grantee: newWallet.address,
});
```

[**`secretjs.tx.feegrant.revokeAllowance.simulate()`**](https://secretjs.scrt.network/#secretjstxfeegrantrevokeallowancesimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.gov.deposit()`**](https://secretjs.scrt.network/#secretjstxgovdeposit)

MsgDeposit defines a message to submit a deposit to an existing proposal.

Input: [MsgDepositParams](https://secretjs.scrt.network/interfaces/MsgDepositParams)

```ts
const tx = await secretjs.tx.gov.deposit(
  {
    depositor: myAddress,
    proposal_id: someProposalId,
    amount: stringToCoins("1uscrt"),
  },
  {
    gasLimit: 20_000,
  },
);
```

[**`secretjs.tx.gov.deposit.simulate()`**](https://secretjs.scrt.network/#secretjstxgovdepositsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.gov.submitProposal()`**](https://secretjs.scrt.network/#secretjstxgovsubmitproposal)

MsgSubmitProposal defines an sdk.Msg type that supports submitting arbitrary proposal Content.

Input: [MsgSubmitProposalParams](https://secretjs.scrt.network/interfaces/MsgSubmitProposalParams)

```ts
const tx = await secretjs.tx.gov.submitProposal(
  {
    type: ProposalType.TextProposal,
    proposer: myAddress,
    initial_deposit: stringToCoins("100000000uscrt"),
    content: {
      title: "Hi",
      description: "Let's vote on this",
    },
  },
  {
    gasLimit: 50_000,
  },
);

const proposalId = Number(
  tx.arrayLog.find(
    (log) => log.type === "submit_proposal" && log.key === "proposal_id",
  ).value,
);
```

[**`secretjs.tx.gov.submitProposal.simulate()`**](https://secretjs.scrt.network/#secretjstxgovsubmitproposalsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.gov.vote()`**](https://secretjs.scrt.network/#secretjstxgovvote)

MsgVote defines a message to cast a vote.

Input: [MsgVoteParams](https://secretjs.scrt.network/interfaces/MsgVoteParams)

```ts
const tx = await secretjs.tx.gov.vote(
  {
    voter: myAddress,
    proposal_id: someProposalId,
    option: VoteOption.VOTE_OPTION_YES,
  },
  {
    gasLimit: 50_000,
  },
);
```

[**`secretjs.tx.gov.vote.simulate()`**](https://secretjs.scrt.network/#secretjstxgovvotesimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.gov.voteWeighted()`**](https://secretjs.scrt.network/#secretjstxgovvoteweighted)

MsgVoteWeighted defines a message to cast a vote, with an option to split the vote.

Input: [MsgVoteWeightedParams](https://secretjs.scrt.network/interfaces/MsgVoteWeightedParams)

```ts
// vote yes with 70% of my power
const tx = await secretjs.tx.gov.voteWeighted(
  {
    voter: myAddress,
    proposal_id: someProposalId,
    options: [
      // weights must sum to 1.0
      { weight: 0.7, option: VoteOption.VOTE_OPTION_YES },
      { weight: 0.3, option: VoteOption.VOTE_OPTION_ABSTAIN },
    ],
  },
  {
    gasLimit: 50_000,
  },
);
```

[**`secretjs.tx.gov.voteWeighted.simulate()`**](https://secretjs.scrt.network/#secretjstxgovvoteweightedsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.ibc.transfer()`**](https://secretjs.scrt.network/#secretjstxibctransfer)

MsgTransfer defines a msg to transfer fungible tokens (i.e Coins) between ICS20 enabled chains. See ICS Spec here: [https://github.com/cosmos/ics/tree/master/spec/ics-020-fungible-token-transfer#data-structures](https://github.com/cosmos/ics/tree/master/spec/ics-020-fungible-token-transfer#data-structures)

Input: [MsgTransferParams](https://secretjs.scrt.network/interfaces/MsgTransferParams)

[**`secretjs.tx.ibc.transfer.simulate()`**](https://secretjs.scrt.network/#secretjstxibctransfersimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.slashing.unjail()`**](https://secretjs.scrt.network/#secretjstxslashingunjail)

MsgUnjail defines a message to release a validator from jail.

Input: [MsgUnjailParams](https://secretjs.scrt.network/interfaces/MsgUnjailParams)

```ts
const tx = await secretjs.tx.slashing.unjail(
  {
    validator_addr: mValidatorsAddress,
  },
  {
    gasLimit: 50_000,
  },
);
```

[**`secretjs.tx.slashing.unjail.simulate()`**](https://secretjs.scrt.network/#secretjstxslashingunjailsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.staking.beginRedelegate()`**](https://secretjs.scrt.network/#secretjstxstakingbeginredelegate)

MsgBeginRedelegate defines an SDK message for performing a redelegation of coins from a delegator and source validator to a destination validator.

Input: [MsgBeginRedelegateParams](https://secretjs.scrt.network/interfaces/MsgBeginRedelegateParams)

```ts
const tx = await secretjs.tx.staking.beginRedelegate(
  {
    delegator_address: myAddress,
    validator_src_address: someValidator,
    validator_dst_address: someOtherValidator,
    amount: stringToCoin("1uscrt"),
  },
  {
    gasLimit: 50_000,
  },
);
```

[**`secretjs.tx.staking.beginRedelegate.simulate()`**](https://secretjs.scrt.network/#secretjstxstakingbeginredelegatesimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.staking.createValidator()`**](https://secretjs.scrt.network/#secretjstxstakingcreatevalidator)

MsgCreateValidator defines an SDK message for creating a new validator.

Input: [MsgCreateValidatorParams](https://secretjs.scrt.network/interfaces/MsgCreateValidatorParams)

```ts
const tx = await secretjs.tx.staking.createValidator(
  {
    delegator_address: myAddress,
    commission: {
      max_change_rate: 0.01, // can change +-1% every 24h
      max_rate: 0.1, // 10%
      rate: 0.05, // 5%
    },
    description: {
      moniker: "My validator's display name",
      identity: "ID on keybase.io, to have a logo on explorer and stuff",
      website: "example.com",
      security_contact: "hi@example.com",
      details: "**We** are good",
    },
    pubkey: toBase64(new Uint8Array(32).fill(1)), // validator's pubkey, to sign on validated blocks
    min_self_delegation: "1", // uscrt
    initial_delegation: stringToCoin("1uscrt"),
  },
  {
    gasLimit: 100_000,
  },
);
```

[**`secretjs.tx.staking.createValidator.simulate()`**](https://secretjs.scrt.network/#secretjstxstakingcreatevalidatorsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.staking.delegate()`**](https://secretjs.scrt.network/#secretjstxstakingdelegate)

MsgDelegate defines an SDK message for performing a delegation of coins from a delegator to a validator.

Input: [MsgDelegateParams](https://secretjs.scrt.network/interfaces/MsgDelegateParams)

```ts
const tx = await secretjs.tx.staking.delegate(
  {
    delegator_address: myAddress,
    validator_address: someValidatorAddress,
    amount: stringToCoin("1uscrt"),
  },
  {
    gasLimit: 50_000,
  },
);
```

[**`secretjs.tx.staking.delegate.simulate()`**](https://secretjs.scrt.network/#secretjstxstakingdelegatesimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.staking.editValidator()`**](https://secretjs.scrt.network/#secretjstxstakingeditvalidator)

MsgEditValidator defines an SDK message for editing an existing validator.

Input: [MsgEditValidatorParams](https://secretjs.scrt.network/interfaces/MsgEditValidatorParams)

```ts
const tx = await secretjs.tx.staking.editValidator(
  {
    validator_address: myValidatorAddress,
    description: {
      // To edit even one item in "description you have to re-input everything
      moniker: "papaya",
      identity: "banana",
      website: "watermelon.com",
      security_contact: "sec@watermelon.com",
      details: "We are the banana papaya validator yay!",
    },
    min_self_delegation: "2",
    commission_rate: 0.04, // 4%, commission cannot be changed more than once in 24h
  },
  {
    gasLimit: 5_000_000,
  },
);
```

[**`secretjs.tx.staking.editValidator.simulate()`**](https://secretjs.scrt.network/#secretjstxstakingeditvalidatorsimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).

[**`secretjs.tx.staking.undelegate()`**](https://secretjs.scrt.network/#secretjstxstakingundelegate)

MsgUndelegate defines an SDK message for performing an undelegation from a delegate and a validator

Input: [MsgUndelegateParams](https://secretjs.scrt.network/interfaces/MsgUndelegateParams)

```ts
const tx = await secretjs.tx.staking.undelegate(
  {
    delegator_address: myAddress,
    validator_address: someValidatorAddress,
    amount: stringToCoin("1uscrt"),
  },
  {
    gasLimit: 50_000,
  },
);
```

[**`secretjs.tx.staking.undelegate.simulate()`**](https://secretjs.scrt.network/#secretjstxstakingundelegatesimulate)

Simulates execution without sending a transactions. Input is exactly like the parent function. For more info see [`secretjs.tx.simulate()`](https://secretjs.scrt.network/#secretjstxsimulate).
