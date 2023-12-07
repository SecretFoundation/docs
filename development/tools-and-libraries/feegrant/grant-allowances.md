# Grant allowances

Building a smart contract dapp that enables users to request a fee grant is a challenging task since all transactions necessitate the payment of transaction fees. However, there are several methods that can be utilized. Here are a few examples:

* The granter can manually execute each fee grant allowance transaction using the **secretcli**&#x20;
* Construct a deployment script containing addresses that you wish to assign a fee grant to. This script will utilize the **secretcli** to perform the fee grant transaction for each specified address.
* Implement a simple frontend application that verifies and validates a user's account. After confirming that they are the account owner, the application would execute a Javascript transaction with **secret.js** to carry out the fee grant transaction.

### Create allowance using secretcli <a href="#create-allowance-using-archwayd" id="create-allowance-using-archwayd"></a>

The **secretcli**  is a key tool for accessing the fundamental functionalities of the **Archway** Blockchain. To install **secretcli**, refer to [install.md](../secret-cli/install.md "mention"). Here is an illustration of a typical transaction for creating a grant allowance:

```
secretcli tx feegrant grant "granter_address" "grantee_address" \
    --chain-id "secret-4" \
    --spend-limit 1000000uscrt \
    --expiration 2025-12-31T23:00:00Z \
    --allowed-messages '/secret.compute.v1beta1.MsgExecuteContract'
```

Let's break down a few of the components:

* `granter_address`: This value represents the address of the account providing tokens to the **grantee** for transaction execution.
* `grantee_address`: This denotes the account receiving tokens, enabling it to perform transactions using these grants.
* `allowed-messages`: Through the **AllowedMsgAllowance** type, you can limit the message type a grantee can use the grant for. If not specified, all messages are allowed.
* `expiration`: The deadline by which the allowance must be used or it will expire.
* `spend-limit`: The maximum allowance provided to the grantee. This amount is adjusted as tokens are utilized.
