# Contract State Encryption



TODO reasoning

* While executing a function call inside the Enclave as part of a transaction, the contract code can call `write_db(field_name, value)`, `read_db(field_name)`, and `remove_db(field_name)`
* Contract state is stored on-chain inside a key-value store; the `field_name` must remain constant between calls
* `encryption_key` is derived using HKDF-SHA256 from:
  * `consensus_state_ikm`
  * `field_name`
  * `contract_key`
* `ad` (additional data) is used to prevent leaking information about the same value written to the same key at different times

#### `contract_key` <a href="#contract-key" id="contract-key"></a>

* `contract_key` is a concatenation of two values: `signer_id || authenticated_contract_key`
* Its purpose is to make sure each contract has a unique unforgeable encryption key
  * Unique: Make sure the state of two contracts with the same code is different
  * Unforgeable: Make sure a malicious node runner won't be able to locally encrypt transactions with it's own encryption key, and then decrypt the resulting state with the fake key
* When a contract is deployed (i.e., on contract init), `contract_key` is generated inside the Enclave as follows:

```
signer_id = sha256(concat(msg_sender, block_height));

authentication_key = hkdf({
  salt: hkdf_salt,
  info: "contract_key",
  ikm: concat(consensus_state_ikm, signer_id),
});

authenticated_contract_key = hmac_sha256({
  key: authentication_key,
  data: code_hash,
});

contract_key = concat(signer_id, authenticated_contract_key);
```

* Every time a contract execution is called, `contract_key` should be sent to the enclave
* In the enclave, the following verification needs to happen:

```
signer_id = contract_key.slice(0, 32);
expected_contract_key = contract_key.slice(32, 64);

authentication_key = hkdf({
  salt: hkdf_salt,
  info: "contract_key",
  ikm: concat(consensus_state_ikm, signer_id),
});

calculated_contract_key = hmac_sha256({
  key: authentication_key,
  data: code_hash,
});

assert(calculated_contract_key == expected_contract_key);
```

#### write\_db(field\_name, value) <a href="#write-db-field-name-value" id="write-db-field-name-value"></a>

```
encryption_key = hkdf({
  salt: hkdf_salt,
  ikm: concat(consensus_state_ikm, field_name, contract_key),
});

encrypted_field_name = aes_128_siv_encrypt({
  key: encryption_key,
  data: field_name,
});

current_state_ciphertext = internal_read_db(encrypted_field_name);

if (current_state_ciphertext == null) {
  // field_name doesn't yet initialized in state
  ad = sha256(encrypted_field_name);
} else {
  // read previous_ad, verify it, calculate new ad
  previous_ad = current_state_ciphertext.slice(0, 32); // first 32 bytes/256 bits
  current_state_ciphertext = current_state_ciphertext.slice(32); // skip first 32 bytes

  aes_128_siv_decrypt({
    key: encryption_key,
    data: current_state_ciphertext,
    ad: previous_ad,
  }); // just to authenticate previous_ad
  ad = sha256(previous_ad);
}

new_state_ciphertext = aes_128_siv_encrypt({
  key: encryption_key,
  data: value,
  ad: ad,
});

new_state = concat(ad, new_state_ciphertext);

internal_write_db(encrypted_field_name, new_state);
```

#### read\_db(field\_name) <a href="#read-db-field-name" id="read-db-field-name"></a>

```
encryption_key = hkdf({
  salt: hkdf_salt,
  ikm: concat(consensus_state_ikm, field_name, contract_key),
});

encrypted_field_name = aes_128_siv_encrypt({
  key: encryption_key,
  data: field_name,
});

current_state_ciphertext = internal_read_db(encrypted_field_name);

if (current_state_ciphertext == null) {
  // field_name doesn't yet initialized in state
  return null;
}

// read ad, verify it
ad = current_state_ciphertext.slice(0, 32); // first 32 bytes/256 bits
current_state_ciphertext = current_state_ciphertext.slice(32); // skip first 32 bytes
current_state_plaintext = aes_128_siv_decrypt({
  key: encryption_key,
  data: current_state_ciphertext,
  ad: ad,
});

return current_state_plaintext;
```

#### remove\_db(field\_name) <a href="#remove-db-field-name" id="remove-db-field-name"></a>

Very similar to `read_db`.

```
encryption_key = hkdf({
  salt: hkdf_salt,
  ikm: concat(consensus_state_ikm, field_name, contract_key),
});

encrypted_field_name = aes_128_siv_encrypt({
  key: encryption_key,
  data: field_name,
});

internal_remove_db(encrypted_field_name);
```
