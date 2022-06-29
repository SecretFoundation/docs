# Nodes

### Node startup <a href="#node-startup" id="node-startup"></a>

When a full node resumes network participation, it reads `consensus_seed` from `$HOME/.sgx_secrets/consensus_seed.sealed`, and again does [key derivation](https://docs.scrt.network/protocol/encryption-specs.html#Key-Derivation) as outlined above.

### New node registration <a href="#new-node-registration" id="new-node-registration"></a>

New nodes want to join the network as full nodes.

#### On the new node <a href="#on-the-new-node" id="on-the-new-node"></a>

TODO reasoning

* Verify remote attestation proof of the bootstrap node from `genesis.json`
* Create a remote attestation proof the node's Enclave is genuine
* Generate inside the node's Enclave a true random curve25519 private key: `registration_privkey`
* From `registration_privkey` calculate `registration_pubkey`
* Send an `secretcli tx register auth` transaction with the following inputs:
  * The remote attestation proof the node's Enclave is genuine
  * `registration_pubkey`
  * 256 bits true random `nonce`

#### On the consensus layer, inside the enclave of every full node <a href="#on-the-consensus-layer-inside-the-enclave-of-every-full-node" id="on-the-consensus-layer-inside-the-enclave-of-every-full-node"></a>

TODO reasoning

* Receive the `secretcli tx register auth` transaction
* Verify the remote attestation proof that the new node's Enclave is genuine

**`seed_exchange_key`**

TODO reasoning

* `seed_exchange_key`: An [AES-128-SIV](https://tools.ietf.org/html/rfc5297) encryption key is used to send `consensus_seed` to the new node
* AES-128-SIV was chosen to prevent IV misuse by client libraries
  * https://tools.ietf.org/html/rfc5297
  * https://github.com/miscreant/meta
  * The input key is 256 bits, but half of it is used to derive the internal IV
  * AES-SIV does not pad the cipertext, and this leaks information about the plaintext data, specifically its size
* `seed_exchange_key` is derived the following way:
  * `seed_exchange_ikm` is derived using [ECDH](https://en.wikipedia.org/wiki/Elliptic-curve\_Diffie%E2%80%93Hellman) ([x25519](https://tools.ietf.org/html/rfc7748#section-6)) with `consensus_seed_exchange_privkey` and `registration_pubkey`
  * `seed_exchange_key` is derived using HKDF-SHA256 from `seed_exchange_ikm` and `nonce`

```
seed_exchange_ikm = ecdh({
  privkey: consensus_seed_exchange_privkey,
  pubkey: registration_pubkey,
}); // 256 bits

seed_exchange_key = hkdf({
  salt: hkdf_salt,
  ikm: concat(seed_exchange_ikm, nonce),
}); // 256 bits
```

**Sharing `consensus_seed` with the new node**

TODO reasoning

* The output of `secretcli tx register auth` is `consensus_seed` encrypted with AES-128-SIV with `seed_exchange_key` as the encryption key, using the public key of the registering node for the AD

```
encrypted_consensus_seed = aes_128_siv_encrypt({
  key: seed_exchange_key,
  data: consensus_seed,
  ad: new_node_public_key,
});

return encrypted_consensus_seed;
```

#### Back on the new node, inside its enclave <a href="#back-on-the-new-node-inside-its-enclave" id="back-on-the-new-node-inside-its-enclave"></a>

* Receive the `secretcli tx register auth` transaction output (`encrypted_consensus_seed`)

**`seed_exchange_key`**

TODO reasoning

* `seed_exchange_key`: An AES-128-SIV encryption key is used to decrypt `consensus_seed`
* `seed_exchange_key` is derived the following way:
  * `seed_exchange_ikm` is derived using [ECDH](https://en.wikipedia.org/wiki/Elliptic-curve\_Diffie%E2%80%93Hellman) ([x25519](https://tools.ietf.org/html/rfc7748#section-6)) with `consensus_seed_exchange_pubkey` (public in `genesis.json`) and `registration_privkey` (available only inside the new node's Enclave)
  * `seed_exchange_key` is derived using HKDF-SHA256 with `seed_exchange_ikm` and `nonce`

```
seed_exchange_ikm = ecdh({
  privkey: registration_privkey,
  pubkey: consensus_seed_exchange_pubkey, // from genesis.json
}); // 256 bits

seed_exchange_key = hkdf({
  salt: hkdf_salt,
  ikm: concat(seed_exchange_ikm, nonce),
}); // 256 bits
```

**Decrypting `encrypted_consensus_seed`**

TODO reasoning

* `encrypted_consensus_seed` is encrypted with AES-128-SIV, `seed_exchange_key` as the encryption key and the public key of the registering node as the `ad` as the decryption additional data
* The new node now has all of these parameters inside its Enclave, so it's able to decrypt `consensus_seed` from `encrypted_consensus_seed`
* Seal `consensus_seed` to disk at `$HOME/.sgx_secrets/consensus_seed.sealed`

```
consensus_seed = aes_128_siv_decrypt({
  key: seed_exchange_key,
  data: encrypted_consensus_seed,
  ad: new_node_public_key,
});

seal({
  key: "MRSIGNER",
  data: consensus_seed,
  to_file: "$HOME/.sgx_secrets/consensus_seed.sealed",
});
```

#### New node registration epilogue <a href="#new-node-registration-epilogue" id="new-node-registration-epilogue"></a>

TODO reasoning

* The new node can now do [key derivation](https://docs.scrt.network/protocol/encryption-specs.html#key-derivation) to get all the required network-wide secrets for participating in block execution and validation.
* After a machine/process reboot, the node can go through the [node startup process](https://docs.scrt.network/protocol/encryption-specs.html#node-startup) again

