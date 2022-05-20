# Governance

Governance is the process from which users in the Secret Blockchain can come to consensus on software upgrades, parameters of the mainnet or signaling mechanisms through text proposals. This is done through voting on proposals, which will be submitted by `SCRT` holders on the mainnet.

Some considerations about the voting process:

* Voting is done by bonded `SCRT` holders on a 1 bonded `SCRT` 1 vote basis.
* Delegators inherit the vote of their validator if they don't vote.
* Votes are tallied at the end of the voting period (1 week on mainnet) where each address can vote multiple times to update its `Option` value (paying the transaction fee each time), only the most recently cast vote will count as valid.
* Voters can choose between options `Yes`, `No`, `NoWithVeto` and `Abstain`.
* At the end of the voting period, a proposal is accepted IFF:
  * `(YesVotes / (YesVotes+NoVotes+NoWithVetoVotes)) > 1/2` ([threshold](https://github.com/scrtlabs/SecretNetwork/blob/b0792cc7f63a9264afe5de252a5821788c21834d/enigma-1-genesis.json#L1864))
  * `(NoWithVetoVotes / (YesVotes+NoVotes+NoWithVetoVotes)) < 1/3` ([veto](https://github.com/scrtlabs/SecretNetwork/blob/b0792cc7f63a9264afe5de252a5821788c21834d/enigma-1-genesis.json#L1865))
  * `((YesVotes+NoVotes+NoWithVetoVotes) / totalBondedStake) >= 1/3` ([quorum](https://github.com/scrtlabs/SecretNetwork/blob/b0792cc7f63a9264afe5de252a5821788c21834d/enigma-1-genesis.json#L1863))

For more information about the governance process and how it works, please check out the Governance module [specification](https://github.com/cosmos/cosmos-sdk/tree/master/x/gov/spec).



[How to participate in on-chain governance](https://docs.scrt.network/guides/governance.html).

