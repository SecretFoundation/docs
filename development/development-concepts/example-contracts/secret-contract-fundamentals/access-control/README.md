# Access Control

Since all computations are done privately inside the TEE of the network full nodes and the state of the blockchain is encrypted we would expect that users have no access to their own balance, debt positions, tokens, and other important information.

However, because users sign transactions with their own private key the protocol knows they should have access to their information. Viewing keys and Permits are the tools used to provide only the owner access to the private data of their signed transactions.

This part of the documentation will cover the no-code overview of the workings of Permits and viewing keys.

## Overview

* [Viewing Keys](viewing-keys.md)
* [Permits](permits.md)
