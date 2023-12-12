---
description: Learn how to send queries with SecretJS.
---

# Sending Queries

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

### SecretJS Queries

[**`secretjs.query.auth.account()`**](https://secretjs.scrt.network/#secretjsqueryauthaccount)

Returns account details based on address.

{% code overflow="wrap" %}
```ts
const { address, accountNumber, sequence } = await secretjs.query.auth.account({
  address: myAddress,
});
```
{% endcode %}

[**`secretjs.query.auth.accounts()`**](https://secretjs.scrt.network/#secretjsqueryauthaccounts)

Returns all existing accounts on the blockchain.

```ts
/// Get all accounts
const result = await secretjs.query.auth.accounts({});
```

[**`secretjs.query.auth.params()`**](https://secretjs.scrt.network/#secretjsqueryauthparams)

Queries all x/auth parameters.

```ts
const {
  params: {
    maxMemoCharacters,
    sigVerifyCostEd25519,
    sigVerifyCostSecp256k1,
    txSigLimit,
    txSizeCostPerByte,
  },
} = await secretjs.query.auth.params();
```

[**`secretjs.query.authz.grants()`**](https://secretjs.scrt.network/#secretjsqueryauthzgrants)

Returns list of authorizations, granted to the grantee by the granter.

[**`secretjs.query.bank.balance()`**](https://secretjs.scrt.network/#secretjsquerybankbalance)

Balance queries the balance of a single coin for a single account.

```ts
const { balance } = await secretjs.query.bank.balance({
  address: myAddress,
  denom: "uscrt",
});
```

[**`secretjs.query.bank.allBalances()`**](https://secretjs.scrt.network/#secretjsquerybankallbalances)

AllBalances queries the balance of all coins for a single account.

[**`secretjs.query.bank.totalSupply()`**](https://secretjs.scrt.network/#secretjsquerybanktotalsupply)

TotalSupply queries the total supply of all coins.

[**`secretjs.query.bank.supplyOf()`**](https://secretjs.scrt.network/#secretjsquerybanksupplyof)

SupplyOf queries the supply of a single coin.

[**`secretjs.query.bank.params()`**](https://secretjs.scrt.network/#secretjsquerybankparams)

Params queries the parameters of x/bank module.

[**`secretjs.query.bank.denomMetadata()`**](https://secretjs.scrt.network/#secretjsquerybankdenommetadata)

DenomsMetadata queries the client metadata of a given coin denomination.

[**`secretjs.query.bank.denomsMetadata()`**](https://secretjs.scrt.network/#secretjsquerybankdenomsmetadata)

DenomsMetadata queries the client metadata for all registered coin denominations.

[**`secretjs.query.compute.codeHashByContractAddress()`**](https://secretjs.scrt.network/#secretjsquerycomputecodehashbycontractaddress)

Get codeHash of a Secret Contract.

[**`secretjs.query.compute.codeHashByCodeId()`**](https://secretjs.scrt.network/#secretjsquerycomputecodehashbycodeid)

Get codeHash from a code id.

[**`secretjs.query.compute.contractInfo()`**](https://secretjs.scrt.network/#secretjsquerycomputecontractinfo)

Get metadata of a Secret Contract.

[**`secretjs.query.compute.contractsByCode()`**](https://secretjs.scrt.network/#secretjsquerycomputecontractsbycode)

Get all contracts that were instantiated from a code id.

[**`secretjs.query.compute.queryContract()`**](https://secretjs.scrt.network/#secretjsquerycomputequerycontract)

Query a Secret Contract

```ts
type Result = {
  token_info: {
    decimals: number;
    name: string;
    symbol: string;
    total_supply: string;
  };
};

const result = (await secretjs.query.compute.queryContract({
  contract_address: sScrtAddress,
  code_hash: sScrtCodeHash, // optional but way faster
  query: { token_info: {} },
})) as Result;
```

[**`secretjs.query.compute.code()`**](https://secretjs.scrt.network/#secretjsquerycomputecode)

Get WASM bytecode and metadata for a code id.

```ts
const { codeInfo } = await secretjs.query.compute.code(codeId);
```

[**`secretjs.query.compute.codes()`**](https://secretjs.scrt.network/#secretjsquerycomputecodes)

Query all contract codes on-chain.

[**`secretjs.query.compute.contractHistory()`**](https://secretjs.scrt.network/#secretjsquerycomputecontracthistory)

Get upgrades history of a Secret Contract.

[**`secretjs.query.distribution.params()`**](https://secretjs.scrt.network/#secretjsquerydistributionparams)

Params queries params of the distribution module.

[**`secretjs.query.distribution.validatorOutstandingRewards()`**](https://secretjs.scrt.network/#secretjsquerydistributionvalidatoroutstandingrewards)

ValidatorOutstandingRewards queries rewards of a validator address.

[**`secretjs.query.distribution.validatorCommission()`**](https://secretjs.scrt.network/#secretjsquerydistributionvalidatorcommission)

ValidatorCommission queries accumulated commission for a validator.

[**`secretjs.query.distribution.validatorSlashes()`**](https://secretjs.scrt.network/#secretjsquerydistributionvalidatorslashes)

ValidatorSlashes queries slash events of a validator.

[**`secretjs.query.distribution.delegationRewards()`**](https://secretjs.scrt.network/#secretjsquerydistributiondelegationrewards)

DelegationRewards queries the total rewards accrued by a delegation.

[**`secretjs.query.distribution.delegationTotalRewards()`**](https://secretjs.scrt.network/#secretjsquerydistributiondelegationtotalrewards)

DelegationTotalRewards queries the total rewards accrued by a each validator.

[**`secretjs.query.distribution.delegatorValidators()`**](https://secretjs.scrt.network/#secretjsquerydistributiondelegatorvalidators)

DelegatorValidators queries the validators of a delegator.

[**`secretjs.query.distribution.delegatorWithdrawAddress()`**](https://secretjs.scrt.network/#secretjsquerydistributiondelegatorwithdrawaddress)

DelegatorWithdrawAddress queries withdraw address of a delegator.

[**`secretjs.query.distribution.communityPool()`**](https://secretjs.scrt.network/#secretjsquerydistributioncommunitypool)

CommunityPool queries the community pool coins.

[**`secretjs.query.distribution.foundationTax()`**](https://secretjs.scrt.network/#secretjsquerydistributionfoundationtax)

DelegatorWithdrawAddress queries withdraw address of a delegator.

[**`secretjs.query.evidence.evidence()`**](https://secretjs.scrt.network/#secretjsqueryevidenceevidence)

Evidence queries evidence based on evidence hash.

[**`secretjs.query.evidence.allEvidence()`**](https://secretjs.scrt.network/#secretjsqueryevidenceallevidence)

AllEvidence queries all evidence.

[**`secretjs.query.feegrant.allowance()`**](https://secretjs.scrt.network/#secretjsqueryfeegrantallowance)

Allowance returns fee granted to the grantee by the granter.

[**`secretjs.query.feegrant.allowances()`**](https://secretjs.scrt.network/#secretjsqueryfeegrantallowances)

Allowances returns all the grants for address.

[**`secretjs.query.gov.proposal()`**](https://secretjs.scrt.network/#secretjsquerygovproposal)

Proposal queries proposal details based on ProposalID.

[**`secretjs.query.gov.proposals()`**](https://secretjs.scrt.network/#secretjsquerygovproposals)

Proposals queries all proposals based on given status.

```ts
// Get all proposals
const { proposals } = await secretjs.query.gov.proposals({
  proposal_status: ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED,
  voter: "",
  depositor: "",
});
```

[**`secretjs.query.gov.vote()`**](https://secretjs.scrt.network/#secretjsquerygovvote)

Vote queries voted information based on proposalID, voterAddr.

[**`secretjs.query.gov.votes()`**](https://secretjs.scrt.network/#secretjsquerygovvotes)

Votes queries votes of a given proposal.

[**`secretjs.query.gov.params()`**](https://secretjs.scrt.network/#secretjsquerygovparams)

Params queries all parameters of the gov module.

[**`secretjs.query.gov.deposit()`**](https://secretjs.scrt.network/#secretjsquerygovdeposit)

Deposit queries single deposit information based proposalID, depositAddr.

```ts
const {
  deposit: { amount },
} = await secretjs.query.gov.deposit({
  depositor: myAddress,
  proposalId: propId,
});
```

[**`secretjs.query.gov.deposits()`**](https://secretjs.scrt.network/#secretjsquerygovdeposits)

Deposits queries all deposits of a single proposal.

[**`secretjs.query.gov.tallyResult()`**](https://secretjs.scrt.network/#secretjsquerygovtallyresult)

TallyResult queries the tally of a proposal vote.

[**`secretjs.query.ibc_channel.channel()`**](https://secretjs.scrt.network/#secretjsqueryibc\_channelchannel)

Channel queries an IBC Channel.

[**`secretjs.query.ibc_channel.channels()`**](https://secretjs.scrt.network/#secretjsqueryibc\_channelchannels)

Channels queries all the IBC channels of a chain.

[**`secretjs.query.ibc_channel.connectionChannels()`**](https://secretjs.scrt.network/#secretjsqueryibc\_channelconnectionchannels)

ConnectionChannels queries all the channels associated with a connection end.

[**`secretjs.query.ibc_channel.channelClientState()`**](https://secretjs.scrt.network/#secretjsqueryibc\_channelchannelclientstate)

ChannelClientState queries for the client state for the channel associated with the provided channel identifiers.

[**`secretjs.query.ibc_channel.channelConsensusState()`**](https://secretjs.scrt.network/#secretjsqueryibc\_channelchannelconsensusstate)

ChannelConsensusState queries for the consensus state for the channel associated with the provided channel identifiers.

[**`secretjs.query.ibc_channel.packetCommitment()`**](https://secretjs.scrt.network/#secretjsqueryibc\_channelpacketcommitment)

PacketCommitment queries a stored packet commitment hash.

[**`secretjs.query.ibc_channel.packetCommitments()`**](https://secretjs.scrt.network/#secretjsqueryibc\_channelpacketcommitments)

PacketCommitments returns all the packet commitments hashes associated with a channel.

[**`secretjs.query.ibc_channel.packetReceipt()`**](https://secretjs.scrt.network/#secretjsqueryibc\_channelpacketreceipt)

PacketReceipt queries if a given packet sequence has been received on the queried chain

[**`secretjs.query.ibc_channel.packetAcknowledgement()`**](https://secretjs.scrt.network/#secretjsqueryibc\_channelpacketacknowledgement)

PacketAcknowledgement queries a stored packet acknowledgement hash.

[**`secretjs.query.ibc_channel.packetAcknowledgements()`**](https://secretjs.scrt.network/#secretjsqueryibc\_channelpacketacknowledgements)

PacketAcknowledgements returns all the packet acknowledgements associated with a channel.

[**`secretjs.query.ibc_channel.unreceivedPackets()`**](https://secretjs.scrt.network/#secretjsqueryibc\_channelunreceivedpackets)

UnreceivedPackets returns all the unreceived IBC packets associated with a channel and sequences.

[**`secretjs.query.ibc_channel.unreceivedAcks()`**](https://secretjs.scrt.network/#secretjsqueryibc\_channelunreceivedacks)

UnreceivedAcks returns all the unreceived IBC acknowledgements associated with a channel and sequences.

[**`secretjs.query.ibc_channel.nextSequenceReceive()`**](https://secretjs.scrt.network/#secretjsqueryibc\_channelnextsequencereceive)

NextSequenceReceive returns the next receive sequence for a given channel.

[**`secretjs.query.ibc_client.clientState()`**](https://secretjs.scrt.network/#secretjsqueryibc\_clientclientstate)

ClientState queries an IBC light client.

[**`secretjs.query.ibc_client.clientStates()`**](https://secretjs.scrt.network/#secretjsqueryibc\_clientclientstates)

ClientStates queries all the IBC light clients of a chain.

[**`secretjs.query.ibc_client.consensusState()`**](https://secretjs.scrt.network/#secretjsqueryibc\_clientconsensusstate)

ConsensusState queries a consensus state associated with a client state at a given height.

[**`secretjs.query.ibc_client.consensusStates()`**](https://secretjs.scrt.network/#secretjsqueryibc\_clientconsensusstates)

ConsensusStates queries all the consensus state associated with a given client.

[**`secretjs.query.ibc_client.clientStatus()`**](https://secretjs.scrt.network/#secretjsqueryibc\_clientclientstatus)

Status queries the status of an IBC client.

[**`secretjs.query.ibc_client.clientParams()`**](https://secretjs.scrt.network/#secretjsqueryibc\_clientclientparams)

ClientParams queries all parameters of the ibc client.

[**`secretjs.query.ibc_client.upgradedClientState()`**](https://secretjs.scrt.network/#secretjsqueryibc\_clientupgradedclientstate)

UpgradedClientState queries an Upgraded IBC light client.

[**`secretjs.query.ibc_client.upgradedConsensusState()`**](https://secretjs.scrt.network/#secretjsqueryibc\_clientupgradedconsensusstate)

UpgradedConsensusState queries an Upgraded IBC consensus state.

[**`secretjs.query.ibc_connection.connection()`**](https://secretjs.scrt.network/#secretjsqueryibc\_connectionconnection)

Connection queries an IBC connection end.

[**`secretjs.query.ibc_connection.connections()`**](https://secretjs.scrt.network/#secretjsqueryibc\_connectionconnections)

Connections queries all the IBC connections of a chain.

[**`secretjs.query.ibc_connection.clientConnections()`**](https://secretjs.scrt.network/#secretjsqueryibc\_connectionclientconnections)

ClientConnections queries the connection paths associated with a client state.

[**`secretjs.query.ibc_connection.connectionClientState()`**](https://secretjs.scrt.network/#secretjsqueryibc\_connectionconnectionclientstate)

ConnectionClientState queries the client state associated with the connection.

[**`secretjs.query.ibc_connection.connectionConsensusState()`**](https://secretjs.scrt.network/#secretjsqueryibc\_connectionconnectionconsensusstate)

ConnectionConsensusState queries the consensus state associated with the connection.

[**`secretjs.query.ibc_transfer.denomTrace()`**](https://secretjs.scrt.network/#secretjsqueryibc\_transferdenomtrace)

DenomTrace queries a denomination trace information.

[**`secretjs.query.ibc_transfer.denomTraces()`**](https://secretjs.scrt.network/#secretjsqueryibc\_transferdenomtraces)

DenomTraces queries all denomination traces.

[**`secretjs.query.ibc_transfer.params()`**](https://secretjs.scrt.network/#secretjsqueryibc\_transferparams)

Params queries all parameters of the ibc-transfer module.

[**`secretjs.query.mint.params()`**](https://secretjs.scrt.network/#secretjsquerymintparams)

Params returns the total set of minting parameters.

[**`secretjs.query.mint.inflation()`**](https://secretjs.scrt.network/#secretjsquerymintinflation)

Inflation returns the current minting inflation value.

[**`secretjs.query.mint.annualProvisions()`**](https://secretjs.scrt.network/#secretjsquerymintannualprovisions)

AnnualProvisions current minting annual provisions value.

[**`secretjs.query.params.params()`**](https://secretjs.scrt.network/#secretjsqueryparamsparams)

Params queries a specific parameter of a module, given its subspace and key.

[**`secretjs.query.registration.txKey()`**](https://secretjs.scrt.network/#secretjsqueryregistrationtxkey)

Returns the key used for transactions.

[**`secretjs.query.registration.registrationKey()`**](https://secretjs.scrt.network/#secretjsqueryregistrationregistrationkey)

Returns the key used for registration.

[**`secretjs.query.registration.encryptedSeed()`**](https://secretjs.scrt.network/#secretjsqueryregistrationencryptedseed)

Returns the encrypted seed for a registered node by public key.

[**`secretjs.query.slashing.params()`**](https://secretjs.scrt.network/#secretjsqueryslashingparams)

Params queries the parameters of slashing module.

[**`secretjs.query.slashing.signingInfo()`**](https://secretjs.scrt.network/#secretjsqueryslashingsigninginfo)

SigningInfo queries the signing info of given cons address.

[**`secretjs.query.slashing.signingInfos()`**](https://secretjs.scrt.network/#secretjsqueryslashingsigninginfos)

SigningInfos queries signing info of all validators.

[**`secretjs.query.staking.validators()`**](https://secretjs.scrt.network/#secretjsquerystakingvalidators)

Validators queries all validators that match the given status.

{% code overflow="wrap" %}
```ts
// Get all validators
const { validators } = await secretjs.query.staking.validators({ status: "" });
```
{% endcode %}

[**`secretjs.query.staking.validator()`**](https://secretjs.scrt.network/#secretjsquerystakingvalidator)

Validator queries validator info for given validator address.

[**`secretjs.query.staking.validatorDelegations()`**](https://secretjs.scrt.network/#secretjsquerystakingvalidatordelegations)

ValidatorDelegations queries delegate info for given validator.

[**`secretjs.query.staking.validatorUnbondingDelegations()`**](https://secretjs.scrt.network/#secretjsquerystakingvalidatorunbondingdelegations)

ValidatorUnbondingDelegations queries unbonding delegations of a validator.

[**`secretjs.query.staking.delegation()`**](https://secretjs.scrt.network/#secretjsquerystakingdelegation)

Delegation queries delegate info for given validator delegator pair.

[**`secretjs.query.staking.unbondingDelegation()`**](https://secretjs.scrt.network/#secretjsquerystakingunbondingdelegation)

UnbondingDelegation queries unbonding info for given validator delegator pair.

[**`secretjs.query.staking.delegatorDelegations()`**](https://secretjs.scrt.network/#secretjsquerystakingdelegatordelegations)

DelegatorDelegations queries all delegations of a given delegator address.

[**`secretjs.query.staking.delegatorUnbondingDelegations()`**](https://secretjs.scrt.network/#secretjsquerystakingdelegatorunbondingdelegations)

DelegatorUnbondingDelegations queries all unbonding delegations of a given delegator address.

[**`secretjs.query.staking.redelegations()`**](https://secretjs.scrt.network/#secretjsquerystakingredelegations)

Redelegations queries redelegations of given address.

[**`secretjs.query.staking.delegatorValidators()`**](https://secretjs.scrt.network/#secretjsquerystakingdelegatorvalidators)

DelegatorValidators queries all validators info for given delegator address.

[**`secretjs.query.staking.delegatorValidator()`**](https://secretjs.scrt.network/#secretjsquerystakingdelegatorvalidator)

DelegatorValidator queries validator info for given delegator validator pair.

[**`secretjs.query.staking.historicalInfo()`**](https://secretjs.scrt.network/#secretjsquerystakinghistoricalinfo)

HistoricalInfo queries the historical info for given height.

[**`secretjs.query.staking.pool()`**](https://secretjs.scrt.network/#secretjsquerystakingpool)

Pool queries the pool info.

[**`secretjs.query.staking.params()`**](https://secretjs.scrt.network/#secretjsquerystakingparams)

Parameters queries the staking parameters.

[**`secretjs.query.tendermint.getNodeInfo()`**](https://secretjs.scrt.network/#secretjsquerytendermintgetnodeinfo)

GetNodeInfo queries the current node info.

[**`secretjs.query.tendermint.getSyncing()`**](https://secretjs.scrt.network/#secretjsquerytendermintgetsyncing)

GetSyncing queries node syncing.

[**`secretjs.query.tendermint.getLatestBlock()`**](https://secretjs.scrt.network/#secretjsquerytendermintgetlatestblock)

GetLatestBlock returns the latest block.

[**`secretjs.query.tendermint.getBlockByHeight()`**](https://secretjs.scrt.network/#secretjsquerytendermintgetblockbyheight)

GetBlockByHeight queries block for given height.

[**`secretjs.query.tendermint.getLatestValidatorSet()`**](https://secretjs.scrt.network/#secretjsquerytendermintgetlatestvalidatorset)

GetLatestValidatorSet queries latest validator-set.

[**`secretjs.query.tendermint.getValidatorSetByHeight()`**](https://secretjs.scrt.network/#secretjsquerytendermintgetvalidatorsetbyheight)

GetValidatorSetByHeight queries validator-set at a given height.

[**`secretjs.query.upgrade.currentPlan()`**](https://secretjs.scrt.network/#secretjsqueryupgradecurrentplan)

CurrentPlan queries the current upgrade plan.

[**`secretjs.query.upgrade.appliedPlan()`**](https://secretjs.scrt.network/#secretjsqueryupgradeappliedplan)

AppliedPlan queries a previously applied upgrade plan by its name.

[**`secretjs.query.upgrade.upgradedConsensusState()`**](https://secretjs.scrt.network/#secretjsqueryupgradeupgradedconsensusstate)

UpgradedConsensusState queries the consensus state that will serve as a trusted kernel for the next version of this chain. It will only be stored at the last height of this chain.

[**`secretjs.query.upgrade.moduleVersions()`**](https://secretjs.scrt.network/#secretjsqueryupgrademoduleversions)

ModuleVersions queries the list of module versions from state.
