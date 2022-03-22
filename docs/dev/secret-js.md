# SecretJS

## Building Secret Apps with SecretJS

A Secret App is a decentralized application with computational and data privacy. Secret Apps are usually comprised of the following components:

- A Secret Contract deployed on the Secret Network
- A frontend app built with a JavaScript framework (e.g. ReactJS, VueJS, AngularJS, etc.) connected to the Secret Network using SecretJS
- SecretJS interacting with a REST API exposed by nodes in the Secret Network. The REST API/HTTPS server is commonly referred to as LCD Server (Light Client Daemon). Usually by connecting SecretJS with a wallet, the wallet handles interactions with the LCD server.

You will need to have the Secret Network CLI installed to complete this set of tutorials. If it's not installed yet, follow the instructions found [HERE.](https://build.scrt.network/light-client-mainnet.html)

## SecretJS Tutorial Set Up 

Get started by cloning the [SecretJS Templates](https://github.com/scrtlabs/SecretJS-Templates) repo: 

```sh 
git clone https://github.com/scrtlabs/SecretJS-Templates.git
```
The project directory will contain the following structure: 

```
.   1_connecting_to_node  3_query_node    5_contracts  7_snip20_token  .env          .env.local.example    .git        node_modules  package-lock.json
..  2_creating_account    4_transactions  6_wallets    8_websocket     .env.example  .env.testnet.example  .gitignore  package.json  README.md
```

For this tutorial we will be using the pulsar-2 test network to go through each SecretJS example. To do this we need to update the contents of the .env file to contain the following: 

```
SECRET_REST_URL='https://api.pulsar.griptapejs.com/'
SECRET_RPC_URL='https://rpc.pulsar.griptapejs.com:443'
SECRET_WS_URL='wss://rpc.pulsar.griptapejs.com/websocket'
SECRET_CHAIN_ID='pulsar-2'

MNEMONIC='<YOUR SECRET MNEMONIC>'
ADDRESS='<YOUR ACCOUNT ADDRESS>'
```
You will also need to configure the Secret Network CLI to work with the RPC and Secret chain ID of the .env file: 

```bash
secretcli config node https://rpc.pulsar.griptapejs.com:443

secretcli config chain-id pulsar-2

secretcli config keyring-backend test
```

If you do not have a mnemonic and public address yet create one using:  

```bash
secretcli keys add <key-alias>
```

After creating an account add funds to the account using the [pulsar-2 faucet.](https://faucet.secrettestnet.io/)

## Connecting to a node 

Now it's time to connect to a pulsar-2 test net node. Run the following command in the root directory of the SecretJS-Templates folder: 

```
npm run 1
```

You will see an output similar to the following: 

```
ChainId: pulsar-2
Block height: <block height at time of connection> 
Successfully connected to Secret Network
```

The code responsible for connecting with pulsar-2 in SecretJS-Templates/1_connecting_to_node/connect.js is: 

```rust 
const client = new CosmWasmClient(process.env.SECRET_REST_URL)
```

## Creating an account 

After successfully connecting to the Secret Network using SecretJS, we will now create an account using SecretJS. 

```bash 
npm run 2
```

***Note***: If you are getting an "Unexpected response data format" error, it is due to SecretJS getting an invalid result 'type'. It is not a bug in SecretJS itself, but related to the Cosmos SDK providing a compatible LCD API. The error can be resolved by changing 'cosmos-sdk/Account' to 'cosmos-sdk/BaseAccount' on line 106 within the SecretJS-Templates/node_modules/secretjs/build/restclient.js file. 

```javascript
if (responseData.result.type !== "cosmos-sdk/BaseAccount")
```

After running 'npm run 2' there will be an output containing a 12 word mnemonic seed phrase and a public account address. Under the 'account' portion of account creation there will be a series of 'undefined' key:value pairs. 

```
mnemonic:  exist arrow purpose lift adjust guess gate air nest enough long diagram
address:  secret18r6f87s6l4xzqgj7ukllsxxsacugkq5mx8sdkw
account:  {
  address: undefined,
  balance: undefined,
  pubkey: undefined,
  accountNumber: undefined,
  sequence: undefined
}
undefined
```
Now add the new account made with SecretJS to the Secret Network CLI using the accounts mnemonic seed phrase, and view all available keys: 

```bash 
secretcli keys add --recover <key-alias>
> Enter your bip39 mnemonic 
<accounts mnemonic> 

secretcli keys list
```
You will now see the newly created Secret Network account made with SecretJS in your keys list associated with the key-alias you provided it with. 


