# Create a new Wallet

```csharp
using SecretNET;
using SecretNET.Common;
using SecretNET.Common.Storage;
using System;

// Select a storage provider for the wallet
// Docs: https://github.com/0xxCodemonkey/SecretNET#creating--initializing-the-wallet
var storageProvider = new AesEncryptedFileStorage("", "SuperSecurePassword");
var createWalletOptions = new CreateWalletOptions(storageProvider);

// Create a new account
var wallet = await Wallet.Create(options: createWalletOptions);

// get infos from https://docs.scrt.network/secret-network-documentation/development/connecting-to-the-network
var gprcUrl = "https://grpc.testnet.secretsaturn.net"; 
var chainId = "pulsar-2";

// Create a readonly connection to Secret Network node (does not attach the wallet)
var secretClient = new SecretNetworkClient(gprcUrl, chainId, wallet: null); // without a wallet

var response = await secretClient.Query.Bank.Balance(wallet.Address);

Console.WriteLine("Mnemonic: " + (await storageProvider.GetMnemonic(wallet.Address)));
Console.WriteLine("Address: " + wallet.Address);
Console.WriteLine($"Balance: {(float.Parse(response.Amount) / 1000000f)} SCRT"); // 1,000,00 uscrt = 1 SCRT
```
