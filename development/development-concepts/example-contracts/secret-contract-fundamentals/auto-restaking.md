# Auto Restaking

As of Secret Network V1.7 delegators can autocompound their SCRT Staking rewards using the native Restake feature.

### How it works

Normally SCRT delegated to a validator accrues SCRT rewards every block as a claimable balance. With the autorestaking feature enabled however the SCRT rewards will never be claimable and also never in the claimed balance state.\
\
Every x amount of blocks (currently 1000 set by the chain parameter - `restake_period`) all claimable rewards, on the Restake enabled validators by the user, will be removed from the reward balance and accredited to the staked balance.

{% hint style="info" %}
The code implementation for native Restake is available [here](https://github.com/scrtlabs/cosmos-sdk/pull/254/commits/561168cdaecef522e3d97cbbde1963d01b1be9c7#diff-b37a4184fe282021bf76a51a26ef4f8a34463379f518ca2d80bf822266280b94)
{% endhint %}

Delegators can enable Restaking independently for every validator they stake with using the `set-auto-restaking` command available in [SecretCLI](../../../../infrastructure/resources/secret-cli/restake.md) or on any UI implementing the Secret.JS command.

The feature only activates if the delegator has a balance with the validators larger than `minimum_restake_threshold` which is currently set to 10 `SCRT`

{% hint style="success" %}
Start autocompouding your rewards now at the [Secret Dashboard](https://dash.scrt.network/staking)!
{% endhint %}
