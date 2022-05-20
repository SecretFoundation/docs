# Query Deposits

Once a new proposal is created, you can query all the deposits submitted to it:

```
secretcli query gov deposits <proposal_id>
```

You can also query a deposit submitted by a specific address:

```
secretcli query gov deposit <proposal_id> <depositor_address>
```
