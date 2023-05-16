# Execution Finalization

A new feature in Secret Network v1.9 is Execution Finalization**.**&#x20;

Execution Finalization is a concept where the contract notifies the chain that the current execution must be the last massage in a single transaction. Or, in other words, the last part of an execution unit. This will cause the chain to revert the transaction if any action is taken after this flag is set.

Secret Network (and in fact all Cosmos chains) run discrete blocks of execution instructions called _transactions_. A single _transaction_ can contain multiple _messages._ Each message contains a specific instruction. Any failure of any message in the transaction will cause the entire transaction to be reverted. This behavior can be exploited by attackers (or even non-maliciously) to select only favorable scenarios to be executed, while the unfavorable ones to be reverted.&#x20;

For example, consider a dice game. The user sends some bet. If he makes the correct bet, he will receive his original bet plus his winnings. Otherwise, his bet is lost. An attacker can abuse such logic by sending a transaction with two messages. The first is the bet message, while the second is message that will conditionally fail if the bet is lost. This way, he is guaranteed to make a profit.&#x20;

This same behavior can also be used for flash-loans, which are not inherently malicious but can be used to leverage capital for exploitation without risk of significant loss.&#x20;

The new _**FinalizeTx**_ message is now available for developers to toggle in case a specific execution path should be the last in a transaction. That way, it is guaranteed to be executed as the contract expects and cannot be reverted by the user.

To use FinalizeTx, simple append the FinalizeTx message when returning a result from your contract:

```rust
#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, StdError> {

    ... 
    
    return Ok(
        Response::new()
            .add_message(CosmosMsg::finalize_tx())
        )
}
```

{% hint style="info" %}
Messages are executed FIFO (first in, first out). If you want to send other messages before finalizing the execution, simply append them to the response before the FinalizeTx message.
{% endhint %}

We suggest developers consider whether or not a user conditionally reverting transactions is behavior that may affect the security of their application, as it may allow for scenarios that reveal confidential information or result in loss of funds. That being said, the trade-off is that such executions cannot be chained with other contract interactions, so usage of this feature should not be used without careful consideration.
