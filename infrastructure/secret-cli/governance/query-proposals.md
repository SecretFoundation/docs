# Query Proposals

## Available Commands

```bash
Available Commands:
  deposit     Query details of a deposit
  deposits    Query deposits on a proposal
  param       Query the parameters (voting|tallying|deposit) of the governance process
  params      Query the parameters of the governance process
  proposal    Query details of a single proposal
  proposals   Query proposals with optional filters
  proposer    Query the proposer of a governance proposal
  tally       Get the tally of a proposal vote
  vote        Query details of a single vote
  votes       Query votes on a proposal
```

## Querying Proposals

### Query Using Proposal ID

Once created, you can now query information of the proposal:

```bash
secretcli query gov proposal <proposal_id>
```

```bash
# Output of querying for a proposal

content:
  '@type': /cosmos.gov.v1beta1.TextProposal
  description: "A description with line breaks \n and `code formatting`"
  title: My Cool Proposal
deposit_end_time: "2022-06-28T14:16:06.110227079Z"
final_tally_result:
  abstain: "0"
  "no": "0"
  no_with_veto: "0"
  "yes": "0"
proposal_id: "14"
status: PROPOSAL_STATUS_REJECTED
submit_time: "2022-06-28T13:16:06.110227079Z"
total_deposit:
- amount: "100000000"
  denom: uscrt
voting_end_time: "2022-06-28T14:16:06.110227079Z"
voting_start_time: "2022-06-28T13:16:06.110227079Z"
```

### Query For All Proposals

You can query for all available proposals using:

```bash
secretcli query gov proposals
```

### Query For Proposal Depositor

You can query for the proposal depositor using:

```bash
secretcli query gov deposit \
    [proposal-id] \
    [depositer-addr] \
    [flags]
```

### Query For Proposal Depositors

You can query for the proposal depositors using:

```bash
secretcli query gov deposits \
    [proposal-id] \
    [flags]
```

### Query For Proposal Voter

You can query for the proposal voter using:

```bash
secretcli query gov vote \
    [proposal-id] \
    [voter-addr] \
    [flags]
```

### Query for Proposal Proposer

To query for the proposer of a given governance proposal use:

```bash
secretcli query gov proposer 
    [proposal-id] \
    [flags]
```

### Query Proposal Tally Results <a href="#query-proposal-tally-results" id="query-proposal-tally-results"></a>

To check the current tally of a given proposal you can use the `tally` command:

```bash
secretcli query gov tally 
    [proposal-id] \
    [flags]
```

## Query Governance Proposals

To check the current governance parameters run:

```
secretcli query gov params
```

```bash
deposit_params:
  max_deposit_period: "3600000000000"
  min_deposit:
  - amount: "10000000"
    denom: uscrt
tally_params:
  quorum: "0.334000000000000000"
  threshold: "0.500000000000000000"
  veto_threshold: "0.334000000000000000"
voting_params:
  voting_period: "3600000000000"
```

### Querying Subsets of Governance Proposals

#### Voting

To query subsets of the governance parameters for voting run:

```bash
secretcli query gov param voting
```

```bash
voting_period: "3600000000000"
```

#### Tallying

To query subsets of the governance parameters for tallying run:

```bash
secretcli query gov param tallying
```

```bash
quorum: "0.334000000000000000"
threshold: "0.500000000000000000"
veto_threshold: "0.334000000000000000"
```

#### Deposit

To query subsets of the deposit governance parameters for voting run:

```bash
secretcli query gov param deposit
```

```bash
max_deposit_period: "3600000000000"
min_deposit:
- amount: "10000000"
  denom: uscrt
```
