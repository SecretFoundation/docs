# Fee Distribution



#### Query Distribution Parameters <a href="#query-distribution-parameters" id="query-distribution-parameters"></a>

To check current distribution parameters, run:

```
secretcli q distribution params
```

#### [#](https://docs.scrt.network/cli/secretcli.html#query-distribution-community-pool)Query Distribution Community Pool <a href="#query-distribution-community-pool" id="query-distribution-community-pool"></a>

To query all coins in the community pool under Governance control:

```
secretcli q distribution community-pool
```

#### [#](https://docs.scrt.network/cli/secretcli.html#query-outstanding-validator-rewards)Query Outstanding Validator rewards <a href="#query-outstanding-validator-rewards" id="query-outstanding-validator-rewards"></a>

To check current outstanding (un-withdrawn) rewards, run:

```
secretcli q distribution validator-outstanding-rewards <validator-address>
```

#### [#](https://docs.scrt.network/cli/secretcli.html#query-validator-commission)Query Validator Commission <a href="#query-validator-commission" id="query-validator-commission"></a>

To check current outstanding commission for a validator, run:

```
secretcli q distribution commission <validator-operator-address>
```

#### [#](https://docs.scrt.network/cli/secretcli.html#query-validator-slashes)Query Validator Slashes <a href="#query-validator-slashes" id="query-validator-slashes"></a>

To check historical slashes for a validator, run:

```
secretcli q distribution slashes <validator-operator-address> <start-height> <end-height>
```

#### [#](https://docs.scrt.network/cli/secretcli.html#query-delegator-rewards)Query Delegator Rewards <a href="#query-delegator-rewards" id="query-delegator-rewards"></a>

To check current rewards for a delegation (were they to be withdrawn), run:

```
secretcli q distribution rewards <delegator-address> <validator-address>
```

#### [#](https://docs.scrt.network/cli/secretcli.html#query-all-delegator-rewards)Query All Delegator Rewards <a href="#query-all-delegator-rewards" id="query-all-delegator-rewards"></a>

To check all current rewards for a delegation (were they to be withdrawn), run:

```
secretcli q distribution rewards <delegator-address>
```
