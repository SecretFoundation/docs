# Understanding Feegrant allowances

An allowance in the context of the Fee Grant module is a specified amount of tokens that a granter permits a grantee to use for paying transaction fees. It should be noted that there can be only one existing fee grant allowed for a grantee and granter and self grants are not allowed.

#### Granter and grantee <a href="#granter-and-grantee" id="granter-and-grantee"></a>

In the allowance mechanism, there are two key players:

* The **Granter**: The granter is the account that provides the allowance. This account will be debited whenever the grantee pays transaction fees using the allowance.
* The **Grantee**: The grantee is the account that receives the allowance. This account can use the allowance to pay for transaction fees.

#### Types of allowances <a href="#types-of-allowances" id="types-of-allowances"></a>

There are three allowance types that can be granted:

* **Basic Fee Allowance**: This is a simple allowance model where a granter can specify a maximum limit up to which a grantee can use tokens to pay transaction fees. The allowance can also have an expiration date after which it can no longer be used.
* **Periodic Fee Allowance**: This allowance model is more complex and versatile. It allows the granter to set a periodic reset of the allowance, creating a recurring "budget" for the grantee. This could be used to create a daily, weekly, or monthly allowance, for example.
* **Allowed Msg Allowance**: Creates allowance only for specified message types.

In this guide, our emphasis will be on generating allowances utilizing the BasicAllowance type. For detailed information on each allowance type, please refer to the [following](https://github.com/cosmos/cosmos-sdk/blob/main/x/feegrant/README.md).

#### Granting and revoking allowances <a href="#granting-and-revoking-allowances" id="granting-and-revoking-allowances"></a>

Granting an allowance involves the granter sending a special type of transaction that includes information about the grantee and the details of the allowance. Once the transaction is included in a block, the allowance is active and can be used by the grantee.

Revoking an allowance is also a simple process. The granter sends a revoke transaction that includes the address of the grantee. Once this transaction is processed, the grantee can no longer use the allowance to pay fees.

#### Handling allowance expiry and insufficient allowance <a href="#handling-allowance-expiry-and-insufficient-allowance" id="handling-allowance-expiry-and-insufficient-allowance"></a>

It's important to note that allowances may have an expiry date set by the granter. Once an allowance has expired, it can no longer be used to pay for transaction fees. Grantees must be aware of their allowance expiry dates and ensure that they use their allowances before they expire.

Similarly, if an allowance is exhausted (i.e., the fees for a transaction exceed the remaining allowance), the transaction will not be processed.
