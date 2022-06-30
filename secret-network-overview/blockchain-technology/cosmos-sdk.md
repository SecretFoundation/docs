# Cosmos SDK

The main difference when it comes to Cosmos compared to virtual-machine blockchain, is the application-specific blockchain concept. Developers can build from scratch their application specific blockchain on top of Tendermint through ABCI protocol. Cosmos SDK is the framework offering a bank of independent modules for implementing the application state machine, ABCI, service routers to route messages between modules, and a flavor of features like governance, staking, slashing, etc …&#x20;

### Cosmos Virtual Machine

Below a figure showing the architecture differences between a VM blockchain and Cosmos:

![](https://lh3.googleusercontent.com/3ILJ5pOIu\_vyDakYvZo-wLKjrzOpjVeBpa3DW-\_34jV\_TexMemVOI9pAIlzqO1DXD\_qIgfpm2Ok3l3xTSrIK4CCXn0y2cwq9YY1wrHqA4wJ3k2nc3gZjpnB0A1HK8SHgPmDYX4t0EEGOL8jExQ)![](https://lh5.googleusercontent.com/RMGVNI5V9XowAzBHvVYo2LTMXs1erz5cpZrlKEZS7dm7MIJQlTMbhviLJPz\_nN0ihX-aUgyO0jFroEQm\_sXp4ujrpWNw13EEcfr6q7mLPGz2BFu9hdmA06mJpWGdKzqQz5Bb2T4tK6grXMSz6A)

A virtual-machine interprets Smart Contracts to change the state of the underlying blockchain state machine. It’s developer friendly and easy to use to deploy applications but comes with certain limitations:

* Specific programming language accepted by the VM
* VM limited set of functions and lack of flexibility
* Smart Contracts are all run by the same virtual machine restraining performance as all application compete for block resources
* Limited sovereignty, meaning that the application is dependent of the underlying blockchain governance decision

### Development framework

In Cosmos, developers have all the keys to develop a sovereign, secure, flexible and tailor made application specific blockchain.&#x20;

Cosmos SDK allows developers to tweak, if needed, the framework or the consensus engine or any modules to match their application/network requirements.&#x20;

As the application is not competing with others for blockspace or is limited by the VM computation, the performance is enhanced and only limited by the state-machine itself.

In terms of security, developers are not constrained by the VM cryptographic functions or any VM exploitable mechanisms and can rely on their own cryptography or audited librairies.

### Conclusion

In conclusion Cosmos SDK is giving an easy and fast way to bootstrap an application specific blockchain relying on an efficient and proven technology without tradeoffs on security and sovereignty and with access to an extensive modules library.

> 💡 For more information about the Cosmos SDK: [High-level Overview | Cosmos SDK](https://docs.cosmos.network/master/intro/overview.html) & [Main Components of the Cosmos SDK](https://docs.cosmos.network/main/intro/sdk-design.html)
