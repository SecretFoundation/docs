# Fee abstraction

{% hint style="info" %}
You can use the Feegrant module or Smart contract based fee abstraction to simplify the usage of your dApp as explained [here!](gas-fee-usage.md)
{% endhint %}

### FeeGrant

Secret also allows for Gas abstraction for users by leveraging the CosmosSDK [FeeGrant module](https://docs.cosmos.network/main/modules/feegrant). This module allows one to submit transactions where a different wallet is paying the gas fees as long as they granted you a budget to do that.

**Documentation** to create Feegrant functionality in your UI are [here](../../frontend/feegrant/).\
\
This tool is widely used in different Secret UIs (for ex: [Secret dashboard](https://dash.scrt.network)) and there is a community run FeeGrant faucet available for dApps to use. - [Faucet](https://faucet.secretsaturn.net/) - [Code](https://github.com/SecretSaturn/feegrant-faucet)

### Smart contract based

You can use Smart-contracts with Fees deposited in them to abstract fee usage and automate tasks for users - An example of this is the [Sienna rewards contract ](https://github.com/SiennaNetwork/SiennaNetwork/tree/main)which deposits users rewards into their wallet daily.\
\
There is also the feature of **"opportunistic execution"** which allows additional privacy to perform automated actions by using leftover gas from the Gas evaporation function in the Secret compute module. - [Here is a great guide on opportunistic execution!](privacy-design/gas-evaporation-and-tracking.md#opportunistic-execution)
