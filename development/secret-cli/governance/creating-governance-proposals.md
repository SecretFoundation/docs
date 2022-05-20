# Creating Governance Proposals

In order to create a governance proposal, you must submit an initial deposit along with a title and description. Currently, in order to enter the voting period, a proposal must accumulate within a week deposits of at least [100 `SCRT`](https://secretnodes.com/secret/chains/secret-4/governance/proposals/32).

Note - Please remember through the duration of this guide that the secretcli counts SCRT in USCRT. 1 SCRT = 1,000,000 USCRT.

Various modules outside of governance may implement their own proposal types and handlers (eg. parameter changes), where the governance module itself supports `Text` proposals. Any module outside of governance has it's command mounted on top of `submit-proposal`.

#### [#](https://docs.scrt.network/guides/governance.html#text)Text <a href="#text" id="text"></a>

To submit a `Text` proposal:

```
secretcli tx gov submit-proposal \
  --title <title> \
  --description <description> \
  --type Text \
  --deposit 100000000uscrt \
  --from <key_alias>
```

You may also provide the proposal directly through the `--proposal` flag which points to a JSON file containing the proposal:

```
secretcli tx gov submit-proposal --proposal <path/to/proposal.json> --from <key_alias>
```

Where `proposal.json` is:

```
{
  "type": "Text",
  "title": "My Cool Proposal",
  "description": "A description with line breaks \n and `code formatting`",
  "deposit": "100000000uscrt"
}
```

#### [#](https://docs.scrt.network/guides/governance.html#param-change)Param Change <a href="#param-change" id="param-change"></a>

To submit a parameter change proposal, you must provide a proposal file as its contents are less friendly to CLI input:

```
secretcli tx gov submit-proposal param-change <path/to/proposal.json> --from <key_alias>
```

Where `proposal.json` is:

```
{
  "title": "Param Change",
  "description": "Update max validators with line breaks \n and `code formatting`",
  "changes": [
    {
      "subspace": "Staking",
      "key": "MaxValidators",
      "value": 105
    }
  ],
  "deposit": "10000000uscrt"
}
```

You can see another `param-change` example here: [enigma-1-proposal-3.json](https://github.com/scrtlabs/SecretNetwork/blob/4561c0904c7b7659f019b96147cde13ac8db0933/enigma-1-proposal-3.json)

[**#**](https://docs.scrt.network/guides/governance.html#subspaces-keys-and-values)**Subspaces, Keys and Values**

| Subspace       | Key                       | Type               | Example                                                                                                   |
| -------------- | ------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------- |
| `auth`         | `MaxMemoCharacters`       | string (uint64)    | `"256"`                                                                                                   |
| `auth`         | `TxSigLimit`              | string (uint64)    | `"7"`                                                                                                     |
| `auth`         | `TxSizeCostPerByte`       | string (uint64)    | `"10"`                                                                                                    |
| `auth`         | `SigVerifyCostED25519`    | string (uint64)    | `"590"`                                                                                                   |
| `auth`         | `SigVerifyCostSecp256k1`  | string (uint64)    | `"1000"`                                                                                                  |
| `baseapp`      | `BlockParams`             | object             | `{"max_bytes":"10000000","max_gas":"10000000"}`                                                           |
| `baseapp`      | `EvidenceParams`          | object             | `{"max_age_num_blocks":"100000","max_age_duration":"172800000000000","max_bytes":"50000"}`                |
| `baseapp`      | `ValidatorParams`         | object             | `{"pub_key_types":["ed25519"]}`                                                                           |
| `bank`         | `sendenabled`             | bool               | `true`                                                                                                    |
| `crisis`       | `ConstantFee`             | object (coin)      | `{"denom": "uscrt", "amount": "1000"}`                                                                    |
| `distribution` | `communitytax`            | string (dec)       | `"0.020000000000000000"`                                                                                  |
| `distribution` | `secretfoundationtax`     | string (dec)       | `"0.030000000000000000"`                                                                                  |
| `distribution` | `secretfoundationaddress` | string             | `"secret164z7wwzv84h4hwn6rvjjkns6j4ht43jv8u9k0c"`                                                         |
| `distribution` | `baseproposerreward`      | string (dec)       | `"0.010000000000000000"`                                                                                  |
| `distribution` | `bonusproposerreward`     | string (dec)       | `"0.040000000000000000"`                                                                                  |
| `distribution` | `withdrawaddrenabled`     | bool               | `true`                                                                                                    |
| `evidence`     | `MaxEvidenceAge`          | string (time ns)   | `"120000000000"`                                                                                          |
| `gov`          | `depositparams`           | object             | `{"min_deposit": [{"denom": "uscrt", "amount": "10000000"}], "max_deposit_period": "172800000000000"}`    |
| `gov`          | `votingparams`            | object             | `{"voting_period": "172800000000000"}`                                                                    |
| `gov`          | `tallyparams`             | object             | `{"quorum": "0.334000000000000000", "threshold": "0.500000000000000000", "veto": "0.334000000000000000"}` |
| `mint`         | `MintDenom`               | string             | `"uscrt"`                                                                                                 |
| `mint`         | `InflationRateChange`     | string (dec)       | `"0.080000000000000000"`                                                                                  |
| `mint`         | `InflationMax`            | string (dec)       | `"0.150000000000000000"`                                                                                  |
| `mint`         | `InflationMin`            | string (dec)       | `"0.070000000000000000"`                                                                                  |
| `mint`         | `GoalBonded`              | string (dec)       | `"0.670000000000000000"`                                                                                  |
| `mint`         | `BlocksPerYear`           | string (uint64)    | `"6311520"`                                                                                               |
| `slashing`     | `SignedBlocksWindow`      | string (int64)     | `"5000"`                                                                                                  |
| `slashing`     | `MinSignedPerWindow`      | string (dec)       | `"0.500000000000000000"`                                                                                  |
| `slashing`     | `DowntimeJailDuration`    | string (time ns)   | `"600000000000"`                                                                                          |
| `slashing`     | `SlashFractionDoubleSign` | string (dec)       | `"0.050000000000000000"`                                                                                  |
| `slashing`     | `SlashFractionDowntime`   | string (dec)       | `"0.010000000000000000"`                                                                                  |
| `staking`      | `UnbondingTime`           | string (time ns)   | `"259200000000000"`                                                                                       |
| `staking`      | `MaxValidators`           | uint16             | `100`                                                                                                     |
| `staking`      | `KeyMaxEntries`           | uint16             | `7`                                                                                                       |
| `staking`      | `HistoricalEntries`       | uint16             | `3`                                                                                                       |
| `staking`      | `BondDenom`               | string             | `"uscrt"`                                                                                                 |
| `ibc`          | `AllowedClients`          | object (string\[]) | `["07-tendermint"]`                                                                                       |
| `ibc`          | `MaxExpectedTimePerBlock` | uint64             | `"30000000000"`                                                                                           |
| `transfer`     | `SendEnabled`             | bool               | `true`                                                                                                    |
| `transfer`     | `ReceiveEnabled`          | bool               | `true`                                                                                                    |

Please note:

* The `subspace` is usually the `ModuleName`: E.g. https://github.com/cosmos/cosmos-sdk/blob/v0.38.1/x/distribution/types/keys.go#L11
* The `key` is usually defined in `x/$MODULE_NAME/types/params.go`: E.g. https://github.com/cosmos/cosmos-sdk/blob/v0.38.1/x/distribution/types/params.go#L19-L22
* The `value`'s type is usually near the `key` definition: E.g. https://github.com/cosmos/cosmos-sdk/blob/v0.38.1/x/distribution/types/params.go#L26-L31
* ⚠️ `subspace` and `key` are case sensitive and `value` must be of the correct type and within the allowed bounds. Proposals with errors on these inputs should not enter voting period (should not get deposits) or be voted on with `NoWithVeto`.
* ⚠️ Currently parameter changes are _evaluated_ but not _validated_, so it is very important that any `value` change is valid (i.e. correct type and within bounds) for its respective parameter, eg. `MaxValidators` should be an integer and not a decimal.
* ⚠️ Proper vetting of a parameter change proposal should prevent this from happening (no deposits should occur during the governance process), but it should be noted regardless.

[**#**](https://docs.scrt.network/guides/governance.html#known-constraints)**Known Constraints**

* `distribution.baseproposerreward + distribution.bonusproposerreward < 1`. See [this](https://github.com/scrtlabs/SecretNetwork/issues/95) and [this](https://github.com/cosmos/cosmos-sdk/issues/5808) for more info.

To read more go to https://github.com/gavinly/CosmosParametersWiki.

#### [#](https://docs.scrt.network/guides/governance.html#community-pool-spend)Community Pool Spend <a href="#community-pool-spend" id="community-pool-spend"></a>

To submit a community pool spend proposal, you also must provide a proposal file as its contents are less friendly to CLI input:

```
secretcli tx gov submit-proposal community-pool-spend <path/to/proposal.json> --from <key_alias>
```

Where `proposal.json` is:

```
{
  "title": "Community Pool Spend",
  "description": "Spend 10 SCRT with line breaks \n and `code formatting`",
  "recipient": "secret1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "amount": "100000000uscrt",
  "deposit": "100000000uscrt"
}
```

#### [#](https://docs.scrt.network/guides/governance.html#software-upgrade)Software Upgrade <a href="#software-upgrade" id="software-upgrade"></a>

The `SoftwareUpgrade` is currently not supported as it's not implemented and currently does not differ from the semantics of a `Text` proposal.
