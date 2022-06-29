# Vote On Proposals

After a proposal's deposit reaches the `MinDeposit` value, the voting period opens. Bonded `SCRT` holders can then cast vote on it:

```
secretcli tx gov vote <proposal_id> <Yes/No/NoWithVeto/Abstain> --from <key_alias>
```
