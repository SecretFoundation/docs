# Create your own SNIP-25 IBC Token

{% hint style="info" %}
Got questions about creating your IBC SNIP-25 Tokens? Please ask in the Secret Network [Telegram](https://t.me/SCRTCommunity) or Discord.
{% endhint %}

In case you want to bridge in a new IBC token and super charge it with the SNIP-25 capabilities of Secret Network, here is how you can do it.

We will explore how to instantiate a contract on Secret Network with specific parameters. We'll break down the command `secretcli tx compute instantiate 877 ...` to explain each component, focusing on the meaning of IBC denoms and the other key elements.

## Prerequisites

Before running this command, ensure you have the following:

* A working installation of `secretcli`, see here: [installing-cli-and-creating-a-new-address.md](../../infrastructure/setting-up-a-node-validator/node-setup/installing-cli-and-creating-a-new-address.md "mention")
* Understanding of smart contracts and Secret Network's privacy features
* The correct IBC Token denomination, see below.

## IBC Denominations

Inter-Blockchain Communication (IBC) is a protocol for blockchains to communicate and transfer assets. Each IBC denom is a unique identifier representing a specific token on a specific blockchain. The format `"ibc/5938378D6974EF73519C90789CBBFFFAEC43992A3D2B5E3F465F5DA96E434029"` indicates an asset that originates from another blockchain connected via IBC.

You can calculate the IBC denom of any bridged in token via IBC via the following formula:

```bash
// hash() representing a SHA256 hashing function returning a string 
ibc_denom := 'ibc/' + hash('path' + 'base_denom')
```

For more information about IBC denoms, please check out [here](https://tutorials.cosmos.network/tutorials/6-ibc-dev/).

In the context of this tutorial, the `supported_denoms` list specifies which IBC tokens this contract can interact with. This feature is crucial for cross-chain compatibility and enables various interchain operations.

## Command Breakdown

```shell
secretcli tx compute instantiate 877 
'{"name":"Secret SAGA",
"admin":"secret1e8fnfznmgm67nud2uf2lrcvuy40pcdhrerph7v",
"symbol":"SSAGA","decimals":6,"initial_balances":[],
"prng_seed":"eW9sbwo=",
"config":{"public_total_supply":true,"enable_deposit":true,
"enable_redeem":true,"enable_mint":false,"enable_burn":false,"can_modify_denoms": true},
"supported_denoms":["ibc/5938378D6974EF73519C90789CBBFFFAEC43992A3D2B5E3F465F5DA96E434029"]}' 
--admin secret1lrnpnp6ltfxwuhjeaz97htnajh096q7y72rp5d 
--from {your key alias}  
--gas 150000 
--label secret-saga 
-b block
```

#### Compute Module

The `tx compute instantiate` command is used to instantiate (deploy) a smart contract on the Secret Network. In this case, we're deploying a contract with the ID `877`, which is the SNIP-25 reference implementation contract on Secret Network.

#### JSON Configuration

The JSON part of the command specifies the configuration for the contract:

* **name**: The name of the token (e.g., "Secret SAGA"). The pattern to follow here is "Secret" followed by the name or denom of the token.
* **admin**: The address that can manage the contract. Please keep this strictly assigned to the SCRT Labs token admin address `secret1e8fnfznmgm67nud2uf2lrcvuy40pcdhrerph7v` .
* **symbol**: The token symbol for easy identification (e.g., "SSAGA"). The pattern to follow here is "S" followed by the denom of the token. Please make sure to capitalize all letters.
* **decimals**: The decimal places for the token.
* **initial\_balances**: An empty list because there are no initial token distributions.
* **prng\_seed**: A seed used for pseudo-random number generation. The seed here is set to `"yolo"` in ASCII, which is `"eW9sbwo="` in base64.
* **config**: A set of flags that determine how the contract operates. This configuration allows public total supply visibility, deposit and redeem operations, but not minting or burning of tokens. It also permits modification of token denoms (denominations).
* **supported\_denoms**: A list of supported IBC denoms (Inter-Blockchain Communication denominations) for this token contract. The denom `"ibc/5938378D6974EF73519C90789CBBFFFAEC43992A3D2B5E3F465F5DA96E434029"` is a unique identifier for a token that was bridged in via IBC.

#### Transaction Options

* **--admin**: The address that has administrative control over the contract.  Please keep this strictly assigned to the SCRT Labs admin address `secret1lrnpnp6ltfxwuhjeaz97htnajh096q7y72rp5d`.
* **--from**: Specifies which account is executing the transaction, this is your key alias.
* **--gas**: Sets the maximum gas limit for the transaction (150,000 gas units).
* **--label**: A label to identify the instantiated contract ("secret-saga").
* **-b block**: Waits for the transaction to be included in a block before completing.

### Conclusion

This tutorial explained how to instantiate a smart contract on Secret Network with IBC support. By understanding the components of the command, you can customize it to meet your needs and deploy contracts with specific configurations. If you're building cross-chain applications, consider exploring IBC to enable seamless communication between blockchains.
