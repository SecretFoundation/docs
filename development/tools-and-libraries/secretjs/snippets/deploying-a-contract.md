# Deploying a Contract



```typescript
const { Wallet, SecretNetworkClient } = require("secretjs");

const fs = require("fs");

// Load environment variables
require("dotenv").config();

const main = async () => {
  // Import wallet from mnemonic phrase
  // Use key created in tutorial #2
  const wallet = new Wallet(process.env.MNEMONIC);

  // Create a connection to Secret Network node
  // Pass in a wallet that can sign transactions
  // Docs: https://github.com/scrtlabs/secret.js#secretnetworkclient
  const secretjs = await SecretNetworkClient.create({
    grpcWebUrl: process.env.SECRET_GRPC_WEB_URL,
    wallet: wallet,
    walletAddress: wallet.address,
    chainId: process.env.SECRET_CHAIN_ID,
  });

  // Upload the wasm of a simple contract
  const wasm = fs.readFileSync("5_contracts/contract.wasm");

  let tx = await secretjs.tx.compute.storeCode(
    {
      sender: wallet.address,
      wasmByteCode: wasm,
      source: "",
      builder: "",
    },
    {
      gasLimit: 1_000_000,
    }
  );

  const codeId = Number(
    tx.arrayLog.find((log) => log.type === "message" && log.key === "code_id")
      .value
  );

  // contract hash, useful for contract composition
  const contractCodeHash = await secretjs.query.compute.codeHash(codeId);

  // Create an instance of the Counter contract, providing a starting count
  const initMsg = { count: 101 };
  tx = await secretjs.tx.compute.instantiateContract(
    {
      codeId: codeId,
      sender: wallet.address,
      codeHash: contractCodeHash,
      initMsg: initMsg,
      label: "My Counter" + Math.ceil(Math.random() * 10000),
    },
    {
      gasLimit: 100_000,
    }
  );

  //Find the contract_address in the logs
  const contractAddress = tx.arrayLog.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;
  console.log(`contractAddress=${contractAddress}`);

  tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contractAddress: contractAddress,
      codeHash: contractCodeHash, // optional but way faster
      msg: {increment: {}},
      sentFunds: [], // optional
    },
    {
      gasLimit: 100_000,
    }
  );
};

main();
```
