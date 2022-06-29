# Key Derivation



TODO reasoning

* Key derivation inside the Enclave is done deterministically using HKDF-SHA256 [\[1\]](https://tools.ietf.org/html/rfc5869#section-2)[\[2\]](https://en.wikipedia.org/wiki/HKDF)
* The HKDF-SHA256 [salt](https://tools.ietf.org/html/rfc5869#section-3.1) is chosen to be Bitcoin's halving block hash

```
hkdf_salt = 0x000000000000000000024bead8df69990852c202db0e0097c1a12ea637d7e96d;
```

* Using HKDF-SHA256, `hkdf_salt` and `consensus_seed`, derive the following keys:

**`consensus_seed_exchange_privkey`**

* `consensus_seed_exchange_privkey`: A curve25519 private key is used to derive encryption keys in order to securely share `consensus_seed` with new nodes in the network
* From `consensus_seed_exchange_privkey` calculate `consensus_seed_exchange_pubkey`

```
consensus_seed_exchange_privkey = hkdf({
  salt: hkdf_salt,
  ikm: consensus_seed.append(uint8(1)),
}); // 256 bits

consensus_seed_exchange_pubkey = calculate_curve25519_pubkey(
  consensus_seed_exchange_privkey
);
```

**`consensus_io_exchange_privkey`**

* `consensus_io_exchange_privkey`: A curve25519 private key is used to derive encryption keys in order to decrypt transaction inputs and encrypt transaction outputs
* From `consensus_io_exchange_privkey` calculate `consensus_io_exchange_pubkey`

```
consensus_io_exchange_privkey = hkdf({
  salt: hkdf_salt,
  ikm: consensus_seed.append(uint8(2)),
}); // 256 bits

consensus_io_exchange_pubkey = calculate_curve25519_pubkey(
  consensus_io_exchange_privkey
);
```

**`consensus_state_ikm`**

* `consensus_state_ikm`: An input keyring material (IKM) for HKDF-SHA256 is used to derive encryption keys for contract state

```
consensus_state_ikm = hkdf({
  salt: hkdf_salt,
  ikm: consensus_seed.append(uint8(3)),
}); // 256 bits
```

**`consensus_callback_secret`**

* `consensus_callback_secret`: A curve25519 private key is used to create callback signatures when contracts call other contracts

```
consensus_state_ikm = hkdf({
  salt: hkdf_salt,
  ikm: consensus_seed.append(uint8(4)),
}); // 256 bits
```
