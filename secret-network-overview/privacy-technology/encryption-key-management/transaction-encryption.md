# Transaction Encryption

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

### Transaction encryption <a href="#transaction-encryption" id="transaction-encryption"></a>

TODO reasoning

* `tx_encryption_key`: An AES-128-SIV encryption key used to encrypt tx inputs and decrypt tx outputs
  * `tx_encryption_ikm` is derived using [ECDH](https://en.wikipedia.org/wiki/Elliptic-curve\_Diffie%E2%80%93Hellman) ([x25519](https://tools.ietf.org/html/rfc7748#section-6)) with `consensus_io_exchange_pubkey` and `tx_sender_wallet_privkey` (on the sender's side)
  * `tx_encryption_ikm` is derived using [ECDH](https://en.wikipedia.org/wiki/Elliptic-curve\_Diffie%E2%80%93Hellman) ([x25519](https://tools.ietf.org/html/rfc7748#section-6)) with `consensus_io_exchange_privkey` and `tx_sender_wallet_pubkey` (inside the Enclave of every full node)
* `tx_encryption_key` is derived using HKDF-SHA256 with `tx_encryption_ikm` and a random number `nonce` to prevent using the same key for the same tx sender multiple times
* The input (`msg`) to the contract is always prepended with the sha256 hash of the contract's code
  * This is meant to prevent replaying an encrypted input of a legitimate contract to a malicious contract, and asking the malicious contract to decrypt the input
  * In this attack example the output will still be encrypted with a `tx_encryption_key` that only the original sender knows, but the malicious contract can be written to save the decrypted input to its state, and then via a getter with no access control retrieve the encrypted input

#### Input <a href="#input" id="input"></a>

**On the transaction sender**

```
tx_encryption_ikm = ecdh({
  privkey: tx_sender_wallet_privkey,
  pubkey: consensus_io_exchange_pubkey, // from genesis.json
}); // 256 bits

nonce = true_random({ bytes: 32 });

tx_encryption_key = hkdf({
  salt: hkdf_salt,
  ikm: concat(tx_encryption_ikm, nonce),
}); // 256 bits

ad = concat(nonce, tx_sender_wallet_pubkey);

codeHash = toHexString(sha256(contract_code));

encrypted_msg = aes_128_siv_encrypt({
  key: tx_encryption_key,
  data: concat(codeHash, msg),
  ad: ad,
});

tx_input = concat(ad, encrypted_msg);
```

**On the consensus layer, inside the enclave of every full node**

```
nonce = tx_input.slice(0, 32); // 32 bytes
tx_sender_wallet_pubkey = tx_input.slice(32, 32); // 32 bytes, compressed curve25519 public key
encrypted_msg = tx_input.slice(64);

tx_encryption_ikm = ecdh({
  privkey: consensus_io_exchange_privkey,
  pubkey: tx_sender_wallet_pubkey,
}); // 256 bits

tx_encryption_key = hkdf({
  salt: hkdf_salt,
  ikm: concat(tx_encryption_ikm, nonce),
}); // 256 bits

codeHashAndMsg = aes_128_siv_decrypt({
  key: tx_encryption_key,
  data: encrypted_msg,
});

codeHash = codeHashAndMsg.slice(0, 64);
assert(codeHash == toHexString(sha256(contract_code)));

msg = codeHashAndMsg.slice(64);
```

#### Output <a href="#output" id="output"></a>

* The output must be a valid JSON object, as it is passed to multiple mechanisms for final processing:
  * Logs are treated as Tendermint events
  * Messages can be callbacks to another contract call or contract init
  * Messages can also instruct sending funds from the contract's wallet
  * A data section which is free-form bytes to be interpreted by the client (or dApp)
  * An error section
* The output must be partially encrypted

Here is an example output for an execution:

```
{
  "ok": {
    "messages": [
      {
        "type": "Send",
        "to": "...",
        "amount": "..."
      },
      {
        "wasm": {
          "execute": {
            "msg": "{\"banana\":1,\"papaya\":2}", // need to encrypt this value
            "contract_addr": "aaa",
            "callback_code_hash": "bbb",
            "send": { "amount": 100, "denom": "uscrt" }
          }
        }
      },
      {
        "wasm": {
          "instantiate": {
            "msg": "{\"water\":1,\"fire\":2}", // need to encrypt this value
            "code_id": "123",
            "callback_code_hash": "ccc",
            "send": { "amount": 0, "denom": "uscrt" }
          }
        }
      }
    ],
    "log": [
      {
        "key": "action", // need to encrypt this value
        "value": "transfer" // need to encrypt this value
      },
      {
        "key": "sender", // need to encrypt this value
        "value": "secret1v9tna8rkemndl7cd4ahru9t7ewa7kdq87c02m2" // need to encrypt this value
      },
      {
        "key": "recipient", // need to encrypt this value
        "value": "secret1f395p0gg67mmfd5zcqvpnp9cxnu0hg6rjep44t" // need to encrypt this value
      }
    ],
    "data": "bla bla" // need to encrypt this value
  }
}
```

* Notice on a `Contract` message, the `msg` value should be the same `msg` as in our `tx_input`, so we need to prepend the `nonce` and `tx_sender_wallet_pubkey` just like we did on the tx sender above
*   On a `Contract` message, we also send a `callback_signature`, so we can verify the parameters sent to the enclave:

    ```
    callback_signature = sha256(consensus_callback_secret | calling_contract_addr | encrypted_msg | funds_to_send)
    ```

For more on that, [read here](https://docs.scrt.network/dev/privacy-model-of-secret-contracts.html#verified-values-during-contract-execution).

* For the rest of the encrypted outputs we only need to send the ciphertext, as the tx sender can get `consensus_io_exchange_pubkey` from `genesis.json` and `nonce` from the `tx_input` that is attached to the `tx_output`

Here is an example output with an error:

```
{
  "err": "{\"watermelon\":6,\"coffee\":5}" // need to encrypt this value
}
```

*   An example output for a query:

    ```
    {
      "ok": "{\"answer\":42}" // need to encrypt this value
    }
    ```

**On the consensus layer, inside the enclave of every full node**

```
// already have from tx_input:
// - tx_encryption_key
// - nonce

if (typeof output["err"] == "string") {
  encrypted_err = aes_128_siv_encrypt({
    key: tx_encryption_key,
    data: output["err"],
  });
  output["err"] = base64_encode(encrypted_err); // needs to be a JSON string
} else if (typeof output["ok"] == "string") {
  // query
  // output["ok"] is handled the same way as output["err"]...
  encrypted_query_result = aes_128_siv_encrypt({
    key: tx_encryption_key,
    data: output["ok"],
  });
  output["ok"] = base64_encode(encrypted_query_result); // needs to be a JSON string
} else if (typeof output["ok"] == "object") {
  // init or execute
  // external query is the same, but happens mid-run and not as an output
  for (m in output["ok"]["messages"]) {
    if (m["type"] == "Instantiate" || m["type"] == "Execute") {
      encrypted_msg = aes_128_siv_encrypt({
        key: tx_encryption_key,
        data: concat(m["callback_code_hash"], m["msg"]),
      });

      // base64_encode because needs to be a string
      // also turns into a tx_input so we also need to prepend nonce and tx_sender_wallet_pubkey
      m["msg"] = base64_encode(
        concat(nonce, tx_sender_wallet_pubkey, encrypted_msg)
      );
    }
  }

  for (l in output["ok"]["log"]) {
    // l["key"] is handled the same way as output["err"]...
    encrypted_log_key_name = aes_128_siv_encrypt({
      key: tx_encryption_key,
      data: l["key"],
    });
    l["key"] = base64_encode(encrypted_log_key_name); // needs to be a JSON string

    // l["value"] is handled the same way as output["err"]...
    encrypted_log_value = aes_128_siv_encrypt({
      key: tx_encryption_key,
      data: l["value"],
    });
    l["value"] = base64_encode(encrypted_log_value); // needs to be a JSON string
  }

  // output["ok"]["data"] is handled the same way as output["err"]...
  encrypted_output_data = aes_128_siv_encrypt({
    key: tx_encryption_key,
    data: output["ok"]["data"],
  });
  output["ok"]["data"] = base64_encode(encrypted_output_data); // needs to be a JSON string
}

return output;
```

**Back on the transaction sender**

* The transaction output is written to the chain
* Only the wallet with the right `tx_sender_wallet_privkey` can derive `tx_encryption_key`, so for everyone else it will just be encrypted
* Every encrypted value can be decrypted the following way:

```
// output["err"]
// output["ok"]["data"]
// output["ok"]["log"][i]["key"]
// output["ok"]["log"][i]["value"]
// output["ok"] if input is a query

encrypted_bytes = base64_encode(encrypted_output);

aes_128_siv_decrypt({
  key: tx_encryption_key,
  data: encrypted_bytes,
});
```

* For `output["ok"]["messages"][i]["type"] == "Contract"`, `output["ok"]["messages"][i]["msg"]` will be decrypted in [this](https://docs.scrt.network/protocol/encryption-specs.html#on-the-consensus-layer-inside-the-enclave-of-every-full-node-1) manner by the consensus layer when it handles the contract callback

\
