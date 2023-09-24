# Using the Testnet

## **Introduction**

A **testnet** network is an almost identical copy of a blockchain that serves as an alternative specifically made for **testing** without affecting the operation of the original network (**mainnet**).

Secret Network has its own testnets which are an essential tool for the development of Dapps and mainnet blockchain upgrades. The testnet is not just a **test environment**(sandbox) for programmers and builders. It is available for all users and can be used to **learn** how to interact with the Secret Network blockchain **without fear of (financial) consequences**.

In this step-by-step guide I’ll show you how to connect to a testnet with Keplr and SecretCLI, get some tokens through a **faucet** and finally interact with secret applications.

## **Set Up With Keplr**

The easy way to use a testnet is via the Keplr wallet browser extension, you can install it and set it up by following [this guide](https://keplr.crunch.help/getting-started/installing-keplr-wallet) or [this video](https://www.youtube.com/watch?v=HgFWNJdD7-U\&list=PLxrw7YCKLEXvPNUJ1SFoHQUUQa4\_Uwwdg\&index=3). For safety reasons we recommend using a separate secondary wallet for testing purposes (read [this article](https://medium.com/@secretnetwork/how-to-avoid-scams-and-stay-safe-in-defi-b7309e123a7b) to learn about the best practices to stay safe in Secret Defi).

Once you have saved your mnemonic phrase you can connect to the **pulsar-3** chain. The pulsar chain is hosted by the Secret Network testnet team which updates it periodically to make sure it’s in parallel with the current mainnet version.

* Go to [https://keplr-connect-pulsar3.vercel.app](https://keplr-connect-pulsar3.vercel.app) and click on the Keplr button
* Click “**approve**” once the Keplr window pops up to add the chain config

![](../../.gitbook/assets/add\_keplr.png)

And again to connect the website, and allow it to view your balances etc

![](../../.gitbook/assets/connect\_keplr.png)

* Now you should be able to see the Secret Testnet network on Keplr wallet by selecting it from the drop down menu. (verify that your Secret mainnet and testnet addresses coincide and start with “secret”)

![](../../.gitbook/assets/keplr\_testnet.png)

You have now successfully added the Secret Testnet to your wallet and you’re ready to get your first tokens and experiment!

## Faucet

The fastest and easiest way to get some test SCRT into your wallet is to use **faucets** which are tools that distribute a standard amount of tokens to a specific address.

Remember that all tokens on the Secret Testnet have **no real value** as they’re free to mint and they’re impossible to transfer to mainnet.

* Go to [https://faucet.pulsar.scrttestnet.com/](https://faucet.pulsar.scrttestnet.com/)
* Paste your address in the text box, verify the captcha and click on “**Send me tokens**”\
  ![](<../../.gitbook/assets/testnetguide\_3 (1).png>)

In a matter of seconds you should be able to see 100 test SCRT on your Keplr balance, otherwise the faucet may be down and in that case you can use the [backup faucet](http://bootstrap.pulsar3.scrtlabs.com:5000/address=secret1), or let the #secret-testnet channel know on the Secret Network discord, and they should be able to send some your way.

## **Set Up SecretCLI**

To have access to all the testnet functionalities and to develop you can connect using **SecretCLI**, a desktop client tool to interact with the blockchain from the console.

* Install and configure SecretCLI by following [this tutorial](https://docs.scrt.network/)
*   Open your terminal and run the following commands to connect to pulsar-3 and add your wallet:

    ```
    secretcli config node https://rpc.pulsar.scrttestnet.com
    secretcli config output json
    secretcli config chain-id pulsar-3
    secretcli keys add <a-name> --recover
    ```
* Paste your wallet’s mnemonic phrase when asked to do so

You can always change the parameters to connect to alternative APIs and testnets. You can find the full list of testnets, APIs, faucets and explorers on the [official github repository](../../development/resources-api-contract-addresses/connecting-to-the-network/testnet-pulsar-3.md).

## **Secret Tokens**

On top of that 100 SCRT, the faucet sends you a basket of Secret Tokens that you can only view by generating a new viewing key.

* Search for a token that you want to view the amount of on [this list](https://docs.griptapejs.com/hackathon/glossary#tokens)
* Copy the **contract address**
* Open your Keplr extension and click on the hamburger menu on the top left
* Select “**Add Token**”
* Paste the address and click “**Submit**” and approve the transaction (you can set high fees as it’s paid in test SCRT)\
  ![](<../../.gitbook/assets/testnetguide\_4 (1).png>)
* You should now be able to see the Secret Token balance on your Keplr extension under the section “**Tokens**”\
  ![](<../../.gitbook/assets/testnetguide\_5 (1).png>)

## **Interact With Dapps**

Once you have everything set up you can connect to protocols that have a public testnet URL available.

Here’s a table of the main ones:

| Dapp             | Website                                                                                                                                                                | Feedback form                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Sienna           | [https://testnet.sienna.network/](https://testnet.sienna.network/)                                                                                                     | Na                                                                         |
| Actilist.io      | [https://test.actilist.io/](https://test.actilist.io/)                                                                                                                 | Na                                                                         |
| Prifi labs       | [https://locker.prifilabs.com/](https://locker.prifilabs.com/)                                                                                                         | [https://forms.gle/uHxL8TD8ih17SJHK7](https://forms.gle/uHxL8TD8ih17SJHK7) |
| Secret Dashboard | [https://dash.scrt.network/](https://dash.scrt.network/)                                                                                                               | [GitHub Issues](https://github.com/scrtlabs/dash.scrt.network/issues/new)  |
| Shade Swap       | h[ttps://blog.shadeprotocol.io/shadeswap-incentivized-testnet/](https://blog.shadeprotocol.io/shadeswap-incentivized-testnet/)                                         |                                                                            |
| abakhus          | [https://abakhus.notion.site/abakhus/Alpha-2-test-192739e211da4c27aa502b526f3b492c](https://abakhus.notion.site/abakhus/Alpha-2-test-192739e211da4c27aa502b526f3b492c) |                                                                            |
| Bidshop          | [https://testnet.bidshop.io/](https://testnet.bidshop.io/)                                                                                                             |                                                                            |

Alternatively you can directly interact with their testnet secret contracts. Below are some of the main smart contract addresses available:

| Contract       | Address                                                                                    | Testnet Chain |
| -------------- | ------------------------------------------------------------------------------------------ | :-----------: |
| Sienna AMM     | secret1203futsqmxjjjk6rv8lvxmxlgwyje8jkf7ndxf                                              |    Pulsar-2   |
| Sienna Lend    | secret13jw078vweqgr4v0q9u0l8a44525nlqxju29xkq                                              |    Pulsar-2   |
| Sienna Rewards | [Rewards Address List](https://ethereumbridgebackendtestnet.azurewebsites.net/rewards)     |    Pulsar-2   |
| StakeEasy      | secret1qrhv2lwjaawevskdz5v5mn4t4d65c2ndtltf8p                                              |    Pulsar-2   |
| Time Capsule   | secret1hznvj7amwq5dqnl0snyhzpyrwufdcjll6my6casecret1hznvj7amwq5dqnl0snyhzpyrwufdcjll6my6ca |    Pulsar-2   |

With Keplr you’ll need to approve a connection request for each protocol that you want to connect to. You can easily manage active website connections under “**Manage Connections**” in the Keplr settings.

_**Note:** If you’re using `secretcli` view a full list of commands for_ [_Secret Contracts here_](../../development/tools-and-libraries/secret-cli/secret-contracts.md)_._

## Viewing Testnet Transactions

To view testnet transactions and contract interactions on the testnets you can use the \[Ping Dashboard, a light explorer for Cosmos-based Blockchains. https://ping.pub [pulsar-3](https://testnet.ping.pub/secret/).

* [Ping Dashboard - pulsar-3](https://testnet.ping.pub/secret/)
  * Ping Dashboard, light explorer for Cosmos-based Blockchains. https://ping.pub
