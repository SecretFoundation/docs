# Intro to Secret Contracts

[https://github.com/SecretFoundation/docs/blob/main/docs/dev/quickstart.md](https://github.com/SecretFoundation/docs/blob/main/docs/dev/quickstart.md)

## Secret Contracts Introduction

Get up and running on Secret Network with a local docker environment, as well as testnet (Pulsar-2), to start working with Secret Contracts.

To learn more, please visit Secret Contracts.

<details>

<summary>Topics covered on this page</summary>

* Secret Contracts Quickstart
  * Setup the Local Developer Testnet
  * Setup Secret Contracts
  * Create initial smart contract
    * Generate the smart contract project
    * Compile
    * Unit tests
      * Run unit tests
      * Integration tests
      * Generate msg schemas
    * Deploy smart contract to our local testnet
      * Optimize compiled wasm
      * Store the smart contract
      * Querying the smart contract and code
    * Instantiate the smart contract
    * Deploy to the pulsar testnet
      * Install and configure the Secret Network Light Client
      * Get some SCRT from the faucet
      * Store the Secret Contract on Pulsar
      * Instantiate your Secret Contract
  * Secret Contracts 101
    * Project structure
    * Secret Contract code explanation
    * Unit tests
  * Secret toolkit
    * Calling other contracts
  * Secret Contracts - advanced
    * Tutorials from Secret Network community
    * CosmWasm resources

</details>

### Setup the Local Developer Testnet

The developer blockchain is configured to run inside a docker container. Install [Docker](https://docs.docker.com/install/) for your environment (Mac, Windows, Linux).

**NOTE**:The Docker container will not work if you are using an M1 chip.

Open a terminal window and change to your project directory. Then start SecretNetwork, labelled _localsecret_ from here on:

```bash
docker run -it --rm \
 -p 26657:26657 -p 26656:26656 -p 1337:1337 \
 --name localsecret ghcr.io/scrtlabs/localsecret
```

**NOTE**: The _localsecret_ docker container can be stopped by CTRL+C

If the following error occurs "Got permission denied while trying to connect to the Docker daemon", prefix the docker command to start the SecretNetwork Docker container with `sudo` privileges:

```bash
sudo docker run -it --rm \
 -p 26657:26657 -p 26656:26656 -p 1337:1337 \
 --name localsecret ghcr.io/scrtlabs/localsecret
```

**NOTE**: `sudo docker run` privileges will only need to be given once to run the SecretNetwork docker container normally i.e without `sudo` privileges.

At this point you're running a local SecretNetwork full-node. Let's connect to the container so we can view and manage the secret keys:

**NOTE**: In a new terminal

```bash
docker exec -it localsecret /bin/bash
```

The local blockchain has a couple of keys setup for you (similar to accounts if you're familiar with Truffle Ganache). The keys are stored in the `test` keyring backend, which makes it easier for local development and testing.

```bash
secretd keys list --keyring-backend test
```

`exit` when you are done

### Setup Secret Contracts

In order to setup Secret Contracts on your development environment, you will need to:

* Install Rust (you don't need to be a Rust expert to build Secret Contracts and you can check out the Rust book, rustlings course, examples to learn more at https://www.rust-lang.org/learn)
* Install the Rust dependencies
* Create your first project

The Rust dependencies include the Rust compiler, cargo (_package manager_), toolchain and a package to generate projects (you can check out the Rust book, rustlings course, examples and more at https://www.rust-lang.org/learn).

1. Install Rust

More information about installing Rust can be found here: https://www.rust-lang.org/tools/install.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

1. Add rustup target wasm32 for both stable and nightly

```bash
rustup default stable
rustup target list --installed
rustup target add wasm32-unknown-unknown

rustup install nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```

1. If using linux, install the standard build tools:

```bash
apt install build-essential
```

1. Run cargo install cargo-generate

Cargo generate is the tool you'll use to create a smart contract project (https://doc.rust-lang.org/cargo).

```bash
cargo install cargo-generate --features vendored-openssl
```

### Create initial smart contract

To create the smart contract you'll:

* Generate the initial project
* Compile the smart contract
* Run unit tests
* Optimize the wasm contract bytecode to prepare for deployment
* Deploy the smart contract to your local Secret Network
* Instantiate it with contract parameters

#### Generate the smart contract project

```bash
cargo generate --git https://github.com/scrtlabs/secret-template --name mysimplecounter
```

The git project above is a cosmwasm smart contract template implementing a simple counter. The contract is created with a parameter for the initial count and allows subsequent incrementing.

Change directory to the project you created and view the structure and files that were created.

```bash
cd mysimplecounter
```

The generate creates a directory with the project name and has this structure:

```
Cargo.lock	Developing.md	LICENSE		Publishing.md	examples	schema		tests
Cargo.toml	Importing.md	NOTICE		README.md	rustfmt.toml	src
```

#### Compile

In order to run unit tests, integration tests, and deploy Secret Contracts the contracts need to be compiled first into wasm contracts.

Use the following command to compile the smart contract which produces the wasm contract file:

```bash
make build
```

#### Unit tests

**Run unit tests**

After creating unit tests for each testable operation within a Secret Contract are written, they are run using:

```bash
make unit-test
```

**Integration tests**

Integration testing for Secret Contracts is needed for testing all combined contract modules as a group after unit testing is complete. The integration tests are under the `tests/` directory and run as:

```bash
npx ts-node integration.ts
```

You can also choose to debug your code by using the following steps (Using vscode):

1. Press `ctrl+shift+p`
2. Write `JavaScript Debug Terminal` and press `Enter`
3. In the new terminal you can run `npx ts-node integration.ts`
4. Your code will be running in debug mode and will stop on every breakpoint placed.

**Generate msg schemas**

We can also generate JSON Schemas that serve as a guide for anyone trying to use the contract, to specify which arguments they need.

Auto-generate msg schemas (when changed):

```bash
cargo schema
```

#### Deploy smart contract to our local testnet

Before deploying or storing the contract on a testnet, you need to run the [Secret Contract optimizer](https://hub.docker.com/r/enigmampc/secret-contract-optimizer). The Secret Contract optimizer produces an optimized 'contract.wasm.gz' file that's ready to be stored on the Secret Network.

**Optimize compiled wasm**

```bash
docker run --rm -v "$(pwd)":/contract \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  enigmampc/secret-contract-optimizer
```

The contract wasm needs to be optimized to get a smaller footprint. Cosmwasm notes state the contract would be too large for the blockchain unless optimized. This example contract.wasm is 1.8M before optimizing, and 90K after.

This creates a zip of two files:

* contract.wasm
* hash.txt

**Store the smart contract**

Now that the Secret contract is optimized and ready to deploy to the Secret Netowrk. We need to start up our local development network mounted with our projects contract:

```bash
# When starting up our local development container we need to mount our project's code inside the container
docker run -it --rm \
 -p 26657:26657 -p 26656:26656 -p 1337:1337 \
 -v $(pwd):/root/code \
 --name localsecret ghcr.io/scrtlabs/localsecret
```

Upload the optimized contract.wasm.gz:

```bash
# First enter into the docker container
docker exec -it localsecret /bin/bash

# Move into the 'code' folder containing the optimized contract.wasm.gz file
cd code

# Upload the contract.wasm.gz file to the network
secretd tx compute store contract.wasm.gz --from a --gas 1000000 -y --keyring-backend test
```

After uploading the optimized contract code with the final command, there should be an output containing the txhash associated with the successful upload of the Secret Contract to the network.

**Querying the smart contract and code**

List the current smart contract code inside of the Docker container using:

```bash
secretd query compute list-code

# You will see the output found below after running 'secretd query compute list-code', but with your own "creator" and "data_hash" values.

[
  {
    "id": 1,
    "creator": "secret1zy80x04d4jh4nvcqmamgjqe7whus5tcw406sna",
    "data_hash": "D98F0CA3E8568B6B59772257E07CAC2ED31DD89466BFFAA35B09564B39484D92",
  }
]
```

#### Instantiate the smart contract

At this point the contract's uploaded and stored on the testnet, but there's no "instance".

This is like `discovery migrate` during the Cosmos deploy-execute process which handles both the deploying and creation of the contract instance. This process consists of 3 steps rather than 2 for Ethereum smart contracts. You can read more about the logic behind this decision, and other comparisons to Solidity, in the [cosmwasm documentation](https://www.cosmwasm.com/docs/getting-started/smart-contracts).

The 3 steps for deploying Secret Contract are:

1. Upload Code - Upload optimized wasm code, no state nor contract address (example Standard ERC20 contract)
2. Instantiate Contract - Instantiate a code reference with some initial state, creates new address (example set token name, max issuance, etc for my ERC20 token)
3. Execute Contract - This may support many different calls, but they are all unprivileged usage of a previously instantiated contract; depends on the contract design (example: send ERC20 token, grant approval to other contract)

To create an instance for our project you must also create a starting count by providing JSON input data. Execute the following code in the same location using to upload the contract.wasm.gz file to the network insid of the docker container (/root/code):

```bash
INIT='{"count": 100000000}'
CODE_ID=1
secretd tx compute instantiate $CODE_ID "$INIT" --from a --label "my counter" -y --keyring-backend test
```

After instantiating the contract, it will produce an output that includes the txhash of the instantiation.

With the contract now initialized, we can find its address with:

```bash
secretd query compute list-contract-by-code 1
```

Our instance is secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg, and the code id is 1.

We can query the contract state with:

```bash
CONTRACT=secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg

secretd query compute query $CONTRACT '{"get_count": {}}'
```

This will produce an output with the count data, which will be {"count": 100000000}.

We can increment our counter by interacting directly with our Secret Contract by:

```bash
secretd tx compute execute $CONTRACT '{"increment": {}}' --from a --keyring-backend test
```

After executing this code, you will see some information outputs about the request to increment the counter contract and will be asked to 'confirm transaction before signing and broadcasting \[y/N]:'. Type 'y' and hit enter, and you will get the txhash of the increment counter interaction.

Now query the contract state again to see the incremented count value of the deployed 'my counter' contract:

```bash
secretd query compute query $CONTRACT '{"get_count": {}}'
```

You should see an output with the count incremented by 1 --> {"count":100000001}.

The increment value of our contract is always going to be equal to 1.

Try increasing the increment value to increase by 5 (or your number of choice) each time increment is executed by the contract. This will require you to edit the contract.rs 'try\_increment' function, and go through the 3 steps required to deploy a Secret Contract to the local development again.

#### Deploy to the pulsar testnet

Pulsar-2 is the testnet you will use to deploy your contract, follow these steps:

1. [Install and configure the Secret Network Light Client](https://github.com/scrtlabs/SecretNetwork/releases/tag/v1.2.5)
2. [Get some SCRT from the faucet](https://faucet.secrettestnet.io/)
3. Store the Secret Contract on Pulsar-2
4. Instantiate your Secret Contract

**Install and configure the Secret Network Light Client**

If you don't have the latest `secretcli`, using these [steps](https://github.com/SecretFoundation/docs/blob/main/docs/cli/install-cli.md) to download the CLI and add its location to your PATH.

_**NOTE**_: At this time the Secret Network Light Client is not availible for Macs.

Before deploying your contract make sure it's configured to point to an existing RPC node. You can also use the testnet bootstrap node. Set the `chain-id` to `pulsar-2`. Below we've also got a config setting to point to the `test` keyring backend which allows you to interact with the testnet and your contract without providing an account password each time.

```bash
secretcli config node https://rpc.pulsar.griptapejs.com:443

secretcli config chain-id pulsar-2

secretcli config keyring-backend test
```

_NOTE_: To reset your `keyring-backend`, use `secretcli config keyring-backend os`.

**Get some SCRT from the faucet**

Create a key for the Pulsar-2 testnet that you'll use to get SCRT from the faucet, store and instantiate the contract, and other testnet transactions.

```bash
secretcli keys add <your account alias>
```

This will output your address, a 45 character-string starting with `secret1...`. Copy/paste it to get some testnet SCRT from [the faucet](https://faucet.secrettestnet.io/).

To get your Secret address use:

```bash
secretcli keys show -a <key-alias>
```

Continue when you have confirmed your account has some SCRT in it. To confirm the correct Secret address is funded use the following code:

```bash
secretcli query bank balances <your account address>
```

Note: The Secret faucet should fund your testnet account with \~100000000 uscrt. If you query for your account balance before the network has sent and synced the funds sent to your Secret address you will see "balances":\[] — please wait for faucet tx to complete.

**Store the Secret Contract on Pulsar**

Next, upload the compiled, optimized contract to the testnet.

```bash
secretcli tx compute store contract.wasm.gz --from <key-alias> --gas 10000000 --gas-prices=1.0uscrt
```

You will be prompted to sign the transaction for uploading the optomized contract. The result is a transaction hash (txhash). Query it to see the `code_id` in the logs; which you'll use to create an instance of the contract.

```bash
secretcli query tx <txhash>
```

**Instantiate your Secret Contract**

To create an instance of your contract on Pulsar-2 set the `CODE_ID` value below to the `code_id` you got by querying the txhash. You will find the `code_id` in the logs section under events/attributes in your query.

```bash
INIT='{"count": 100000000}'
CODE_ID=<code_id>
secretcli tx compute instantiate $CODE_ID "$INIT" --from <your account alias> --label "my simple counter <unique identifier>" -y
```

_**NOTE**_: A unique label for the contract will need to be made for the contract to be instantiated. If the label is not unique you will get the following error: "Error: label already exists. You must choose a unique label for your contract instance".

You can use the testnet explorer [Transactions](https://secretnodes.com/secret/chains/pulsar-2) tab to view the transaction details of the contract instantiation by copy and pasting the tx for the contract instantiation into the exlorer.

### Secret Contracts 101

#### Project structure

The source directory (`src/`) has these files:

```
contract.rs  lib.rs  msg.rs  state.rs
```

The developer modifies `contract.rs` for contract logic, contract entry points are `init`, `handle` and `query` functions.

`init` in contract.rs initializes the storage, specifically the current count and the signer/owner of the instance being initialized.

We also define `handle`, a generic handler for all functions writing to storage, the counter can be incremented and reset. These functions are provided the storage and the environment, the latter's used by the `reset` function to compare the signer with the contract owner.

Finally we have `query` for all functions reading state, we only have `query_count`, returning the counter state.

The rest of the contract file is unit tests so you can confidently change the contract logic.

The `state.rs` file defines the State struct, used for storing the contract data, the only information persisted between multiple contract calls.

The `msg.rs` file is where the InitMsg parameters are specified (like a constructor), the types of Query (GetCount) and Handle\[r] (Increment) messages, and any custom structs for each query response.

```rust
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InitMsg {
    pub count: i32,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "lowercase")]
pub enum HandleMsg {
    Increment {},
    Reset { count: i32 },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "lowercase")]
pub enum QueryMsg {
    // GetCount returns the current count as a json-encoded number
    GetCount {},
}

// We define a custom struct for each query response
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct CountResponse {
    pub count: i32,
}
```

#### Secret Contract code explanation

Use [this link](https://github.com/scrtlabs/SecretSimpleVote/blob/master/src/contract.rs) to a see a sample voting contract, and a line by line description of everything you need to know.

#### Unit tests

Unit tests are coded in the `contract.rs` file itself:

```rust
#[cfg(test)]
mod tests {
    use super::*;
    use cosmwasm::errors::Error;
    use cosmwasm::mock::{dependencies, mock_env};
    use cosmwasm::serde::from_slice;
    use cosmwasm::types::coin;

    #[test]
    fn proper_initialization() {
        let mut deps = dependencies(20);

        let msg = InitMsg { count: 17 };
        let env = mock_env(&deps.api, "creator", &coin("1000", "earth"), &[]);

        // we can just call .unwrap() to assert this was a success
        let res = init(&mut deps, env, msg).unwrap();
        assert_eq!(0, res.messages.len());

        // it worked, let's query the state
        let res = query(&deps, QueryMsg::GetCount {}).unwrap();
        let value: CountResponse = from_slice(&res).unwrap();
        assert_eq!(17, value.count);
    }
```

### Secret toolkit

[Secret Toolkit](https://github.com/scrtlabs/secret-toolkit) is a collection of Rust packages containing common tools used in development of Secret Contracts running on the Secret Network.

**Calling other contracts**

[Secret Toolkit](https://github.com/scrtlabs/secret-toolkit) contains helpful tools for calling other contracts from your own. [Here](https://github.com/baedrik/SCRT-sealed-bid-auction/blob/master/CALLING\_OTHER\_CONTRACTS.md) is a guide on how to call other contracts from your own using the `InitCallback`, `HandleCallback`, and `Query` traits defined in the [utils package](https://github.com/scrtlabs/secret-toolkit/tree/master/packages/utils).

If you are specifically wanting to call Handle functions or Queries of [SNIP-20 token contracts](https://github.com/scrtlabs/snip20-reference-impl), there are individually named functions you can use to make it even simpler than using the generic traits. These are located in the [SNIP-20 package](https://github.com/scrtlabs/secret-toolkit/tree/master/packages/snip20).

### Secret Contracts - advanced

Use [this link](https://github.com/baedrik/SCRT-sealed-bid-auction) for a sealed-bid (secret) auction contract making use of [SNIP-20](https://github.com/scrtlabs/snip20-reference-impl) and a walkthrough of the contract.

#### Tutorials from Secret Network community

Visit [this link](https://learn.figment.io/network-documentation/secret) for all tutorials about Secret Network.

#### CosmWasm resources

Smart Contracts in the Secret Network based based on CosmWasm. Therefore, for troubleshooting and additional context, CosmWasm documentation may be very useful. Here are some of the links we relied on in putting together this guide:

* [cosmwasm repo](https://github.com/CosmWasm/cosmwasm)
* [cosmwasm docs](https://docs.cosmwasm.com/)
