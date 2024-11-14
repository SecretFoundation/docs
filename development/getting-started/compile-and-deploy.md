---
description: >-
  In this example, we will compile, upload, and instantiate our first smart
  contract using SecretCLI and Secret Testnet.
---

# Compile and Deploy

Now that you've set up your development environment, we are going to learn how to compile, upload, and instantiate a smart contract using SecretCLI in your testnet environment.

{% hint style="info" %}
For a step-by-step Secret Network SecretCLI video tutorial, [follow along here](https://www.youtube.com/watch?v=ZpUz-9sORho\&ab\_channel=SecretNetwork) 🎥. Otherwise, continue reading!
{% endhint %}

We will be working with a basic [counter contract](https://github.com/SecretFoundation/secret-template), which allows users to increment a counter variable by 1 and also reset the counter. If you've never worked with smart contracts written in Rust before that is perfectly fine. By the end of this tutorial you will know how to upload and instantiate a Secret Network smart contract in your terminal using SecretCLI.

### Generate your new counter contract

The first thing we need to do is clone the counter contract from the [Secret Network github repo](https://github.com/SecretFoundation/secret-template). Secret Network developed this counter contract template so that developers have a simple structure to work with when developing new smart contracts, but we're going to use the contract exactly as it is for learning purposes.

Go to the folder in which you want to save your counter smart contract and run:

```bash
cargo generate --git https://github.com/SecretFoundation/secret-template.git --name my-counter-contract
```

{% hint style="info" %}
When you run the above code, it will name your contract folder directory "my-counter-contract". But you can change the name by altering the text that follows the `--name` flag.
{% endhint %}

Start by opening the `my-counter-contract` project folder in your text editor. If you navigate to `my-counter-contract/src` you will see`contract.rs, msg.rs, lib.rs, and state.rs`—these are the files that make up our counter smart contract. If you've never worked with a Rust smart contract before, perhaps take some time to familiarize yourself with the code, although in this tutorial we will not be going into detail discussing the contract logic.

### Compile the Code

Since we are not making any changes to the contract code, we are going to compile it exactly as it is. To compile the code, run `make build-mainnet-reproducible` in your terminal. This will take our Rust code and build a Web Assembly file that we can deploy to Secret Network. Basically, it just takes the smart contract that we've written and translates the code into a language that the blockchain can understand.

{% tabs %}
{% tab title="Linux/WSL/MacOS" %}
```bash
make build-mainnet-reproducible
```
{% endtab %}

{% tab title="Windows" %}
```
$env:RUSTFLAGS='-C link-arg=-s'
cargo build --release --target wasm32-unknown-unknown
cp ./target/wasm32-unknown-unknown/release/*.wasm ./contract.wasm
```
{% endtab %}

{% tab title="Secret IDE" %}
Run `make build` from the terminal, or just GUI it up -

![](<../../.gitbook/assets/image (9).png>)
{% endtab %}
{% endtabs %}

This will create a `contract.wasm.gz` file in the root directory.

### Storing the Contract

Now that we have a working contract and an optimized wasm file, we can upload it to the blockchain and see it in action. This is called **storing the contract code**. We are using a testnet environment, but the same commands apply no matter which network you want to use - local, public testnet, or mainnet.

In order to store the contract code, we first must create a wallet address in order to pay for transactions such as uploading and executing the contract.

#### Creating a Wallet

To interact with the blockchain, we first need to initialize a wallet. From the terminal run:

`secretcli keys add myWallet`

{% hint style="info" %}
You can name your wallet whatever you'd like, for this tutorial I chose to name my wallet "myWallet"
{% endhint %}

You should now have access to a wallet with a unique name, address, and mnemonic, which you can use to upload the contract to the blockchain:

<figure><img src="../../.gitbook/assets/LocalSecret - myWallet .png" alt=""><figcaption></figcaption></figure>

The wallet currently has zero funds, which you query by running this secretcli command (be sure to use your wallet address in place of mine)

```bash
secretcli query bank balances "secret158v062sat459ygam4y5j9z6p6e6g8wcdw6z4xp"
```

To fund the wallet so that it can execute transactions, you can get testnet tokens from the faucet [here](https://faucet.pulsar.scrttestnet.com/).

#### Upload the contract

Finally, we can upload our contract:

```bash
 secretcli tx compute store contract.wasm.gz --gas 5000000 --from myWallet --chain-id pulsar-3 --node https://rpc.testnet.secretsaturn.net --fees=70000uscrt
```

{% hint style="info" %}
`--from <name>` refers to which account (or wallet) is sending the transaction. Update \<name> to your wallet address.

`--gas 5000000` refers to the cost of the transaction we are sending. Gas is the unit of cost which we measure how expensive a transaction is.

`--chain-id` refers to which chain we are uploading to, which in this case is for Secret testnet!
{% endhint %}

To verify whether storing the code has been successful, we can use SecretCLI to query the chain:

```bash
secretcli query compute list-code --chain-id pulsar-3 --node https://rpc.testnet.secretsaturn.net
```

Which should give an output similar to the following:

```json
[
   {"code_id":"12163","creator":"secret158v062sat459ygam4y5j9z6p6e6g8wcdw6z4xp","code_hash":"672ff09984b417665122ec5b78dfd045292150c3252e45826f117af29a8aa83e","source":"","builder":""}]}
]
```

### Instantiating the Contract

In the previous step we stored the contract code on the blockchain. To actually use it, we need to instantiate a new instance of it.

{% code overflow="wrap" %}
```bash
secretcli tx compute instantiate <your-code-id> '{"count": 1}' --from <name> --label <your-label> --chain-id pulsar-3 --node https://rpc.testnet.secretsaturn.net --fees=70000uscrt -y
```
{% endcode %}

{% hint style="info" %}
* `instantiate 1` is the code\_id that you created in the previous section
* `{"count": 1}` \*\*\*\* is the instantiation message. Here we instantiate a starting count of 1, but you can make it any `i32 you want`
* `--from <name>` \*\*\*\* is your wallet address
* `--label` is a mandatory field that gives the contract a unique meaningful identifier
{% endhint %}

Let's check that the instantiate command worked:

{% code overflow="wrap" %}
```bash
secretcli query compute list-contract-by-code <your-code-id> --chain-id pulsar-3 --node https://rpc.testnet.secretsaturn.net 
```
{% endcode %}

Now we will see the address of our deployed contract

```json
[
    {
        "contract_address": "secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg",
        "code_id": 1,
        "creator": "secret16u7w28vp68qmldffuc89am4f02045zlfsjht90",
        "label": "counterContract"
    }
]
```

Congratulations! You just finished compiling and deploying your first contract! Now it's time to see it in action!
