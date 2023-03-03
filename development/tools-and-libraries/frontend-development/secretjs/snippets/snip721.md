# SNIP721

### Add Minter

```
const addMinterMsg = await secretjs.tx.snip721.addMinter(
  {
    contract_address: contractAddress,
    msg: { add_minters: { minters: [accounts[0].address] } },
    sender: accounts[0].address,
  },
  {
    gasLimit: 100_000,
  },
);
```

### Mint SNIP721 Token

<pre class="language-typescript"><code class="lang-typescript"><strong>const mintMsg = await secretjs.tx.snip721.mint(
</strong>  {
    contract_address :contractAddress,
    sender: accounts[0].address,
    msg: {
      mint_nft: {
        token_id: "1",
      },
    },
  },
  {
    gasLimit: 200_000,
  },
);</code></pre>

### Send SNIP721 Token

```typescript
const txExec = await secretjs.tx.snip721.send(
  {
    sender: secretjs.address,
    contract_address: contractAddress,
    msg: {
      send_nft: {
        contract: accounts[1].address,
        token_id: "1",
      },
    },
  },
  {
    gasLimit: 50_000,
  },
);
```

### Add Minter and Mint in a Single Transaction

```typescript
const addMinterMsg = new MsgExecuteContract({
  sender: accounts[0].address,
  contract_address: contractAddress,
  // codeHash, // Test MsgExecuteContract without codeHash
  msg: { add_minters: { minters: [accounts[0].address] } },
  sentFunds: [],
});

const mintMsg = new MsgExecuteContract({
  sender: accounts[0].address,
  contract_address: contractAddress,
  code_hash: codeHash,
  msg: {
    mint_nft: {
      token_id: "1",
      owner: accounts[0].address,
      public_metadata: {
        extension: {
          image:
            "https://scrt.network/secretnetwork-logo-secondary-black.png",
          name: "secretnetwork-logo-secondary-black",
        },
      },
      private_metadata: {
        extension: {
          image:
            "https://scrt.network/secretnetwork-logo-primary-white.png",
          name: "secretnetwork-logo-primary-white",
        },
      },
    },
  },
  sentFunds: [],
});

const tx = await secretjs.tx.broadcast([addMinterMsg, mintMsg], {
  gasLimit: 5_000_000,
});

```

### Query Tokens with Permit

```typescript
let permit = await secretjs.utils.accessControl.permit.sign(accounts[0].address, "secretdev-1", "Test", [contractAddress], ["owner"], false)

let tokens2 = await secretjs.query.snip721.GetOwnedTokens({
  contract: { address: contractAddress, codeHash },
  owner: accounts[0].address,
  auth: { permit: permit },
});
```

### Query Tokens with Viewing Key

```typescript
await secretjs.tx.snip721.setViewingKey(
  {
    contract_address: contractAddress,
    sender: accounts[0].address,
    msg: {
      set_viewing_key: {
        key: "hello",
      },
    },
  },
  {
    gasLimit: 100_000,
  },
);

    let tokens = await secretjs.query.snip721.GetOwnedTokens({
  contract: { address: contractAddress, codeHash },
  owner: accounts[0].address,
  auth: { viewer: { viewing_key: "hello", address: accounts[0].address } },
});
```
