# Compile and Deploy

The Millionaire's problem (or [**Yao's Millionaires' problem**](https://en.wikipedia.org/wiki/Yao's\_Millionaires'\_problem)) is a secure multi-party computation problem introduced in 1982 by computer scientist and computational theorist Andrew Yao. The problem discusses two millionaires, Alice and Bob, who are interested in knowing which of them is richer without revealing their actual wealth.

In this example, we will solve a complex problem with little effort using the power of private smart contracts on Secret Network.

We will assume you completed the previous steps and at this point have a copy of the Millionaire's problem code repository. If you did not complete [setting up your environment](setting-up-your-environment.md), now would be a good time to do so.

### Clone the Repository (manual or Secret IDE only)

{% hint style="success" %}
**Using Gitpod?** The contract code is already bundled in the environment
{% endhint %}

Clone the Millionaire's problem repository

```
git clone https://github.com/scrtlabs/MillionaireProblemTutorial.git
```

### Compile the Code

This repo contains everything we need to solve this problem.

Let's start by compiling the code - this will take our Rust code and build a Web Assembly file that we can deploy to Secret Network and run:

{% tabs %}
{% tab title="Linux/WSL/MacOS" %}
```
make build
```
{% endtab %}

{% tab title="Windows" %}
```
RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown
cp ./target/wasm32-unknown-unknown/release/*.wasm ./contract.wasm
```
{% endtab %}

{% tab title="Secret IDE" %}
Run `make build` from the terminal, or just GUI it up -

![](<../../.gitbook/assets/image (2).png>)
{% endtab %}
{% endtabs %}

This will take a couple of minutes, after which we will end up with a `contract.wasm` file in the current folder

{% hint style="danger" %}
**Something not working?** Make sure all the [requirements ](setting-up-your-environment.md)are installed or try asking in [our discord](https://chat.scrt.network/) for help from the community!
{% endhint %}

Want to know more about the code itself? Check out the [Millionaire's Problem Code Breakdown section](millionaires-problem-breakdown-extra-credit.md)!

### Storing the Contract

Now that we have a working contract, we can upload it to the blockchain and see it in action. This is called **storing the contract code**. We will be using a local test environment, but the same commands will apply no matter which network you want to use - local, public testnet or mainnet.

{% hint style="info" %}
**Did you know?** By default, SecretCLI tries to connect to a locally running network
{% endhint %}

{% tabs %}
{% tab title="Gitpod" %}
```
secretcli tx compute store ./contract.wasm --gas 5000000 --from a -y
```
{% endtab %}

{% tab title="Secret IDE" %}
To interact with the blockchain, we first need to initialize a wallet. Use the included "New Wallet" command from the GUI, or from the terminal run

`secretcli keys add <name>` (replace \<name> with your wallet name)

After adding this key, note the _address_ of the wallet. The address starts with the prefix `secret1...`



Now, we can request funds to the wallet, so it has enough currency to send transactions.&#x20;

Visit [https://faucet.pulsar.scrttestnet.com/](https://faucet.pulsar.scrttestnet.com/) and paste your wallet address to receive testnet tokens

Finally, we can deploy our contract -

```
secretcli tx compute store ./contract.wasm --gas 5000000 --from <name> --chain-id pulsar-2
```
{% endtab %}

{% tab title="Docker LocalSecret" %}
To interact with the blockchain, we first need to initialize a wallet

`secretcli keys add <name>` (replace \<name> with your wallet name)

After adding this key, note the _address_ of the wallet. The address starts with the prefix `secret1...`

Now, we can request funds to the wallet, so it has enough currency to send transactions. For that we use the LocalSecret's built-in faucet

```
curl http://localhost:5000/faucet?address=<wallet_address>
secretcli tx compute store ./contract.wasm --gas 5000000 --from <name> --chain-id secretdev-1
```
{% endtab %}

{% tab title="Public Testnet" %}
To use the public testnet (codenamed pulsar-2), we need to configure SecretCLI to talk to it.

Use the following commands to configure SecretCLI

```
secretcli config node https://rpc.pulsar.scrttestnet.com
secretcli config output json
secretcli config chain-id pulsar-2
secretcli config keyring-backend test
```

To interact with the blockchain, we first need to initialize a wallet

`secretcli keys add <name>` (replace \<name> with your wallet name)

After adding this key, note the _address_ of the wallet. The address starts with the prefix `secret1...`

Now, we can request funds to the wallet, so it has enough currency to send transactions. For that we use the faucet from the public testnet:

{% embed url="https://faucet.pulsar.scrttestnet.com/" %}

Once the tokens have been delivered, we can now **store** the contract code on chain

```
secretcli tx compute store ./contract.wasm --gas 5000000 --from <name>
```
{% endtab %}
{% endtabs %}

{% hint style="info" %}
**--from a** refers to which account (or wallet) is sending the transaction. To see a list of the available wallets, you can use the command `secretcli keys list`

**--gas 5000000** refers to the cost of the transaction we are sending. Gas is the unit of cost which we measure how expensive a transaction is. &#x20;
{% endhint %}

To verify whether storing the code has been successful, we can use SecretCLI to query the chain

```
secretcli query compute list-code
```

Which should give an output similar to the following

```json
[
  {
    "id": 1,
    "creator": "secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03",
    "data_hash": "40989F8A96927A0D320AEC574DC5260846B52BB74EFE5EE9E520238EC35513C6",
  }
]
```

{% hint style="warning" %}
If you're using a public testnet the _"id"_ field will be much greater than 1, because there is a lot of stuff on the public chain!
{% endhint %}

### Initializing the Contract

In the previous step we stored the contract _code_ on the blockchain. To actually use it, we need to initialize a new instance of it.

{% hint style="info" %}
**Pro Tip:** The store-initialize model allows us to store a contract code once and reuse it. For example, a single instance of the code of a [SNIP-20 token](https://docs.scrt.network/secret-network-documentation/development/snips/snip-20-spec-private-fungible-tokens) can be reused to easily create multiple different tokens! &#x20;
{% endhint %}

```
secretcli tx compute instantiate 1 '{}' --from a --label milproblem -y
```

{% hint style="warning" %}
* **--label** is a mandatory field that gives the contract a unique meaningful identifier
* If you are using a public testnet, replace **1** with the id that you saw in the previous section, and replace the **label** with a unique name of your choosing
{% endhint %}

Let's check that the initialize command worked:

```bash
secretcli query compute list-contract-by-code 1
```

Now we will see the address of our deployed contract

```json
[
  {
    "address": "secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg",
    "code_id": 1,
    "creator": "secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03",
    "label": "milproblem"
  }
]
```

Congratulations! You just finished compiling and deploying your first contract! Now it's time to see it in action!
