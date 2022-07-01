# Secret Contracts

## Uploading a Secret Contract <a href="#uploading-a-secret-contract" id="uploading-a-secret-contract"></a>

To upload a contract:

```bash
secretcli tx compute store ./contract.wasm.gz --from mykey --source "https://github.com/<username>/<repo>/tarball/<version>" --builder "enigmampc/secret-contract-optimizer:1.0.2"
```

* `--source`: Optional tarball of the source code, so your contract will be [verifiable](https://github.com/CosmWasm/cosmwasm-verify).
* `--builder`: Optional docker image used to compile `./contract.wasm.gz`, so that your contract will be [verifiable](https://github.com/CosmWasm/cosmwasm-verify). This is important for reproducible builds so you should figure out the exact version of `enigmampc/secret-contract-optimizer` that you were using.

To get the contract's code ID:

```bash
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

In order to instantiate a contract, simply run the following command:

```shell
secretcli tx compute instantiate $CODE_ID "$INIT_INPUT_MSG" --from mykey --label "$UNIQUE_LABEL"
```

Where `$CODE_ID` is the code id that you got from the command above and `$INIT_INPUT_MSG` is a JSON encoded version of the init message required in your contract. This message will depend on your contract.

To get the contract's address:

```bash
secretcli q tx [hash]
```

You will find the contract address under logs.events.array on the object with key contract\_address.

## Executing a Secret Contract <a href="#executing-a-secret-contract" id="executing-a-secret-contract"></a>

Executing a contract is just as simple, simply use

```
secretcli tx compute execute $CONTRACT_ADDRESS "$EXEC_INPUT_MSG"
```

Where`$CONTRACT_ADDRESS` is the address you found above, and `$EXEC_INPUT_MSG` is the message containing the handle function you're trying to execute. This message will heavily depend on your contract, but generally the format follows the following pattern:

```json
{
    "handler_name_as_snake_case": {
        "argumentA": "value for argument A",
        "argumentB": "value for argument B"
    }
}
```

You can also execute a function on a contract by using the contract's label over the address, like so:

```
secretcli tx compute execute --label "$UNIQUE_LABEL" "$EXEC_INPUT_MSG"
```

Please note that this is not recommended

## Reading the Output of a Secret Contract Tx <a href="#reading-the-output-of-a-secret-contract-tx" id="reading-the-output-of-a-secret-contract-tx"></a>

In order to read the output of a transaction, such as the output of a handle function called by compute execute or a contract that has just been instantiated you would run the following

```bash
secretcli q compute tx $HASH
```

Where $HASH is your transaction hash.

## Querying a Secret Contract <a href="#querying-a-secret-contract" id="querying-a-secret-contract"></a>

Querying a smart contract is just as easy, you just execute the following:

```bash
secretcli q compute query $CONTRACT_ADDRESS "$QUERY_INPUT_MSG"
```

Where`$CONTRACT_ADDRESS` is the address of your contract and `$QUERY_INPUT_MSG` is the query you're trying to run. The output will depend on your contract.
