# VPS/Bare-Metal Compliance

## SGX Compliance for VPS options and the Secret Network <a href="#information-regarding-sgx-compliance-for-vps-options-and-the-secret-network" id="information-regarding-sgx-compliance-for-vps-options-and-the-secret-network"></a>

This is intended to guide you in selecting SGX-compliant VPS options for the Secret Network.

{% hint style="info" %}
When renting a compliant bare metal machine from a VPS provider, ensure you do not accept any chassis or CPU substitutes they propose, unless those substitutes are on the [Hardware Compliance list](../hardware-compliance.md).
{% endhint %}

All cost estimates are based on the following recommendations:

* Processor: E-series rather than E3 (due to age)
* SSD: 512GB+
* RAM: 64GB+

{% hint style="info" %}
Just because a VPS is cheaper it does not make it better.
{% endhint %}

| VPS Provider                                                                                                                                                                                                                         | Cost/month        | Setup Instructions               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- | -------------------------------- |
| [**Microsoft Azure**](https://azure.microsoft.com/en-us/solutions/confidential-compute/#overview)                                                                                                                                    | TBD               | [Here](microsoft-azure-setup.md) |
| [**Psychz**](https://www.psychz.net/dashboard/client/web/order/dedicated-server?processor=\&processorBaseFreq=\&numberOfCpu=7391\&cpuCores=\&location=)                                                                              | 144               | [Here](psychz-setup.md)          |
| [**nForce**](https://www.nforce.com/customserver)                                                                                                                                                                                    | 95                | [Here](nforce-setup.md)          |
| [**Leaseweb**](https://www.leaseweb.com/dedicated-servers/build-your-own)                                                                                                                                                            | 89                | [Here](leaseweb-setup.md)        |
| [**Vultr**](https://www.vultr.com/products/bare-metal/)                                                                                                                                                                              | 185               | [Here](vultr-setup.md)           |
| [**PhoenixNap**](https://admin.phoenixnap.com/wap-pncpadmin-shell/orderForm?bmbPath=/order-management/order-form?currencyCode=usd)                                                                                                   | 210               | [Here](phoenixnap-setup.md)      |
| [**OVHCloud**](https://www.ovhcloud.com/en/bare-metal/rise/rise-3/)                                                                                                                                                                  | 144               | [Here](ovhcloud-setup.md)        |
| Hetzner                                                                                                                                                                                                                              | \*NOT SUPPORTED\* |                                  |
| [**IPAX**](../../../../node-runners/vps-compliance/\[https:/azure.microsoft.com/en-us/solutions/confidential-compute/#overview]\(https://www.ipax.at/rootserver-mieten/dedicated-server-mieten/leistungsstarke-dedizierte-server/\)) | 160               | X1 (Professional Line)           |
