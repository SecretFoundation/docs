# VPS Compliance

#### Information Regarding SGX Compliance for VPS options and the Secret Network <a href="#information-regarding-sgx-compliance-for-vps-options-and-the-secret-network" id="information-regarding-sgx-compliance-for-vps-options-and-the-secret-network"></a>

This is intended to guide you in selecting SGX compliant VPS options for the Secret Network.

{% hint style="info" %}
When renting a compliant bare metal machine from a VPS provider, ensure you do not accept any chassis or CPU substitutes they propose, unless those substitutes are on the [Hardware Compliance list](../hardware-compliance.md).
{% endhint %}

```
Note all cost estimates are based this off the following recommendations as of September 2021:
- Processor: E-series rather than E3 (due to age)
- SSD: 1TB+
- RAM: 32GB+

Just because a VPS is cheaper does *NOT* necessarily make it better.
```

| VPS Provider                                                                                                                                                    | Cost/mo | Setup Instructions               |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------- |
| ****[**Microsoft Azure**](https://azure.microsoft.com/en-us/solutions/confidential-compute/#overview)****                                                       | TBD     | [here](microsoft-azure-setup.md) |
| ****[**Psychz**](https://www.psychz.net/dashboard/client/web/order/dedicated-server?processor=\&processorBaseFreq=\&numberOfCpu=7391\&cpuCores=\&location=)**** | 144     | [here](psychz-setup.md)          |
| ****[**nForce**](https://www.nforce.com/customserver)****                                                                                                       | 95      | [here](nforce-setup.md)          |
| ****[**Leaseweb**](https://www.leaseweb.com/dedicated-servers/build-your-own)****                                                                               | 89      | [here](leaseweb-setup.md)        |
| ****[**Vultr**](https://www.vultr.com/products/bare-metal/)****                                                                                                 | 185     | [here](vultr-setup.md)           |
| ****[**PhoenixNap**](https://admin.phoenixnap.com/wap-pncpadmin-shell/orderForm?bmbPath=/order-management/order-form?currencyCode=usd)****                      | 210     | [here](phoenixnap-setup.md)      |
| ****[**OVHCloud**](https://www.ovhcloud.com/en/bare-metal/rise/rise-3/)****                                                                                     | 144     | [here](ovhcloud-setup.md)        |

### **Contributors**

* [Schultzie from Lavender.Five Nodes](https://secretnodes.com/secret/chains/secret-3/validators/84BC2C72491187FAB144F628166E10D592786616)
* [Eddie from FreshSCRTs](https://secretnodes.com/secret/chains/secret-3/validators/6AFCF9EB1AC264954C784274A6ABF012D50EB0B6)
* [Ian from secretnodes.com](https://secretnodes.com/secret/chains/secret-3/validators/81EBCE2FFC29820351C086E9EDA6A220098FF41C)
* [Mohammed from securesecrets.org](https://secretnodes.com/secret/chains/secret-3/validators/45521282C12E0EC1691495FCA714947DCA072745)
