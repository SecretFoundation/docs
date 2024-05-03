---
description: Verifiable on-chain random number generator for the entire Cosmos.
---

# Secret VRF for IBC with IBC-Hooks

## Secret VRF (Verifiable Random Function)

{% hint style="info" %}
This VRF tutorial uses IBC Hooks, as introduced in [IBC v3.4.0](https://medium.com/the-interchain-foundation/moving-beyond-simple-token-transfers-d42b2b1dc29b). If your chain is on a previous IBC version, see the SecretVRF tutorial using proxy contracts [here](https://docs.scrt.network/secret-network-documentation/development/ibc/cross-chain-randomness-with-secretvrf/secretvrf-for-ibc-via-proxy-contracts).&#x20;
{% endhint %}

Secret VRF is a provably fair and verifiable on-chain random number generator (RNG) that enables smart contracts to access random values without compromising security or usability. Coupled with cross-chain interoperable smart contracts using [IBC hooks](https://docs.scrt.network/secret-network-documentation/development/ibc/ibc-hooks), Secret Network enables developers and projects across the Cosmos access to state-of-the-art on-chain RNG.&#x20;

Use Secret VRF to build reliable smart contracts for any application that relies on unpredictable outcomes:

* **NFT Minting**: Utilize randomness for features like unordered minting, trait randomization, and identity numbering, enhancing the authenticity and security of NFT collections.
* **Web3 Gaming**: Apply randomness in gambling, damage calculation, loot boxes, and boss drops to build trust among players by ensuring fairness and preventing any player from having an unfair advantage.
* **DAO Operations**: Employ randomness for wallet initialization, task assigning, unordered voting/liquidations, and order book ordering, facilitating equitable and secure decentralized governance and operations.

{% hint style="info" %}
Learn more about how SecretVRF works in-depth [here](https://docs.scrt.network/secret-network-documentation/development/secret-contract-fundamentals/secret-vrf-on-chain-randomness).&#x20;
{% endhint %}

### Getting Started

To use SecretVRF on any IBC-enabled chain with IBC hooks, all that is required is:

1. **An IBC transfer channel between Secret Network and the consumer chain that receives randomness**.&#x20;
2. **Uploading the RNG Consumer Contract to your chain and directing it to your chain's transfer channel**&#x20;

{% hint style="info" %}
You can look up existing transfer channels between Secret Network on a block explorer such as Ping [here.](https://ping.pub/secret/ibc/connection/connection-68)&#x20;
{% endhint %}

<figure><img src="../../../../.gitbook/assets/ibc connections.png" alt=""><figcaption><p>Existing IBC connections with Secret Network </p></figcaption></figure>

### Requesting Randomness

`Git clone` the IBC hooks randomness repository:&#x20;

```bash
git clone https://github.com/writersblockchain/ibchooks-secretVRF.git
```

Update the [`SECRET_TRANSFER_CHANNEL_ID`](https://github.com/writersblockchain/ibchooks-secretVRF/blob/2dcda23c8e6e446e57cd8d4b0ccae6b9a40fe2fb/consumer-side/src/contract.rs#L14) and the [`CHAIN_TRANSFER_CHANNEL_ID`](https://github.com/writersblockchain/ibchooks-secretVRF/blob/2dcda23c8e6e446e57cd8d4b0ccae6b9a40fe2fb/consumer-side/src/contract.rs#L15C7-L15C32) to the channel-id for your IBC-enabled chain:&#x20;

```rust
//Juno
const SECRET_TRANSFER_CHANNEL_ID: &str = "channel-8";
const CHAIN_TRANSFER_CHANNEL_ID: &str = "channel-48";
```

{% hint style="info" %}
For this example, we request randomness on Juno, **but you can request randomness on any IBC-compatible chain that has a transfer channel established with Secret Network.**&#x20;
{% endhint %}

Once you have updated the transfer channels, compile the contract:&#x20;

```makefile
make build-mainnet-reproducible
```

Upload the compiled contract:&#x20;

```bash
junod tx wasm store consumer-side/artifacts/secret_ibc_rng_consumer_side_proxy.wasm --from <your-wallet> --chain-id juno-1 --node https://rpc.juno.chaintools.tech:443 --gas 1200000 --gas-prices 0.075ujuno
```

Upon successful [upload](https://ping.pub/juno/tx/ECB6B1C2653832CED1D4E6C778A1345DF6DE8FB2027B1C27C30F14EB484D295B), a `code_id` is returned:

```
{"key":"code_id","value":"4210"}]}]}]"
```

Instantiate the contract with the returned `code_id`:

```bash
junod tx wasm instantiate 4210 '{}' --label RNG-IBC-JUNO --no-admin --from <your-wallet> --chain-id juno-1 --node https://rpc.juno.chaintools.tech:443 --gas 200000 --gas-prices 0.075ujuno
```

Upon succesful [instantiation](https://ping.pub/juno/tx/68083E48AAD31B4FF0AE4427A36AAF952BA845B4546E84E01C2FDE18B4EB5831), a `contract_address` is returned:&#x20;

```bash
[{"key":"_contract_address","value":"juno1srwcjsaslt9ewujg6wcpcwv08lsrsn6rx6ja5mqx4qngqjh8cugqt73c8m"},
```

Now that you've instantiated your randomness contract, all that's left is to request randomness! Simply execute `request_random:`

```bash
junod tx wasm execute "juno1srwcjsaslt9ewujg6wcpcwv08lsrsn6rx6ja5mqx4qngqjh8cugqt73c8m" '{"request_random":{"job_id":"1"}}' --from <your-wallet> --chain-id juno-1 --node https://rpc.juno.chaintools.tech:443 --gas 200000 --gas-prices 0.075ujuno --amount 1ujuno
```

A transaction hash will be returned:

```bash
txhash: 92D5BDA1344529B58EAD5A0068A807632F46BCCCF05CF10E67211F9CBBD2A74B
```

{% hint style="info" %}
You can update the `job_id` string to any string of your choosing&#x20;
{% endhint %}

Navigate to the recently [received transactions](https://ping.pub/juno/account/juno1srwcjsaslt9ewujg6wcpcwv08lsrsn6rx6ja5mqx4qngqjh8cugqt73c8m) for your contract:&#x20;

<figure><img src="../../../../.gitbook/assets/Screenshot 2024-02-14 at 10.08.08 AM.png" alt=""><figcaption></figcaption></figure>

And then view the magic of cross-chain randomness with IBC hooks 😍:&#x20;

```bash
{"amount":"1","denom":"transfer/channel-8/ujuno","memo":"{\"wasm\": {\"contract\": \"juno1srwcjsaslt9ewujg6wcpcwv08lsrsn6rx6ja5mqx4qngqjh8cugqt73c8m\", \"msg\": {\"receive_random\": {\"job_id\": \"1\", \"randomness\": \"bjFHP7rrLwP4f6fpGpeTt5+N1zPiTO+y7da7RI9kHzk=\", \"signature\": \"y+Kwu0T2gwRwDZGCdDPzGrm6hE2S2UZF1e1jm47pv85pdRdP7HdOfl6T+VKfAE4hPxSWJ5LBcTSNZ+b0KTe0xQ==\"}}}}","receiver":"juno1srwcjsaslt9ewujg6wcpcwv08lsrsn6rx6ja5mqx4qngqjh8cugqt73c8m","sender":"secret1up0mymn4993hgn7zpzu4je34w0n5s7l0mem7rk"}
```

Congrats! You've just sent a verifiable on-chain random `byte` with SecretVRF 🙌.

### Conclusion

Secret VRF revolutionizes blockchain applications by providing a secure and verifiable source of randomness, critical for fairness in NFT minting, gaming, and DAO operations. Its seamless integration with IBC hooks enables cross-chain interoperability, allowing developers across the Cosmos ecosystem to build more reliable and elegant smart contracts.&#x20;

If you have any questions, join our [discord](https://discord.gg/secret-network-360051864110235648) and a Secret developer will assist you ASAP. &#x20;
