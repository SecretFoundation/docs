# 📝 Automatic Regstration Server

To facilitate setting up new Secret Network nodes (as described in detail in [Setup Full Node](../running-a-node-validator/setting-up-a-node-validator/testnet/run-a-full-node.md)), the Automatic Registration service can be used.

The Service receives a node's attestation and creates the Registration transaction on-chain.

It also uses a buit-in wallet to pay the transaction fees.

The source code of the Autoregster Server is available on Github [here](https://github.com/scrtlabs/registration-service). The Autoregister Server is implemented to be deployed using Azure Functions.

The  service is invoked when calling the following command while setting up the node:

```
secretd auto-register 
```

The URL of the Automatic Registration Server can be explicitly provided using `--registration-service` parameter:&#x20;

```
secretd auto-register  [--registration-service=<Registration Service URL>]
```



