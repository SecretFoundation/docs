# Functions, Methods, and Data Structures

### CCL SDK

{% hint style="info" %}
The Secret Network CCL SDK can be forked [here](https://github.com/kromsten/secret-cosmos-abstraction).
{% endhint %}

### Data Structures

The essential parameters required for `chacha20poly1305`flow are defined in the following data structure:

**EncryptedParams**

_A data structure that is visible to all network participants and can be transmitted over non-secure channels_

```rust
/// A data structure that is safe to be visible by all network participants and can be transmited over non-secure channels
struct EncryptedParams {
    /// Encrypted payload containging hidden message
    pub payload            :   Binary,
    /// Sha256 hash of the payload
    pub payload_hash       :   Binary,
    /// Signed base64 digest of the payload_hash being wrapped
    /// in an cosmos arbitrary (036) object and rehashed again with sha256
    pub payload_signature  :   Binary,
    /// Public key of wallet used for deriving a shared key for chacha20_poly1305
    /// Not necessary the same as user's public key 
    pub user_key           :   Binary,
    /// One-time nonce used for chacha20_poly1305 encryption
    pub nonce              :   Binary,
}
```

#### EncryptedPayload

_Data meant to be encrypted and stored in the payload field of EncryptedParams_

```rust

/// Data meant to be encrypted and stored in the payload field of [EncryptedParams]
#[cw_serde]
pub struct EncryptedPayload {
    /// bech32 prefix address of a wallet used for signing hash of the payload 
    pub user_address   :  String,
    /// Public key of a wallet used for signing hash of the payload 
    pub user_pubkey   :   Binary,
    /// Human readable prefix for the bech32 address on the remote cosmos chain
    pub hrp           :   String,
    /// Plaintext message e.g. normal `ExecuteMsg` of your contract
    pub msg           :   Binary,
}
```

### Custom Contract Message

Your contract must define an endpoint where a user can pass all the required fields of the `EncryptedParams`. E.g:

```rust
pub enum ExecuteMsg {
    ...

    Encrypted {
        payload             :   Binary,
        payload_signature   :   Binary,
        payload_hash        :   Binary,
        user_key            :   Binary,
        nonce               :   Binary,
    }
    ...

}
```

If you want to define a custom message, rename the fields, or add additional fields, there is a helpful trait `WithEncryption` that you can implement. It simply tells the compiler how to extract the essential parameters from your custom message and turn it into `EncryptedParams`

```rust
trait WithEncryption : Serialize + Clone  {
    fn encrypted(&self)     -> EncryptedParams;
    fn is_encrypted(&self)  -> bool;
}
```

Implementing the trait for your message will allow you to use other useful methods of the SDK (like `handle_encrypted_wrapper`) that significantly simplify the development experience.&#x20;

Example of the implementation for the `ExecuteMsg` is as follows:

```rust
impl WithEncryption for ExecuteMsg {
   fn encrypted(&self)     -> EncryptedParams {
       match self.clone() {
           ExecuteMsg::Encrypted {
               payload,
               payload_signature,
               payload_hash,
               user_key,
               nonce,
           } => EncryptedParams {
               payload,
               payload_signature,
               payload_hash,
               user_key,
               nonce
           },
           _ => panic!("Not encrypted")

       }
   }

   fn is_encrypted(&self)  -> bool {
       if ExecuteMsg::Encrypted{..} = self {
           true
       } else {
           false
       }
   }
}
```

### Extending existing data structures

The SDK has multiple data structures that already implement `WithEncryption` trait and also use the template engine of Rust to make them easily extendable. Take for example the following message:

```rust
pub enum GatewayExecuteMsg<E = Option<Empty>> 
    where E: JsonSchema
{
    ResetEncryptionKey  {} ,

    Encrypted {
        payload             :   Binary,
        payload_signature   :   Binary,
        payload_hash        :   Binary,
        user_key            :   Binary,
        nonce               :   Binary,
    },

    Extension {
        msg : E
    }
}
```

You can define a new message that extends the `GatewayExecuteMsg` by simply providing a new type for the `Extension` instead of the default `Option<Empty>` like this:

```rust
// Degine your custom message
#[cw_serde]
pub enum MyCustomMessage {
    HandleFoo {}
    HandleBar {}
}
// Extend the GatewayExecuteMsg
pub type MyGatewayExecuteMsg = GatewayExecuteMsg<MyCustomMessage>;
```

Your extended type in this case is available under `MyGatewayExecuteMsg::Extension` variant and you can use it in your contract like this:

```rust
/// MyGatewayExecuteMsg
match msg {
    ... 
    ResetEncryptionKey => { ... },

    MyGatewayExecuteMsg::Extension{msg} => {

        /// MyCustomMessage
        match msg {
            MyCustomMessage::HandleFoo{} => {
                // Do something
            }
            MyCustomMessage::HandleBar{} => {
                // Do something
            }
        }
    }
    
    ...
}
```

### Functions and methods

**`handle_encrypted_wrapper`**

The encryption logic, `handle_encrypted_wrapper`, **is where the encryption magic happens** ⭐

You can review the function in the SDK [here](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/930732c9d0b11d6f394d9d99cccb96380e103881/packages/sdk/src/common/handle.rs#L52). It has the following functionality:

1. Check if Message is Encrypted:
   * If the message is encrypted (`msg.is_encrypted()`), it proceeds with decryption.
2. Extract Encryption Parameters:
   * Retrieves the encryption parameters from the message (`msg.encrypted()`).
3. Check Nonce:
   * Ensures the nonce has not been used before to prevent replay attacks.
4. Load Encryption Wallet:
   * Loads the encryption wallet from storage.
5. Decrypt Payload:
   * Decrypts the payload using the wallet and the provided parameters (`payload`, `user_key`, and `nonce`).

```rust
      let decrypted  = wallet.decrypt_to_payload(
            &params.payload,
            &params.user_key,
            &params.nonce,
        )?;
```

[decrypt\_to\_payload](https://github.com/writersblockchain/cosmos-ccl-sdk/blob/930732c9d0b11d6f394d9d99cccb96380e103881/packages/sdk/src/crypto/wallets.rs#L177) uses chacha20poly1305 algorithm

6. Verify Credentials:

* Constructs a `CosmosCredential` from the decrypted data.
* Inserts the nonce into storage to mark it as used.
* Verifies the sender using the `verify_arbitrary` function with the credential.

7. Deserialize Inner Message:

* Converts the decrypted payload into the original message type `E`.
* Ensures the decrypted message is not encrypted (nested encryption is not allowed).

8. Return Decrypted Message and Updated Info:

* Returns the decrypted message and updated `MessageInfo` with the verified sender.

**`chacha20poly1305_decrypt`**

The following function uses the following types for as the input parameters:

* `cosmwasm_std::Binary`,
* `std::vec::Vec`.
* `[u8]`
* and others that implement `Deref<Target = [u8]>` trait

```rust
pub fn chacha20poly1305_decrypt(
    ciphertext    :     &impl Deref<Target = [u8]>,
    key           :     &impl Deref<Target = [u8]>,
    nonce         :     &impl Deref<Target = [u8]>,
) -> StdResult<Vec<u8>> {
    ...
}
```

### Various authentication utilities

To verify a message that was was signed through a method `cosmos arbitrary (036)` message format, you can use the following function:

```rust
fn verify_arbitrary<M : Display>(api:  &dyn Api, cred: &CosmosCredential<M>) -> StdResult<String>
```

The method takes in a `CosmosCredential` struct as an argument which is a a helpful wrapper over essential required fields required for the verification:

```rust
pub struct CosmosCredential<M = String> 
    where M: Display
{
    /// public key matching the respective secret that was used to sign message
    pub pubkey    :   Binary,
    /// signed sha256 digest of a message wrapped in arbitary data (036) object
    pub signature :   Binary,
    /// signed inner message before being wrapped with 036
    pub message   :   M,
    /// prefix for the bech32 address on remote cosmos chain
    pub hrp       :   String
}
```

Both `CosmosCredential` and `EncryptedParams` can be used with `String` or base64 encoded `Binary` types

To generate a preamble message for the `cosmos arbitrary (036)` message format, you can use the following utility function:

```rust
fn preamble_msg_arb_036(signer: &str, data: &str) -> String
```

The function uses a hardcoded JSON string with all the required keys present and sorted.&#x20;

