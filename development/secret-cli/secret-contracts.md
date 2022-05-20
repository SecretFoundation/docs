# Secret Contracts

#### Uploading a Secret Contract <a href="#uploading-a-secret-contract" id="uploading-a-secret-contract"></a>

To upload a contract:

```
secretcli tx compute store ./contract.wasm.gz --from mykey --source "https://github.com/<username>/<repo>/tarball/<version>" --builder "enigmampc/secret-contract-optimizer:1.0.2"
```

* `--source`: Optional tarball of the source code, so your contract will be [verifiable](https://github.com/CosmWasm/cosmwasm-verify).
* `--builder`: Optional docker image used to compile `./contract.wasm.gz`, so that your contract will be [verifiable](https://github.com/CosmWasm/cosmwasm-verify). This is important for reproducible builds so you should figure out the exact version of `enigmampc/secret-contract-optimizer` that you were using.

To get the contract's code ID:

```
secretcli q tx [hash]
```

#### [#](https://docs.scrt.network/cli/secretcli.html#deploying-a-secret-contract)Deploying a Secret Contract <a href="#deploying-a-secret-contract" id="deploying-a-secret-contract"></a>

```
secretcli tx compute instantiate $CODE_ID "$INIT_INPUT_MSG" --from mykey --label "$UNIQUE_LABEL"
```

To get the contract's address:

```
secretcli q tx [hash]
```

#### [#](https://docs.scrt.network/cli/secretcli.html#executing-a-secret-contract)Executing a Secret Contract <a href="#executing-a-secret-contract" id="executing-a-secret-contract"></a>

```
secretcli tx compute execute $CONTRACT_ADDRESS "$EXEC_INPUT_MSG"
```

Or:

```
secretcli tx compute execute --label "$UNIQUE_LABEL" "$EXEC_INPUT_MSG"
```

#### [#](https://docs.scrt.network/cli/secretcli.html#reading-the-output-of-a-secret-contract-tx)Reading the output of a Secret Contract tx <a href="#reading-the-output-of-a-secret-contract-tx" id="reading-the-output-of-a-secret-contract-tx"></a>

```
secretcli q compute tx [hash]
```

#### [#](https://docs.scrt.network/cli/secretcli.html#querying-a-secret-contract)Querying a Secret Contract <a href="#querying-a-secret-contract" id="querying-a-secret-contract"></a>

```
secretcli q compute query $CONTRACT_ADDRESS "$QUERY_INPUT_MSG"
```
