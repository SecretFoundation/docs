# Bootstrap Process



Before the genesis of a new chain, there must be a bootstrap node to generate network-wide secrets to enable the privacy features of Secret Network.

#### `consensus_seed` <a href="#consensus-seed" id="consensus-seed"></a>

* Create a remote attestation proof that the node's enclave is genuine
* Generate inside the Enclave a true random 256 bit seed: `consensus_seed`
* Seal `consensus_seed` with MRSIGNER to a local file: `$HOME/.sgx_secrets/consensus_seed.sealed`

```
// 256 bits
consensus_seed = true_random({ bytes: 32 });

seal({
  key: "MRSIGNER",
  data: consensus_seed,
  to_file: "$HOME/.sgx_secrets/consensus_seed.sealed",
});
```

#### &#x20;Bootstrap process epilogue <a href="#bootstrap-process-epilogue" id="bootstrap-process-epilogue"></a>

TODO reasoning

* Seal `consensus_seed` to disk at `$HOME/.sgx_secrets/consensus_seed.sealed`
* Publish to `genesis.json`:
  * The remote attestation proof that the Enclave is genuine
  * `consensus_seed_exchange_pubkey`
  * `consensus_io_exchange_pubkey`
