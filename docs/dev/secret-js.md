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
SECRET_GRPC_WEB_URL='http://rpc.pulsar.griptapejs.com:9091'
SECRET_WS_URL='wss://rpc.pulsar.griptapejs.com/websocket'
SECRET_CHAIN_ID='pulsar-2'

MNEMONIC='<YOUR SECRET MNEMONIC>'
ADDRESS='<YOUR ACCOUNT ADDRESS>'
```
You will also need to configure the Secret Network CLI to work with the pulsar-2 test network: 

```bash
secretcli config node https://pulsar-2.api.trivium.network:26657/

secretcli config chain-id pulsar-2

secretcli config keyring-backend 
```

If you do not have a mnemonic and public address for testing purposes yet create one using:  

```bash
secretcli keys add <key-alias> // choose your own alias
```

After creating an account add funds to the account using the [pulsar-2 faucet.](https://faucet.secrettestnet.io/)

Query your account balance to confirm faucet funding: 

```bash 
secretcli query bank balance <account address>
```

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

After running 'npm run 2' there will be an output containing a 12 word mnemonic seed phrase, an account address, and SCRT balance (balance will be 0).  

Now add the new account made with SecretJS to the Secret Network CLI keys list using the accounts mnemonic seed phrase: 

```bash 
secretcli keys add --recover <key-alias> // set key alias to what ever you want
> Enter your bip39 mnemonic 
<accounts mnemonic> 

secretcli keys list
```

You will now see the newly created Secret Network account made with SecretJS in your keys list associated with the key-alias you provided it with. 

## How to query a node 

Querying a node produces information about the Secret Network node such as: node information, latest block, block height, and account information.

To query a node use: 

```bash 
npm run 3
```
By running 'npm run 3' the SecretJS-Template creates a readonly connection to a Secret Network node, and returns node information, latest block, block height, and account information from the account making the query. For example, the returned node information will look similar to the following code snippet where you can find default node information, application version information, and more: 

```javascript
Node Info: {
  defaultNodeInfo: {
    protocolVersion: { p2p: '8', block: '11', app: '0' },
    defaultNodeId: '63b0dc21d557c97a41fc51095d161c7b069d4946',
    listenAddr: 'tcp://0.0.0.0:26656',
    network: 'pulsar-2',
    version: '0.34.14',
    channels: Uint8Array(10) [
      64, 32, 33, 34, 35,
      48, 56, 96, 97,  0
    ],
    moniker: 'testordie3',
    other: { txIndex: 'on', rpcAddress: 'tcp://0.0.0.0:26657' }
  },
  applicationVersion: {
    name: 'SecretNetwork',
    appName: 'secretd',
    version: 'v0.0.0',
    gitCommit: '',
    buildTags: 'netgo ledger hw develop',
    goVersion: 'go version go1.15.15 linux/amd64',
  
  ...
```
## Transfer tokens 

Now we will learn how to transfer tokens using secretJS. We will start by making a series of transactions sending uscrt to and from the same account, then move onto more complex transaction such as batching multiple transactions in the same block and sending multiple messages in the same transaction. 

### Simple token transfer 

To transfer tokens from one wallet to another, or back into the same wallet, there are a few things that need to happen: 

1. A wallet must be passed into the connected node to sign transactions (the wallet is imported into the secretJS template using the mnemonic seed phrase from the .env file)
2. A connection must be created to a Secret Network node
3. An address must be provided to send tokens to (in this case it will be to the same wallet sending the tokens)
4. An amount of tokens to send must be provided (we will be sending 1usrct)
5. A gas fee must be paid for the node to process the token transfer transaction 

```bash 
npm run 4
```
