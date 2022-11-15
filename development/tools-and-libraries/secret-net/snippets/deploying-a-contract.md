# Deploying a Contract

```csharp
using SecretNET;
using SecretNET.Common;
using SecretNET.Common.Storage;
using SecretNET.Tx;

// Select a storage provider for the wallet
// Docs: https://github.com/0xxCodemonkey/SecretNET#creating--initializing-the-wallet
var storageProvider = new AesEncryptedFileStorage("", "SuperSecurePassword");
var createWalletOptions = new CreateWalletOptions(storageProvider);

// Import wallet from mnemonic phrase
// Use key created snippet "Create a new Wallet"
Wallet wallet = null;
if (await storageProvider.HasPrivateKey())
{
    var storedMnemonic = await storageProvider.GetFirstMnemonic();
    Console.WriteLine("Use stored mnemonic: " + storedMnemonic);
    wallet = await Wallet.Create(storedMnemonic, options: createWalletOptions);
    Console.WriteLine("wallet.Address: " + wallet.Address);
}

// get infos from https://docs.scrt.network/secret-network-documentation/development/connecting-to-the-network
var gprcUrl = "https://grpc.testnet.secretsaturn.net";
var chainId = "pulsar-2";

// Create a connection to Secret Network node
// Pass in a wallet that can sign transactions
// Docs: https://github.com/0xxCodemonkey/SecretNET#creating--initializing-the-wallet
var secretClient = new SecretNetworkClient(gprcUrl, chainId, wallet: wallet);

// Upload the wasm of a simple contract
byte[] wasmByteCode = File.ReadAllBytes(@"mysimplecounter.wasm.gz");

// MsgStoreCode
var msgStoreCodeCounter = new MsgStoreCode(
      wasmByteCode,
      source: "", // Source is a valid absolute HTTPS URI to the contract's source code, optional
      builder: ""  // Builder is a valid docker image name with tag, optional
      );

var storeCodeResponse = await secretClient.Tx.Compute.StoreCode(msgStoreCodeCounter, new TxOptions() { GasLimit = 2_000_000 });

var codeId = storeCodeResponse.Response.CodeId;

// contract hash, useful for contract composition
var contractCodeHash = await secretClient.Query.Compute.GetCodeHashByCodeId(codeId);

// Create an instance of the Counter contract, providing a starting count
var msgInitContract = new MsgInstantiateContract(
                        codeId: codeId,
                        label: $"My Counter {codeId}",
                        initMsg: new { count = 100 },
                        codeHash: contractCodeHash); // optional but way faster


var initContractResponse = await secretClient.Tx.Compute.InstantiateContract(msgInitContract, new TxOptions() { GasLimit = 200_000 });


//Find the contract_address in the logs
var contractAddress = initContractResponse?.Response?.Address;

var msgExecuteContract = new MsgExecuteContract(
                            contractAddress: contractAddress,
                            msg: new { increment = new { } },
                            codeHash: contractCodeHash);

var tx = await secretClient.Tx.Compute.ExecuteContract(msgExecuteContract, new TxOptions() { GasLimit = 200_000 });
```
