# Creating Governance Proposals

## Introduction

In order to create a governance proposal, you must submit an initial deposit along with a title and description. Currently, in order to enter the voting period, a proposal must accumulate within a week deposits of at least [100 `SCRT`](https://secretnodes.com/secret/chains/secret-4/governance/proposals/32).

_**Note:** Please remember through the duration of this guide that the `secretcli` counts SCRT in uscrt. 1 SCRT = 1,000,000 uscrt._

### Modules

Various modules outside of governance may implement their own proposal types and handlers (eg. parameter changes), where the governance module itself supports `Text` proposals. Any module outside of governance has it's command mounted on top of `submit-proposal`.

## Submit-Proposal

Proposals can be submitted using `secretcli tx gov submit-proposal`.

Using `secretcli tx gov draft-proposal` can help prepare a proposal. The tool will create a file containing the specified proposal message and it also helps with populating all the required proposal fields. You can always edit the file after you create it using `draft-proposal`

To submit a proposal:

```
secretdcli tx gov submit-proposal path/to/proposal.json

Where proposal.json contains:

{
  // array of proto-JSON-encoded sdk.Msgs
  "messages": [
    {
      "@type": "/cosmos.bank.v1beta1.MsgSend",
      "from_address": "cosmos1...",
      "to_address": "cosmos1...",
      "amount":[{"denom": "stake","amount": "10"}]
    }
  ],
  // metadata can be any of base64 encoded, raw text, stringified json, IPFS link to json
  // see below for example metadata
  "metadata": "4pIMOgIGx1vZGU=",
  "deposit": "10stake",
  "title": "My proposal",
  "summary": "A short summary of my proposal",
  "expedited": false
}
```

metadata example:

```
{
        "title": "",
        "authors": [""],
        "summary": "",
        "details": "",
        "proposal_forum_url": "",
        "vote_option_context": "",
}
```

## Text <a href="#text" id="text"></a>

To submit a `Text` proposal:

```
secretcli tx gov submit-legacy-proposal \
  --title <title> \
  --description <description> \
  --type Text \
  --deposit 100000000uscrt \
  --from <key_alias>
```

You may also provide the proposal directly through the `--proposal` flag which points to a JSON file containing the proposal:

```bash
secretcli tx gov \
    submit-legacy-proposal \
    --proposal <path/to/proposal.json> \
    --from <key_alias>
```

Where `proposal.json` is:

```json
{
  "type": "Text",
  "title": "My Cool Proposal",
  "description": "A description with line breaks \n and `code formatting`",
  "deposit": "100000000uscrt"
}
```

## Param Change <a href="#param-change" id="param-change"></a>

Most cosmos-sdk modules allow changing their governance gated parameters using a `MsgUpdateParams` which is a new way of updating governance parameters. It is important to note that `MsgUpdateParams` requires **all parameters to be specified** in the proposal message.

We will use `draft-proposal` to help us create a proposal file that we will later submit.

```
secretcli tx gov draft-proposal
// running the command will start a terminal applet allowing you to choose the proposal type

// 1st screen
Use the arrow keys to navigate: ↓ ↑ → ←
? Select proposal type:
    text
    community-pool-spend
    software-upgrade
    cancel-software-upgrade
  ▸ other // choose this

// 2nd screen
✔ other
Use the arrow keys to navigate: ↓ ↑ → ←
? Select proposal message type::
↑   /cosmos.staking.v1beta1.MsgUndelegate
  ▸ /cosmos.staking.v1beta1.MsgUpdateParams // choose this option
    /cosmos.staking.v1beta1.MsgValidatorBond
    /cosmos.upgrade.v1beta1.MsgCancelUpgrade
↓   /cosmos.upgrade.v1beta1.MsgSoftwareUpgrade
```

After choosing the `/cosmos.staking.v1beta1.MsgUpdateParams` message, the applet will allow you to set the message fields and some other proposal details. Upon completion, the proposal will be available in the directory where you called the `gaiad` command inside the `draft_proposal.json` file.

Here is an example of the `draft_proposal.json` file:

```
{
 "messages": [
  {
   "@type": "/cosmos.staking.v1beta1.MsgUpdateParams",
   "authority": "secret1...",
   "params": {
    "unbonding_time": "0s",
    "max_validators": 0,
    "max_entries": 0,
    "historical_entries": 0,
    "bond_denom": "",
    "min_commission_rate": "0.000000000000000000"
   }
  }
 ],
 "metadata": "ipfs://CID",
 "deposit": "",
 "title": "Updating the staking params",
 "summary": ""
}
```

Finally, we submit the proposal:

```
secretcli tx gov submit-proposal <path_to_proposal.json>
```

You can see another `param-change` example here: [enigma-1-proposal-3.json](https://github.com/scrtlabs/SecretNetwork/blob/4561c0904c7b7659f019b96147cde13ac8db0933/enigma-1-proposal-3.json)

## **Subspaces, Keys and Values**

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

### Further Proposal Details

* The `subspace` is usually the `ModuleName`
  * [See an example here](https://github.com/cosmos/cosmos-sdk/blob/v0.38.1/x/distribution/types/keys.go#L11)
* The `key` is usually defined in `x/$MODULE_NAME/types/params.go`
  * [See an example here](https://github.com/cosmos/cosmos-sdk/blob/v0.38.1/x/distribution/types/params.go#L19-L22)
* The `value`'s type is usually near the `key` definition
  * [See an example here](https://github.com/cosmos/cosmos-sdk/blob/v0.38.1/x/distribution/types/params.go#L26-L31)
* ⚠️ `subspace` and `key` are case sensitive and `value` must be of the correct type and within the allowed bounds.
  * Proposals with errors on these inputs should not enter voting period (should not get deposits) or be voted on with `NoWithVeto`.
* ⚠️ Currently parameter changes are _evaluated_ but not _validated_, so it is very important that any `value` change is valid (i.e. correct type and within bounds) for its respective parameter, eg. `MaxValidators` should be an integer and not a decimal.
* ⚠️ Proper vetting of a parameter change proposal should prevent this from happening (no deposits should occur during the governance process), but it should be noted regardless.

## **Known Constraints**

* `distribution.baseproposerreward + distribution.bonusproposerreward < 1`. See [this](https://github.com/scrtlabs/SecretNetwork/issues/95) and [this](https://github.com/cosmos/cosmos-sdk/issues/5808) for more info.

To read more go to the [Cosmos Parameters Wiki](https://github.com/gavinly/CosmosParametersWiki).

## Community Pool Spend <a href="#community-pool-spend" id="community-pool-spend"></a>

To submit a community pool spend proposal, you also must provide a proposal file as its contents are less friendly to `secretcli` input:

```
secretcli tx gov submit-proposal <path/to/proposal.json> --from <key_alias>
```

We can create`proposal.json` using `tx gov draft-proposal`

```
secretcli tx gov draft-proposal
// running the command will start a terminal applet allowing you to choose the proposal type

// 1st screen
Use the arrow keys to navigate: ↓ ↑ → ←
? Select proposal type:
    text
    community-pool-spend
  > software-upgrade
    cancel-software-upgrade
    other
```

## Software Upgrade <a href="#software-upgrade" id="software-upgrade"></a>

To submit a `software upgrade` proposal use:

```
secretcli tx gov submit-proposal <path/to/proposal.json> --from <key_alias>
```

We can create`proposal.json` using `tx gov draft-proposal`

```
secretcli tx gov draft-proposal
// running the command will start a terminal applet allowing you to choose the proposal type

// 1st screen
Use the arrow keys to navigate: ↓ ↑ → ←
? Select proposal type:
    text
    community-pool-spend
  > software-upgrade
    cancel-software-upgrade
    other
```

