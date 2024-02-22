# Using the Testnet

## **Introduction**

A testnet network is an almost identical copy of a blockchain that serves as an alternative specifically made for testing without affecting the operation of the original network (mainnet).

In this step-by-step guide I’ll show you how to connect to a testnet with Keplr and SecretCLI, receive tokens through a faucet, and interact with secret applications.

## **Set Up With Keplr**

The easy way to use a testnet is via the Keplr wallet browser extension, you can install it and set it up by following [this guide](https://keplr.crunch.help/getting-started/installing-keplr-wallet) or [this video](https://www.youtube.com/watch?v=HgFWNJdD7-U\&list=PLxrw7YCKLEXvPNUJ1SFoHQUUQa4\_Uwwdg\&index=3). For safety reasons we recommend using a separate secondary wallet for testing purposes.

Once you have saved your mnemonic phrase you can connect to the pulsar-3 chain.&#x20;

* Go to [https://keplr-connect-pulsar3.vercel.app](https://keplr-connect-pulsar3.vercel.app) and click on the Keplr button
* Click “**approve**” once the Keplr window pops up to add the chain config

![](../../.gitbook/assets/add\_keplr.png)

And again to connect the website, and allow it to view your balances etc

![](../../.gitbook/assets/connect\_keplr.png)

* Now you should be able to see the Secret Testnet network on Keplr wallet by selecting it from the drop down menu. (verify that your Secret mainnet and testnet addresses coincide and start with “secret”)

![](../../.gitbook/assets/keplr\_testnet.png)

You have now successfully added the Secret Testnet to your wallet and you’re ready to get your first tokens and experiment!

## Faucet

The fastest and easiest way to get some test SCRT into your wallet is to use faucets which are tools that distribute a standard amount of tokens to a specific address.

Remember that all tokens on the Secret Testnet have **no real value** as they’re free to mint and they’re impossible to transfer to mainnet.

* Go to [https://faucet.pulsar.scrttestnet.com/](https://faucet.pulsar.scrttestnet.com/)
* Paste your address in the text box, verify the captcha and click on “**Send me tokens**”\
  ![](<../../.gitbook/assets/testnetguide\_3 (1).png>)

In a matter of seconds you should be able to see 100 test SCRT on your Keplr balance.

## **Set Up SecretCLI**

To have access to all the testnet functionalities and to develop you can connect using **SecretCLI**, a desktop client tool to interact with the blockchain from the console.

* Install and configure SecretCLI by following this [tutorial](https://www.youtube.com/watch?v=m64c\_3fui3o\&ab\_channel=SecretNetwork)
*   Open your terminal and run the following commands to connect to pulsar-3 and add your wallet:

    ```
    secretcli config node https://rpc.pulsar.scrttestnet.com
    secretcli config output json
    secretcli config chain-id pulsar-3
    secretcli keys add <a-name> --recover
    ```
* Paste your wallet’s mnemonic phrase when asked to do so

You can always change the parameters to connect to alternative APIs and testnets. You can find the full list of testnets, APIs, faucets and explorers on the [official github repository](../../development/resources-api-contract-addresses/connecting-to-the-network/testnet-pulsar-3.md).

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

| Contract | Address                                       | Testnet Chain |
| -------- | --------------------------------------------- | :-----------: |
| SSCRT    | secret1gvn6eap7xgsf9kydgmvpqwzkru2zj35ar2vncj |    Pulsar-3   |

With Keplr you’ll need to approve a connection request for each protocol that you want to connect to. You can easily manage active website connections under “**Manage Connections**” in the Keplr settings.

_**Note:** If you’re using `secretcli` view a full list of commands for_ [_Secret Contracts here_](../../infrastructure/secret-cli/secret-contracts.md)_._

## Viewing Testnet Transactions

To view testnet transactions and contract interactions on the testnets you can use the \[Ping Dashboard, a light explorer for Cosmos-based Blockchains. https://ping.pub [pulsar-3](https://testnet.ping.pub/secret/).

* [Ping Dashboard - pulsar-3](https://testnet.ping.pub/secret/)
  * Ping Dashboard, light explorer for Cosmos-based Blockchains. https://ping.pub
