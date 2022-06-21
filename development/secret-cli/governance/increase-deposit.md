# Increase Deposit

If the proposal you previously created didn't meet the `MinDeposit` requirement, you can still increase the total amount deposited to activate it. Once the minimum deposit is reached, the proposal enters voting period:

```
secretcli tx gov deposit <proposal_id> "10000000uscrt" --from <key_alias>
```

_NOTE_: Proposals that don't meet this requirement will be deleted after `MaxDepositPeriod` is reached.

The only ways deposits won't be returned to their owners is:

1. If in the voting period the proposal gets 1/3 `NoWithVeto` out of all votes, excluding Abstain votes (So `NoWithVeto` needs to be 1/3 out of all `Yes`, `No` & `NoWithVeto` ).
2. If in the voting period less than 1/3 of voting power votes (== The proposal won't reach a quorum).

Anyone can deposit for a proposal, even if you have 0 `SCRT` tokens staked/delegated/bonded.

\
