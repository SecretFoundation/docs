# Secret Contracts

## Uploading a Secret Contract <a href="#uploading-a-secret-contract" id="uploading-a-secret-contract"></a>

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

This will output a long JSON output, like this:

```json
{
  // [...]
  "logs": [
    {
      "msg_index": 0,
      "log": "",
      "events": [
        {
          "type": "message",
          "attributes": [
            {
              "key": "action",
              "value": "store-code"
            },
            {
              "key": "module",
              "value": "compute"
            },
            {
              "key": "signer",
              "value": "your secret address"
            },
            {
              "key": "code_id",
              "value": "your code id"
            }
          ]
        }
      ]
    }
  ],
  "gas_wanted": "5000000",
  "gas_used": "3720108",
  "tx": {
    "@type": "/cosmos.tx.v1beta1.Tx",
    "body": {
      "messages": [
        {
          "@type": "/secret.compute.v1beta1.MsgStoreCode",
          "sender": "your secret address",
          "wasm_byte_code": "...base64 encoded string of your contract's bytecode ...",
          "source": "",
          "builder": ""
        }
      ],
      "memo": "",
      "timeout_height": "0",
      "extension_options": [],
      "non_critical_extension_options": []
    },
  },
  // [...]
  "timestamp": "2022-06-23T13:52:35Z"
}
```

You will then find the code id under the logs.events array on the object with key code\_id.

## Instantiating a Secret Contract <a href="#deploying-a-secret-contract" id="deploying-a-secret-contract"></a>

```shell
secretcli tx compute instantiate $CODE_ID "$INIT_INPUT_MSG" --from mykey --label "$UNIQUE_LABEL"
```

Where `$CODE_ID` is the code id that you got from the command above and `$INIT_INPUT_MSG` is a JSON encoded version of the init message required in your contract.

To get the contract's address:

```
secretcli q tx [hash]
```

You will find the contract address under logs.events.array on the object with key contract\_address.

#### [#](https://docs.scrt.network/cli/secretcli.html#executing-a-secret-contract)Executing a Secret Contract <a href="#executing-a-secret-contract" id="executing-a-secret-contract"></a>

```
secretcli tx compute execute $CONTRACT_ADDRESS "$EXEC_INPUT_MSG"
```

Or:

```
secretcli tx compute execute --label "$UNIQUE_LABEL" "$EXEC_INPUT_MSG"
```

### Reading the output of a Secret Contract tx <a href="#reading-the-output-of-a-secret-contract-tx" id="reading-the-output-of-a-secret-contract-tx"></a>

```
secretcli q compute tx [hash]
```

### Querying a Secret Contract <a href="#querying-a-secret-contract" id="querying-a-secret-contract"></a>

```
secretcli q compute query $CONTRACT_ADDRESS "$QUERY_INPUT_MSG"
```
