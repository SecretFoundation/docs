---
description: For emergency functions to access to alter contract functionality.
---

# Admin Keys

In case of emergencies it can be useful to have certain admin functions to alter the functionality of the contract in some way that are only usable by the admin. For example, if your contract receives funds and forwards them to a different address, but you lose the keys to the to that address, you want to ensure their is a function implemented that will enable you to change it. Or possibly there may be some situation where you want to deactivate the contract (aside from the admin function to reactivate it).&#x20;

It's important to consider what possibly go wrong with the contract and what can be done to fix it ahead of time, and implement those fixes. On the flip side, making too many functions alterable by the admin may make your dapp more centralized and users may become more cautious to use it. Balance these two sides carefully during dapp creation.
