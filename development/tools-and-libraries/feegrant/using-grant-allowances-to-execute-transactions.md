# Using grant allowances to execute transactions

As one of the primary use case of the Fee Grant module is to help with onboarding new users, this section of the guide will show how to allow users to execute transactions using the allowance granted to them.

### Query a grant allowance <a href="#query-a-grant-allowance" id="query-a-grant-allowance"></a>

Now that an allowance has been assigned to an account address, you should be able to verify the details of that grant. The returned information will include the granter's address, the allowance amount, and any other conditions set by the granter, such as the expiration date of the allowance.

The following command using **secretcli** will give the details of a grant allowance:

```
secretcli query feegrant grant "granter_address" "grantee_address" 
```

**Results**:

```
allowance:
  '@type': /cosmos.feegrant.v1beta1.BasicAllowance
  expiration: null
  spend_limit:
  - amount: "1000000"
    denom: uscrt
grantee: secret1q0rth4fu4svxnw63vjd7w74nadzsdp0f23e0uy
granter: secret1tq6y8waegggp4fv2fcxk3zmpsmlfadyc7lsd69
```

This can also be achieved via the following API endpoint where **api\_endpoint** is an API endpoint connected to one of the Archway networks (Testnet or Mainnet). **granter** is the address that granted the allowance and **grantee** is the address that received the allowance:

```
{api_endpoint}/cosmos/feegrant/v1beta1/allowance/{granter}/{grantee}
```
