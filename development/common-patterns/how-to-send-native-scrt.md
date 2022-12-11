# How To Send Native SCRT

Sending Native SCRT from a contract is simple. You will need to use the [`BankMsg::Send`](https://docs.rs/cosmwasm-std/latest/cosmwasm\_std/enum.BankMsg.html#variant.Send) message. This is a [contract-to-module](https://docs.cosmwasm.com/docs/0.14/architecture/composition/#modules) call. You can send any other native denoms this way, such as ibc-denoms.

{% tabs %}
{% tab title="Cosmwasm v1.0" %}
```rust
#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg // this is a custom struct defined in your msg.rs
) -> StdResult<Response> {
    // example: send 33 uscrt
    let coins_to_send: Vec<Coin> = vec![Coin {
        denom: "uscrt".to_string(),
        amount: Uint128::from(33u128),
    }];
    
    let message = CosmosMsg::Bank(BankMsg::Send {
        // replace with recipient of your choice
        to_address: info.sender.clone().into_string(),
        amount: coins_to_send,
    });
    
    let res = Response::new().add_message(message);
    Ok(res)
}
```
{% endtab %}

{% tab title="Cosmwasm v0.10" %}
```rust
pub fn handle<S: Storage, A: Api, Q: Querier>(
    _deps: &mut Extern<S, A, Q>,
    env: Env,
    _msg: HandleMsg, // this is a custom struct defined in your msg.rs
) -> StdResult<HandleResponse> {
    // example: send 33 uscrt
    let coins_to_send: Vec<Coin> = vec![Coin {
        denom: "uscrt".to_string(),
        amount: Uint128::from(33u128),
    }];
    
    let res = HandleResponse {
        messages: vec![CosmosMsg::Bank(BankMsg::Send {
            from_address: env.contract.address,
            // replace with recipient of your choice
            to_address: env.message.sender,
            amount: coins_to_send,
        })],
        log: vec![],
        data: None,
    };

    Ok(res)
}
```
{% endtab %}
{% endtabs %}

{% hint style="warning" %}
**Having Trouble?** Always make sure your contract has enough funds to begin with!

You can send some coins to your contract like this:

```
secretcli tx bank send <from-account> <contract-address> 1000uscrt
```

You can always see decrypted error messages from the contract like so:

```
scli q compute tx <tx_hash>
```
{% endhint %}

#### Transaction logs

You can see the spent coins when you query for the transaction:

```bash
> tx_hash=$(secretcli tx compute execute <contract-address> '{}' --output json | jq '.txhash')
> secretcli q tx $txhash
# ...
logs:
- events:
  - attributes:
    - key: receiver
      value: secret1ap26qrlp8mcq2pg6r47w43l0y8zkqm8a450s03
    - key: amount
      value: 33uscrt
    type: coin_received
  - attributes:
    - key: spender
      value: secret18vd8fpwxzck93qlwghaj6arh4p7c5n8978vsyg
    - key: amount
      value: 33uscrt
# ...
```
