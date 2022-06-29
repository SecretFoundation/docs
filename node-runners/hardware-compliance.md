---
description: >-
  This is intended to guide you in selecting SGX compliant hardware for Secret
  Network.
---

# Hardware Compliance

This is not a comprehensive list of compliant hardware, but rather a guide for what has been verified to work. [This list](https://github.com/ayeks/SGX-hardware) is often show as SGX compliant, but it does not discriminate against whether SGX is supported via SPS or IntelME. Only SGX via SPS is supported.

{% hint style="danger" %}
**CPU must support SGX via SPS.** CPUs that only support SGX via IntelME will not work.
{% endhint %}

## Supported CPUs <a href="#cpus" id="cpus"></a>

The following are confirmed compliant Intel CPUs:

| Brand | Family            | Model             |
| ----- | ----------------- | ----------------- |
| Intel | XEON E-Series     | `E-2176G`         |
|       |                   | `E-2178G`         |
|       |                   | `E-2186G`         |
|       |                   | `E-2188G`         |
|       |                   | `E-2276G`         |
|       |                   | `E-2278G`         |
|       |                   | `E-2286G`         |
|       |                   | `E-2288G`         |
|       | ``                | `E-2386G`         |
|       |                   | `E-2388G`         |
|       | XEON Gold-Series  | \*NOT SUPPORTED\* |
| AMD   | \*NOT SUPPORTED\* |                   |

{% hint style="warning" %}
Only Intel processors support SGX. AMD processors are \*NOT\* supported.
{% endhint %}

[List of Processors that Support Intel® Software Guard Extensions](https://www.intel.com/content/www/us/en/support/articles/000028173/processors.html)

## Supported Motherboards

The distinguishing factor of these motherboards is that they support Intel SGX.&#x20;

{% hint style="info" %}
This is not an exhaustive list of supported motherboards. These are simply motherboards proven supported by community members.
{% endhint %}

| Brand      | Tag                  | Versions                       | Link                                                                         |
| ---------- | -------------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| Supermicro | `X11SCM-F`           | `SYS-5019C-M`,  `SYS-5019C-MR` | [link](https://www.supermicro.com/products/motherboard/X11/X11SCM-F.cfm)     |
|            | `X11SCW-F`           | `SYS-5019C-WR`                 | [link](https://www.supermicro.com/products/motherboard/X11/X11SCW-F.cfm)     |
|            | `X11SCZ-F`           |                                |                                                                              |
|            | `X11SSL-F`           |                                |                                                                              |
| Dell       | `Dell R240`          |                                |                                                                              |
| HP         | `HP DL20 G10`        |                                |                                                                              |
| ASUS       | `ASUS RS100-E10-PI2` | BIOS version 4003              | [link](https://servers.asus.com/products/Servers/Rack-Servers/RS100-E10-PI2) |

### **Contributors**

* [FreshSCRT](https://secretnodes.com/secret/chains/secret-4/validators/6AFCF9EB1AC264954C784274A6ABF012D50EB0B6)
* [secretnodes](https://secretnodes.com/secret/chains/secret-4/validators/81EBCE2FFC29820351C086E9EDA6A220098FF41C)
* [chainofsecrets](https://secretnodes.com/secret/chains/secret-4/validators/1B68882AB7CD6BC4CDDD742FC8F3D1FDE31C1A82)
* [Mario](https://secretnodes.com/secret/chains/secret-4/validators/2DD098C8ECAF04DFE31BBC59799C786AC09BF53F)
* [Consensus One](https://secretnodes.com/secret/chains/secret-4/validators/secretvaloper1sa8av4qw3xerr58kwvnm8wvd87zgp36mv6cnyg)
* [Lavender.Five Nodes](https://www.mintscan.io/secret/validators/secretvaloper1t5wtcuwjkdct9qkw2h6m48zu2hectpd6ulmekk)
