# Microsoft Azure Setup

Website: [Microsoft Azure](https://azure.microsoft.com/en-us/solutions/confidential-compute/)

{% hint style="warning" %}
Using Azure is not recommened anymore as of now because of higher pricing than bare-metals and not enough RAM (32GB is possible to use, but not recommended anymore).
{% endhint %}

When renting a compliant bare metal machine from a VPS provider, ensure you do not accept any chassis or CPU substitutes they propose, unless those substitutes are on the [Hardware Compliance list](../hardware-compliance.md).

Microsoft Azure is tested and confirmed working by the Secret Network Community.

To setup a node on Microsoft Azure do the following.

1. Visit the Azure Confidential Compute page [here](https://azure.microsoft.com/en-us/solutions/confidential-compute/) and click "Get Started"
2. Click "Get it now" on the following page and signup for a Microsoft Azure Account.
3. While provisioning your VPS be sure to have at least 500GB of premium SSD storage available.
4. After your confidential compute VM is deployed, continue with the node setup guide [starting here.](../../node-setup/)
