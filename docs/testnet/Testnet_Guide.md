# How to use the Secret Network testnet

### **Background**
A **testnet** network is an almost identical copy of a blockchain that serves as an alternative specifically made for **testing** without affecting the operation of the original network (**mainnet**).

Secret Network has its own testnets which are an essential tool for the development of Dapps and mainnet blockchain upgrades.
The testnet is not just a **test environment**(sandbox) for programmers and builders. It is available for all users and can be used to **learn** how to interact with the Secret Network blockchain **without fear of (financial) consequences**.

In this step-by-step guide I’ll show you how to connect to a testnet with Keplr and SecretCLI, get some tokens through a **faucet** and finally interact with secret applications.

### **Set up with Keplr**

The easy way to use a testnet is via the Keplr wallet browser extension, you can install it and set it up by following [this guide](https://keplr.crunch.help/getting-started/installing-keplr-wallet) or [this video](https://www.youtube.com/watch?v=HgFWNJdD7-U&list=PLxrw7YCKLEXvPNUJ1SFoHQUUQa4_Uwwdg&index=3). For safety reasons we recommend using a separate secondary wallet for testing purposes (read [this article](https://medium.com/@secretnetwork/how-to-avoid-scams-and-stay-safe-in-defi-b7309e123a7b) to learn about the best practices to stay safe in Secret Defi).

Once you have saved your mnemonic phrase you can connect to the **pulsar-2** chain. The pulsar chain is hosted by the griptape team which updates it periodically to make sure it’s in parallel with the current mainnet version.

- go to connect.pulsar.griptapejs.com and click on the "**pulsar-2**" button
- click “**approve**” once the Keplr window pops 
-![image](docs/images/images/testnetguide_1.PNG)
- Now you should be able to see the pulsar-2 network on Keplr wallet by selecting it from the drop down menu. (verify that your Secret mainnet and testnet addresses coincide and start with “secret”)
-![image](docs/images/images/testnetguide_2.PNG)

You have now successfully added the Secret Testnet to your wallet and you’re ready to get your first tokens and experiment!

### **Faucet**

The fastest and easiest way to get some test SCRT into your wallet is to use **faucets** which are tools that distribute a standard amount of tokens to a specific address.

Remember that all tokens on the Secret Testnet have **no real value** as they’re free to mint and they’re impossible to transfer to mainnet.

- Go to faucet.secrettestnet.io
- Paste your address in the text box, verify the captcha and click on “**Send me tokens**” 
-![image](docs/images/images/testnetguide_3.PNG)

In a matter of seconds you should be able to see 100 test SCRT on your Keplr balance, otherwise the faucet may be down and in that case you can let the Griptape team know on the [Secret Network discord](chat.scrt.network) and they should be able to send some your way.

### **Set up with SecretCLI**

To have access to all the testnet functionalities and to develop you can connect using **SecretCLI**, a desktop client tool to interact with the blockchain from the console.

- Install and configure SecretCLI by following [this tutorial](https://docs.scrt.network/)
- Open your terminal and run the following commands to connect to pulsar-2 and add your wallet:
    ```sh secretcli config broadcast-mode sync
    secretcli config node http://rpc.pulsar.griptapejs.com:26657
    secretcli config output json
    secretcli config chain-id pulsar-2
    secretcli keys add <a-name> --recover ```
- Paste your wallet’s mnemonic phrase when asked to do so

You can always change the parameters to connect to alternative APIs and testnets. You can find the full list of testnets, APIs, faucets and explorers on the [official github repository](https://github.com/scrtlabs/testnet).

### **Secret Tokens**
On top of that 100 SCRT, the faucet sends you a basket of Secret Tokens that you can only view by generating a new viewing key.

- Search for a token that you want to view the amount of on [this list](https://docs.griptapejs.com/hackathon/glossary#tokens) 
- Copy the **contract address**
-![image](docs/images/images/testnetguide_7.PNG)
- Open your Keplr extension and click on the hamburger menu on the top left
- Select “**Add Token**” 
- Paste the address and click “**Submit**” and approve the transaction (you can set high fees as it’s paid in test SCRT)
- ![image](docs/images/images/testnetguide_4.PNG)
- You should now be able to see the Secret Token balance on your Keplr extension under the section “**Tokens**”
- ![image](docs/images/images/testnetguide_5.PNG)

### **Interact with Dapps**

Once you have everything set up you can connect to protocols that have a public testnet url available. Here’s a list of the main ones:

- Stashh: [stashhapp-public-testnet.azurewebsites.net](https://stashhapp-public-testnet.azurewebsites.net/)
- Jackal: [alpha.jackaldao.com](https://alpha.jackaldao.com/)
- SecretSwap(HoloDeck): [cashback.testnet.enigma.co/swap#Swap](https://cashback.testnet.enigma.co/swap#Swap)
- Sienna: [testnet.sienna.network](https://testnet.sienna.network/)
- StakeEasy: [testnet.stakeeasy.finance](https://testnet.stakeeasy.finance/)
- SecretGarden(HoloDeck): [testnet.scrtgarden.com](https://testnet.scrtgarden.com/)

Alternatively you can directly interact with their testnet secret contracts. Below are some of the main smart contract addresses available:

- Jackal: secret1epm82uygswvgzy32es2nu4fnjsztfln8mud84k
- Sienna AMM: secret1203futsqmxjjjk6rv8lvxmxlgwyje8jkf7ndxf
- Sienna Lend: secret13jw078vweqgr4v0q9u0l8a44525nlqxju29xkq
- Sienna Rewards: [tokens address list](https://ethereumbridgebackendtestnet.azurewebsites.net/rewards)
- Fardels (HoloDeck): secret1qv6ltj9rl3fxulumafknq0nzyncklmyny8857l
- StakeEasy: secret1qrhv2lwjaawevskdz5v5mn4t4d65c2ndtltf8p
- Time Capsule: secret1hznvj7amwq5dqnl0snyhzpyrwufdcjll6my6ca

With Keplr you’ll need to approve a connection request for each protocol that you want to connect to. 
You can easily manage active website connections under “**Manage Connections**” in the Keplr settings. 
![image](docs/images/images/testnetguide_5.PNG)

If you’re using the SecretCLI client you can look at the [documentation](https://docs.scrt.network/cli/secretcli.html#secret-contracts) to see the full list of line commands that you can perform.

To view testnet transactions and contract interactions on the testnets you can use the secret nodes **block explorer** at https://secretnodes.com/chains.

**Happy Testing**!