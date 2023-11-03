# Account abstraction

### Unstoppable/threshold Wallet(less)

Secret contracts are an awesome tool for native account abstraction. This all comes down to the fact that Secret-contracts can store (parts of) private keys in their state without revealing them to other network participants or observers.\
\
This concept was first thought out by scrt labs in a proof of concept multiple years ago \[Code], then uttilised by Alter for easy log-in ([as explained here](../privacy-as-a-service-paas.md#2.-authentication-via-secret-contracts-ex.-web-auth-login-threshold-wallets)), but the newest version uses novel additive HE and MPC to create a form of Unstoppable Threshold wallets [\[Code\]](https://github.com/scrtlabs/unstoppable-secrets). This proof of concept is now taken by [obi.money](https://obi.money) and [primevault](https://www.primevault.com/) to develop walletless experiences and secure threshold wallets for the next million users.

**Want to learn more about Unstoppable wallets?** - Watch [this talk](https://www.youtube.com/watch?v=vFhjn6TcVJc) from the SCRT labs CEO and Secret Network founder Guy Zyskind at Gateway to Cosmos Prague 2023.

### Cosmos Native AuthZ/ICA&#x20;

One can also use the native AuthZ module supported on Secret to have other accounts perform any specified action for any specified amount of time and limit.\
\
A usecase for this is more secure voting and autocompounding interfaces like Restake.app.&#x20;

Smart contracts can also use ICA/ICS-999 (although host module is not supported yet) to control accounts on other chains over IBC and manage funds in interesting ways. Feel free to check out the codebases/Apps of [Quasa](https://github.com/quasar-finance/interchain-accounts-demo)r and calc.finance to get an idea of what that can look like.\


### Smart contract based

One can also leverage cosmos wide forms of account abstraction like [this one](https://github.com/larry0x/abstract-account) implemented by Larry from delphi.\
