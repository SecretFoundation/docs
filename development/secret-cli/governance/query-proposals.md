# Query Proposals

Once created, you can now query information of the proposal:

```
secretcli query gov proposal <proposal_id>
```

Or query all available proposals:

```
secretcli query gov proposals
```

You can also query proposals filtered by `voter` or `depositor` by using the corresponding flags.

To query for the proposer of a given governance proposal:

```
secretcli query gov proposer <proposal_id>
```

## Query Proposal Tally Results <a href="#query-proposal-tally-results" id="query-proposal-tally-results"></a>

To check the current tally of a given proposal you can use the `tally` command:

```
secretcli query gov tally <proposal_id>
```
