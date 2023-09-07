---
description: A step-by-step guide on how to auto-wrap SNIP-20 tokens with IBC hooks.
---

# Auto-wrapping of SNIP-20 tokens with IBC Hooks

_Note: this documentation is currently in progress as of 9.7.23_

## Tutorial: Auto-wrapping of SNIP-20 Tokens

In this tutorial, you will learn how to use [IBC hooks](https://docs.scrt.network/secret-network-documentation/development/development-concepts/ibc/ibc-hooks) to auto-wrap [SNIP-20 tokens](https://docs.scrt.network/secret-network-documentation/overview-ecosystem-and-technology/secret-network-overview/private-tokens) between two LocalSecret IBC chains. Simply put, you will learn how to IBC transfer tokens from one blockchain to another blockchain, and in doing so, the token transfer will execute a smart contract call that turns the tokens into privacy-preserving tokens, all with a single token transfer!&#x20;

### Overview

This tutorial will cover the following:&#x20;

1. Set up a Hermes relayer between two LocalSecret chains (Chain A and Chain B)
2. Execute an IBC token transfer between Chain A and Chain B
3. Upload and instantiate a SNIP-20 contract on Chain A
4. Upload and instantiate a Wasm Hooks wrapper contract on Chain A
5. Send tokens from chain A to Chain B, and in doing so, use IBC hooks to auto-wrap SNIP-20 tokens.&#x20;

Let's dive in! 🏊‍♀️

### Set up Hermes Relayer

To follow along with this tutorial, setup a Hermes relayer between two LocalSecret chains using the [Secret IBC setup documentation](https://docs.scrt.network/secret-network-documentation/development/development-concepts/ibc/secret-ibc-setup). Once you have established an [IBC transfer channel](https://docs.scrt.network/secret-network-documentation/development/development-concepts/ibc/secret-ibc-setup#creating-the-ibc-transfer-channel), you are ready to proceed to the next step.&#x20;

### Execute IBC Token Transfer

In order to auto-wrap SNIP-20 token over IBC, we must first instantiate a SNIP-20 contract on LocalSecret that can be used with our SNIP-20 wrapper contract.&#x20;

Because we will be auto-wrapping an IBC token, we must instantiate the SNIP-20 contract with the [**IBC denom**](https://github.com/scrtlabs/examples/blob/ff7d93126c94a5ad6be3b556efbca04f7a6bc573/IBC-wasm-hooks-tutorial/contracts/snip20-reference-impl/src/msg.rs#L28) of the token in order for the contract to receive the token. We can find the IBC denom of our token by executing an IBC token transfer!

{% hint style="info" %}
If you've never funded a Hermes wallet or LocalSecret wallet before, [learn how to do so here](https://github.com/scrtlabs/examples/blob/master/secret-IBC-setup/Wallets.md).&#x20;

If you would like to do further reading, refer to the [LocalSecret wallet docs](https://docs.scrt.network/secret-network-documentation/development/tools-and-libraries/local-secret) and the [Hermes wallet docs](https://hermes.informal.systems/documentation/commands/keys/index.html).&#x20;
{% endhint %}

Assuming you have the wallet key `'a'` which is not the relayer's key, run the following:&#x20;

{% code overflow="wrap" %}
```sh
# be on the source network (secretdev-1)
secretcli config node http://localhost:26657

# check the initial balance of a
secretcli q bank balances secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03

# transfer to the destination network
secretcli tx ibc-transfer transfer transfer channel-0 secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03 1uscrt --from a
```
{% endcode %}

Query that the transaction was successful:&#x20;

```bash
secretcli query tx <tx hash>
```

Now switch to the destination network (secretdev-2) and query the bank balance of **wallet a** to confirm that the transaction was successful:&#x20;

```
# switch to the destination network (secretdev-2)
secretcli config node http://localhost:36657

# check that you have an ibc-denom
secretcli q bank balances secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03
```

Congrats 🎉 You should now see the ibc-denom returned in the transaction query:&#x20;

{% code overflow="wrap" %}
```sh
{"balances":[{"denom":"ibc/834829648E6B51B21713C76E0C1836727DCE221CE3DC8B3AA7BB11F55428887A","amount":"1"},{"denom":"uscrt","amount":"999999999998611996"}],"pagination":{"next_key":null,"total":"0"}}
```
{% endcode %}

### SNIP-20 Contract

Now, let's upload the SNIP-20 contract and instantiate it with the correct IBC denom. `cd` into [./contracts/snip20-reference-impl](https://github.com/scrtlabs/examples/tree/master/IBC-wasm-hooks-tutorial/contracts/snip20-reference-impl) and then compile the contract:&#x20;

```sh
docker run --rm -v "$(pwd)":/contract \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  enigmampc/secret-contract-optimizer 
```

Now upload it (but first make sure you are on chain A):&#x20;

```bash
secretcli config node http://localhost:26657
```

{% code overflow="wrap" %}
```bash
secretcli tx compute store contract.wasm.gz --gas 5000000 --from a --chain-id secretdev-1
```
{% endcode %}

Query that the upload was successful:

```bash
 secretcli query compute list-code
```

If the upload was successful it should return:&#x20;

```bash
[
    {
        "code_id": 1,
        "creator": "secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03",
        "code_hash": "c74bc4b0406507257ed033caa922272023ab013b0c74330efc16569528fa34fe"
    }
]
```

Lastly, instantiate the contract with your associated IBC denom:

{% code overflow="wrap" %}
```bash
 random_bytes=$(openssl rand -base64 32)
secretcli tx compute instantiate 1 '{
  "name": "Secret Secret",
  "symbol": "sSCRT",
  "decimals": 6,
  "prng_seed": "'"$random_bytes"'",
"admin": "secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03",
"initial_balances": [
{
"address": "secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03",
"amount": "1000000000"
}
],
"supported_denoms": ["ibc/834829648E6B51B21713C76E0C1836727DCE221CE3DC8B3AA7BB11F55428887A"]
}' --from a --label snip20 -y
```
{% endcode %}

Query successful instantiation:&#x20;

```bash
secretcli query compute list-contract-by-code 1
```

If the instantiation was successful, it will return:&#x20;

{% code overflow="wrap" %}
```bash
[
    {
        "contract_address": "secret1mfk7n6mc2cg6lznujmeckdh4x0a5ezf6hx6y8q",
        "code_id": 1,
        "creator": "secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03",
        "label": "snip20"
    }
]
```
{% endcode %}

### Wasm Hooks Contract

Now let's upload and instantiate the [wasm hooks contract](https://github.com/scrtlabs/examples/blob/master/IBC-wasm-hooks-tutorial/contracts/ibc-hooks-contract/src/contract.rs):thumbsup:First, `cd` into [./contracts/ibc-hooks-contract](https://github.com/scrtlabs/examples/tree/master/IBC-wasm-hooks-tutorial/contracts/ibc-hooks-contract)

Upload: &#x20;

```bash
  secretcli tx compute store contract.wasm.gz --gas 5000000 --from a --chain-id secretdev-1
```

Query successful upload:&#x20;

```bash
 secretcli query compute list-code
```

Upon successful upload it will return:&#x20;

<pre class="language-bash"><code class="lang-bash"><strong>    {
</strong>        "code_id": 2,
        "creator": "secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03",
        "code_hash": "951cbc1b87b3d360f9a18aaf3fe152a2777bd0d5b595c1509f0980ef45441a36"
    }
</code></pre>

Instantiate:&#x20;

```bash
 secretcli tx compute instantiate 2 '{}' --from a --label wrap-ibc -y
```

Query successful instantiation:&#x20;

```bash
secretcli query compute list-contract-by-code 2
```

If the instantiation was successful it will return:&#x20;

{% code overflow="wrap" %}
```bash
[
    {
        "contract_address": "secret1gyruqan6yxf0q423t8z5zce3x7np35uw8s8wqc",
        "code_id": 2,
        "creator": "secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03",
        "label": "wrap-ibc"
    }
]
```
{% endcode %}

### Auto-wrap Tokens

Now all that's left is to make an IBC token transfer and experience the magic of IBC hooks with our token wrapping contract.&#x20;

First, initialize some variables in your terminal:&#x20;

{% code overflow="wrap" %}
```bash
HUB_CHAIN_ID="secretdev-1"

sSCRT="secret1mfk7n6mc2cg6lznujmeckdh4x0a5ezf6hx6y8q"

WRAP_DEPOSIT_CONTRACT_ADDRESS="secret1gyruqan6yxf0q423t8z5zce3x7np35uw8s8wqc"

myScrtAddress="secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03"

memo=$(echo -n '{"wasm":{"contract":"'$WRAP_DEPOSIT_CONTRACT_ADDRESS'","msg":{"wrap_deposit":{"snip20_address":"'$sSCRT'","recipient_address":"'$myScrtAddress'"}}}}' | base64)
```
{% endcode %}

Now execute the token transfer!

{% code overflow="wrap" %}
```bash
secretcli tx ibc-transfer transfer transfer channel-0 $sSCRT 1uscrt --memo $memo --from a
```
{% endcode %}

Query that it was successful:&#x20;

```bash
secretcli query tx <tx hash>
```

Here is an excerpt from the transaction query which includes the IBC memo:&#x20;

{% code overflow="wrap" %}
```bash
[{"key":"recipient","value":"secret1a53udazy8ayufvy0s434pfwjcedzqv345fkvkj"},{"key":"sender","value":"secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03"},{"key":"amount","value":"1uscrt"}]}]}],"info":"","gas_wanted":"200000","gas_used":"19809","tx":{"@type":"/cosmos.tx.v1beta1.Tx","body":{"messages":[{"@type":"/ibc.applications.transfer.v1.MsgTransfer","source_port":"transfer","source_channel":"channel-0","token":{"denom":"uscrt","amount":"1"},"sender":"secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03","receiver":"secret1mfk7n6mc2cg6lznujmeckdh4x0a5ezf6hx6y8q","timeout_height":{"revision_number":"2","revision_height":"1483"},"timeout_timestamp":"1694102077056751000","memo":"eyJ3YXNtIjp7ImNvbnRyYWN0Ijoic2VjcmV0MWd5cnVxYW42eXhmMHE0MjN0OHo1emNlM3g3bnAzNXV3OHM4d3FjIiwibXNnIjp7IndyYXBfZGVwb3NpdCI6eyJzbmlwMjBfYWRkcmVzcyI6InNlY3JldDFtZms3bjZtYzJjZzZsem51am1lY2tkaDR4MGE1ZXpmNmh4Nnk4cSIsInJlY2lwaWVudF9hZGRyZXNzIjoic2VjcmV0MWFwMjZxcmxwOG1jcTJwZzZyNDd3NDNsMHk4emtxbThhNDUwczAzIn19fX0="}]
```
{% endcode %}

Notice that the sender is our **wallet address a** and the receiver is the **SNIP-20 contract address.**&#x20;

**Congrats!** You've just successfully used IBC hooks to autowrap tokens on Secret Network 🎉🚀
