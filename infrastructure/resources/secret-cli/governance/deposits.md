# Deposits

## Increasing Deposits

If the proposal you previously created didn't meet the `MinDeposit` requirement, you can still increase the total amount deposited to activate it.&#x20;

_**Note:** Proposals not meeting this requirement will be deleted after `MaxDepositPeriod` is reached._

Once the minimum deposit is reached, the proposal enters voting period:

```bash
secretcli tx gov 
    [proposal-id] \
    [deposit] \
    [flags]
```

_**Note:** The regular flags for the tx command are applicable to `gov deposit` (--fees, --gas, --account-number --ledger, --node, etc...)_

## Returning Deposits

The only ways deposits won't be returned to their owners is:

1. If in the voting period the proposal gets 1/3 `NoWithVeto` out of all votes, excluding Abstain votes (So `NoWithVeto` needs to be 1/3 out of all `Yes`, `No` & `NoWithVeto` ).
2. If in the voting period less than 1/3 of voting power votes (== The proposal won't reach a quorum).

Anyone can deposit for a proposal, even if you have 0 `SCRT` tokens staked/delegated/bonded.

## Querying Deposits

Once a new proposal is created, you can query all the deposits submitted to it:

```bash
secretcli query gov deposits \
    [proposal-id] \
    [flags]
```

You can also query a deposit submitted by a specific address:

```bash
secretcli query gov deposit \
    [proposal_id] \
    [depositor_address]
```

## Flags

There are several flags to use with `secretcli query gov deposit`:&#x20;

```bash
Flags:
      --count-total       
          count total number of records in deposits to query for
      --height int        
          Use a specific height to query state at (this can error if the node is pruning state)
  -h, --help              
      help for deposits
      --limit uint        
          pagination limit of deposits to query for (default 100)
      --node string       
          <host>:<port> to Tendermint RPC interface for this chain (default "tcp://localhost:26657")
      --offset uint       
          pagination offset of deposits to query for
      --page uint         
          pagination page of deposits to query for. This sets offset to a multiple of limit (default 1)
      --page-key string   
          pagination page-key of deposits to query for
      --reverse           
          results are sorted in descending order
```
