# Sealed Bid Auction Developer Tutorial

## Overview

A first-price sealed-bid auction, also known as a "blind auction", is a type of auction in which all bidders simultaneously submit sealed bids so that no bidder knows the bid of any other participant. The highest bidder pays the price that was submitted. In this tutorial you will learn **how to create a cross-chain sealed bid auction dApp with encrypted bids using**[ **SecretPath**](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/basics/cross-chain-messaging/secretpath).&#x20;

{% hint style="success" %}
See a live demo [here](https://secretpath-tutorials.vercel.app/)! _See the fullstack frontend code implementation_ [_here_](https://github.com/SecretFoundation/Secretpath-tutorials/tree/master/sealed-bid-auctions/frontend)_._&#x20;
{% endhint %}

You will start by configuring your developer environment and then learn how to use SecretPath to enable cross-chain encryption and decryption, **using Secret Network as** **a Confidential Computing Layer (CCL) for the EVM**.&#x20;

## Getting Started

To get started, clone the SecretPath tutorials repository:&#x20;

```bash
git clone https://github.com/SecretFoundation/Secretpath-tutorials
```

### EVM Prerequisites&#x20;

1. [Fund ](https://www.infura.io/faucet/sepolia)your Sepolia wallet.&#x20;

### Secret Network Prerequisites

1. [Add Secret Network testnet to Keplr](https://keplr-connect-pulsar3.vercel.app/).&#x20;
2. [Fund your Secret testnet wallet](https://faucet.pulsar.scrttestnet.com/).&#x20;

### Uploading Sealed Bid Contract <a href="#configuring-environment-variables" id="configuring-environment-variables"></a>

`cd` into `sealed-bid-auctions/sealed-bid-contract`

```bash
cd sealed-bid-auctions/sealed-bid-contract
```

Update the [`env` file](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/sealed-bid-auctions/sealed-bid-contract/node/.env.example) with your Secret Network wallet mnemonic, and rename it ".env" instead of ".env.example"

**Compile the contract**

```bash
make build-mainnet
```

`cd` into `secret-contract/node:`

```bash
cd node
```

**Install the node dependencies**

```bash
npm install
```

**Set SecretPath parameters:**&#x20;

Open upload.js and configure the SecretPath [`gatewayAddress`](https://github.com/writersblockchain/sealed-bid-auctions/blob/4bf0c2a42c4000abd609689c1a5df66e0993b7a0/secret-contract/node/upload.js#L10), [`gatewayHash`](https://github.com/writersblockchain/sealed-bid-auctions/blob/4bf0c2a42c4000abd609689c1a5df66e0993b7a0/secret-contract/node/upload.js#L12), and [`gatewayPublicKey`](https://github.com/writersblockchain/sealed-bid-auctions/blob/4bf0c2a42c4000abd609689c1a5df66e0993b7a0/secret-contract/node/upload.js#L15C12-L15C23)`:`

```javascript
const gatewayAddress = "secret10ex7r7c4y704xyu086lf74ymhrqhypayfk7fkj";

const gatewayHash =
  "012dd8efab9526dec294b6898c812ef6f6ad853e32172788f54ef3c305c1ecc5";

const gatewayPublicKey =
  "0x046d0aac3ef10e69055e934ca899f508ba516832dc74aa4ed4d741052ed5a568774d99d3bfed641a7935ae73aac8e34938db747c2f0e8b2aa95c25d069a575cc8b";
```

{% hint style="info" %}
gatewayAddress, gatewayHash, and gatewayPublicKey are needed for instantiating contracts that utilize SecretPath and can be found in the docs [here](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/supported-networks/evm-testnet/secretpath-testnet-pulsar-3-contracts). You will always use these same 3 parameters for instantiating a SecretPath-compatible contract on testnet.
{% endhint %}

Upload and instantiate the contract:&#x20;

```bash
node upload
```

{% hint style="success" %}
Upon successful upload and instantiation, add the contract codehash and address to your [env](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/sealed-bid-auctions/sealed-bid-contract/node/.env.example).
{% endhint %}

### List an Auction Item

Now that you've instantiated a sealed bid contract on Secret Network, it's time to create your first auction item with SecretPath!&#x20;

`cd` into `sealed-bid-auctions/evm-contract`:&#x20;

```bash
cd sealed-bid-auctions/evm-contract
```

**Install the dependencies**&#x20;

```bash
npm i
```

**Configure env**

Configure the [`env`](https://github.com/SecretFoundation/Secretpath-tutorials/blob/master/sealed-bid-auctions/evm-contract/.env.example)with your sealed bid auction contract address and codehash, and rename it ".env" instead of ".env.example".&#x20;

**Configure SecretPath**&#x20;

Open [scripts/create\_auction.js](https://github.com/writersblockchain/sealed-bid-auctions/blob/master/evm-contract/scripts/create\_auction.js) and navigate to [line 44](https://github.com/writersblockchain/sealed-bid-auctions/blob/3c9ac06091f6c1b7345ff3e8abc8435b957622d4/evm-contract/scripts/create\_auction.js#L44), the `publicClientAddress`. This is the SecretPath gateway address for [Sepolia testnet](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/supported-networks/evm-testnet/evm-testnet-gateway-contracts).&#x20;

{% hint style="info" %}
If you wanted to send messages on another chain, such as Base or Polygon, you would simply update this publicClientAddress with the corresponding address found[ here](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/supported-networks/evm-testnet/evm-testnet-gateway-contracts). &#x20;
{% endhint %}

Similarly, there is a SecretPath gateway encryption key, which is on[ line 63.](https://github.com/writersblockchain/sealed-bid-auctions/blob/3c9ac06091f6c1b7345ff3e8abc8435b957622d4/evm-contract/scripts/create\_auction.js#L63) This is used for ChaCha20-Poly1305 Payload encryption and can be found in the docs [here.](https://docs.scrt.network/secret-network-documentation/development/ethereum-evm-developer-toolkit/supported-networks/evm-testnet/secretpath-testnet-pulsar-3-contracts)&#x20;

{% hint style="info" %}
If you wanted to do this for mainnet, you would simply use the mainnet encryption key.
{% endhint %}

Next, configure the auction [`name`, `description,` and `end_time`](https://github.com/writersblockchain/sealed-bid-auctions/blob/3c9ac06091f6c1b7345ff3e8abc8435b957622d4/evm-contract/scripts/create\_auction.js#L72-L75) to your liking (`end_time` is the amount of minutes that the auction will be live for), and note the `handle` variable, which is the function that is actually being called in the Secret contract that you deployed. You are executing the [`create_auction_item`](https://github.com/writersblockchain/sealed-bid-auctions/blob/3c9ac06091f6c1b7345ff3e8abc8435b957622d4/evm-contract/scripts/create\_auction.js#L78) handle, which executes the [`create_auction-item` function ](https://github.com/writersblockchain/sealed-bid-auctions/blob/3c9ac06091f6c1b7345ff3e8abc8435b957622d4/secret-contract/src/contract.rs#L67)in your sealed bid contract.&#x20;

Now that you have all of your SecretPath code configured,  execute the SecretPath Sepolia public gateway contract to send your auction item to the Secret contract:

```bash
npx hardhat run scripts/create_auction.js --network sepolia 
```

{% hint style="info" %}
Each auction item you create will have an associated ID; the first auction item has ID 1, the second has ID 2, and so on.&#x20;
{% endhint %}

Upon successful execution, info about your SecretPath payload will be returned:&#x20;

```bash
Payload Hash: 0x6a822118ea803fe9274c502d354dfd6b24e99f9a67b8b4b11032649dc4b82da1
Payload Signature: 0x77e3a0fd7bb8ea7d96889ed82521672ee0a7e0c5cb81cdc2187e7253407e8f136204d578f13a832dcacb1b2509118114b4aca0635984bb1d7d673579572cf9261b
Recovered public key: 0x0423d8d8b518902cd6b0da592af0424719c355a724687cb74d96bd1171eb148edb87f3e9ca67f9ccecde109333461162af4dc09b33604c7e82242852a7142878ec
Verify this matches the user address: 0x49e01eb08bBF0696Ed0df8cD894906f7Da635929
_userAddress: 0x49e01eb08bBF0696Ed0df8cD894906f7Da635929
  _routingInfo: secret1xw2ge736z7la2fwuwwh89edwcxks4dv3qf2mg8 
  _payloadHash: 0x6a822118ea803fe9274c502d354dfd6b24e99f9a67b8b4b11032649dc4b82da1 
  _info: {"user_key":"0x026c4af0a833ed26f82058d882a0e18114ac398eebdc05b206d11a9060c075026c","user_pubkey":"0x0423d8d8b518902cd6b0da592af0424719c355a724687cb74d96bd1171eb148edb87f3e9ca67f9ccecde109333461162af4dc09b33604c7e82242852a7142878ec","routing_code_hash":"6d38a8569aba096b0849253dbf8de09b9c72dd693f2a6d1d87697fc0877cbc29","task_destination_network":"pulsar-3","handle":"create_bid","nonce":"0x0d0075c1a22be720ad003eba","payload":"0x0b47475944f9a0c966f9b8be7f779f291c31eb11a78132a19fb23aef1b97a92b189e938b5d1975d81836f2ff0aa89e0ade4b48140c609e996ba7d5efb4c0a99272ad1858db46721cb7b9868afd57aeccaa9166270b9e0ca5f8d4d9bf0cc8907a648b1587bf6f2c4081fbbb7b480848ebd7dd3f9872586583293f1f0ae68cf45c4f5c7cc190efd4d9989d5fba0237114fa63b68ed737a1936ab76f974862e072e2f84e445e5968aff6ca085186e0cb8139a29a262587735706eb68ec9a655114d317a777b3394d3221bb94d5f8ed689e71a770be1c56e9dd1bfea4e5fc191b00cbc3323b851064bfe18ba2e4b8720e618d212634b3d048478c90a004b4cd7a751ce8c8ed43323245ce064fdd82ebaa6d6e41e2256c73525afd092b77917e6e6281a9a0ba72836e66cd539e99d335c83decb91ee53d15cab8bf699b44c4aea43ffa34bc64c57f3873b3159d02e6439d8650d974b62053ef9c56122fb83d2b69a7c870b87ca44358fbb74435ea03faaf3303dc4025194030270b2dd32d125bb839d4e0e6f984835a788fde0464a068658c5b6a1d7c30ba46603ba8c870f940a87c1b2e3577d741d4b8b1120561ac85d7b6898f80a5e57c43dbfe456da501fcab2837a81f1755a6db7f928f3d3f23793e71f108fc6b4b6257317b8279c0c2b00019e08b90f28658eb9fc211f554b3b9325d5add78c2db37b6d48793e","payload_signature":"0x77e3a0fd7bb8ea7d96889ed82521672ee0a7e0c5cb81cdc2187e7253407e8f136204d578f13a832dcacb1b2509118114b4aca0635984bb1d7d673579572cf9261b","callback_gas_limit":300000}
  _callbackAddress: 0x3879e146140b627a5c858a08e507b171d9e43139,
  _callbackSelector: 0x373d450c,
  _callbackGasLimit: 300000
Transaction sent! Hash: 0xae5dd78f381b67e470a70eaf757c306a1ee605f145007cd7a6e4f4cb8d56be4b
Transaction confirmed! Block Number: 5683035
```

### Bid On Auction Item

Now it's time to place an encrypted bid on your listed auction item. Open [bid.js ](https://github.com/writersblockchain/sealed-bid-auctions/blob/master/evm-contract/scripts/bid.js) and adjust the [amount](https://github.com/writersblockchain/sealed-bid-auctions/blob/3c9ac06091f6c1b7345ff3e8abc8435b957622d4/evm-contract/scripts/bid.js#L72) that you want to bid as well as the [index](https://github.com/writersblockchain/sealed-bid-auctions/blob/3c9ac06091f6c1b7345ff3e8abc8435b957622d4/evm-contract/scripts/bid.js#L74) of the auction item.&#x20;

{% hint style="info" %}
Note that the sealed bid contract is designed so that each auction item has an ascending index number starting with 1. So the first auction item you list is index 1, the second is index 2, and so on.&#x20;
{% endhint %}

Once you have set your bid, execute the bid function:&#x20;

```
npx hardhat run scripts/bid.js --network sepolia
```

Upon successful execution, info about your SecretPath payload will be returned. Now let's query your auction item and bids with secret.js.&#x20;

### Querying Auction Items and Bids

`cd` into `sealed-bid-auctions/sealed-bid-contract/node`:&#x20;

```bash
cd sealed-bid-auctions/sealed-bid-contract/node
```

Make sure you have added your Sealed bid contract address and codehash to your env file, and then query the auction item with `node query_auction`:&#x20;

```bash
node query_auction 
```

{% hint style="info" %}
Note that you are querying with key 1, because the first auction item is stored at index 1, the second auction item is stored at index 2, and so on.&#x20;
{% endhint %}

If your auction item was submitted successfully, it should be returned like so:&#x20;

```javascript
{
  name: 'auction item #1',
  description: 'this is the 1st auction item',
  end_time: 4397696,
  message: 'Retrieved value successfully'
}
```

{% hint style="info" %}
NOTE: `end_time` is converted from minutes to Secret Network block height [in the sealed bid auction contract](https://github.com/SecretFoundation/Secretpath-tutorials/blob/031814e7c46305b3594b747db397e62066b10554/sealed-bid-auctions/sealed-bid-contract/src/contract.rs#L287) 😎
{% endhint %}

Now, query the [encrypted bids ](https://sepolia.etherscan.io/tx/0x815ff8c8c477a4b44ec174efa06cac4c855cec2e2621bd43f52e0350424ce620)by running `node query_bid`:

```basic
node query_bid
```

If the bidding is still open, it will return the message:&#x20;

```javascript
{ message: 'Bidding is open' }
```

If the bidding is closed, it will return the highest bid:&#x20;

```javascript
{ message: 'Bidding is closed. The highest bid is: 300' }
```

This is programmed in the [retrieve\_bids\_query function](https://github.com/SecretFoundation/Secretpath-tutorials/blob/031814e7c46305b3594b747db397e62066b10554/sealed-bid-auctions/sealed-bid-contract/src/contract.rs#L241) of the Sealed Bid contract and can be adjusted to your liking 😊

{% hint style="info" %}
NOTE: Be sure to update the [index of the query](https://github.com/SecretFoundation/Secretpath-tutorials/blob/031814e7c46305b3594b747db397e62066b10554/sealed-bid-auctions/sealed-bid-contract/node/query\_bid.js#L14) for subsequent auction item queries&#x20;
{% endhint %}

### Conclusion

Congrats! You deployed your very own sealed bid auction contract on Secret Network and used SecretPath to send cross-chain encrypted bids on Sepolia testnet. See the fullstack demo [here](https://secretpath-tutorials.vercel.app/). You now have all of the tools you need to start building your own cross-chain SecretPath contracts on the EVM 🎉

Note that the end user of the application is not exposed to Secret Network and is only working directly in the EVM environment. However, the data is fully protected and cannot be viewed by anyone.

If you have any questions or run into any issues, post them on the [Secret Developer Discord ](https://discord.gg/secret-network-360051864110235648)and somebody will assist you shortly.&#x20;
