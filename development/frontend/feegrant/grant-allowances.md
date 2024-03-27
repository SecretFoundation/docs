# Grant allowances

Building a smart contract dapp that enables users to request a fee grant is a challenging task since all transactions necessitate the payment of transaction fees. However, there are several methods that can be utilized. Here are a few examples:

* The granter can manually execute each fee grant allowance transaction using the **secretcli**&#x20;
* Construct a deployment script containing addresses that you wish to assign a fee grant to. This script will utilize the **secretcli** to perform the fee grant transaction for each specified address.
* Implement a simple frontend application that verifies and validates a user's account. After confirming that they are the account owner, the application would execute a Javascript transaction with **secret.js** to carry out the fee grant transaction.

## Create allowance using secretcli <a href="#create-allowance-using-archwayd" id="create-allowance-using-archwayd"></a>

The **secretcli**  is a key tool for accessing the fundamental functionalities of the **Archway** Blockchain. To install **secretcli**, refer to [install.md](../../../infrastructure/resources/secret-cli/install.md "mention"). Here is an illustration of a typical transaction for creating a grant allowance:

```bash
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

## Create allowance using secretjs <a href="#create-allowance-using-arch3js" id="create-allowance-using-arch3js"></a>

This section demonstrates how to create a grant allowance using **secretjs**. By following the steps outlined in this section, you'll be able to structure a grant allowance message, and execute the necessary transaction which will grant allowances to designated accounts.&#x20;

1. The allowance message comprises three essential components: the `granter`, `grantee`, and the actual `allowance`. As previously mentioned, the `granter` is the address responsible for granting the allowance, while the `grantee` is the recipient who can utilize the granted allowance. The `allowance` component is slightly more intricate, with its structure dependent on the specific type of allowance employed.

To illustrate, let's examine the structure of a **grantMsg** using the following example:

```javascript
const address = "secret1..." // the address you like to send the Fee Grant to 
const faucetAddress = "secret1..." //address of your own faucet

const grantMsg = new MsgGrantAllowance({
    grantee: address,
    granter: faucetAddress,
    allowance: [
      spend_limit: [
        {
          amount: "1000000",
          denom: "uscrt",
        },
      ],
    },
  })
```

2. Now, all that remains is to execute the transaction:

<pre class="language-javascript"><code class="lang-javascript"><strong>const memo = "Your custom memo here" 
</strong>const gasLimit = 18000 //recommended amount, if you see gas limit errors, increase this. 
const gasPriceInFeeDenom = 0.5 //means: 0.5 uscrt/gas unit

<strong>const tx = await secretjs.tx.broadcast(
</strong>        msgs,
        {
          memo: memo,
          broadcastCheckIntervalMs: 100,
          feeDenom: "uscrt",
          gasPriceInFeeDenom: gasPriceInFeeDenom,
          gasLimit: gasLimit,
          broadcastMode: BroadcastMode.Block,
        },
    )
</code></pre>

You can find a working example of this in the Fee Grant Faucet [here](https://github.com/SecretSaturn/FeeGrantFaucet2.0).
