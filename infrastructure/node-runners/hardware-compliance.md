---
description: >-
  This is intended to guide you in selecting SGX compliant hardware for Secret
  Network.
---

# Hardware Compliance

This is not a comprehensive list of compliant hardware, but rather a guide for what has been verified to work. [This list](https://github.com/ayeks/SGX-hardware) is often show as SGX compliant, but it does not discriminate against whether SGX is supported via SPS or Intel ME. Only SGX via SPS is supported.

{% hint style="danger" %}
**CPU must support SGX via SPS.** CPUs that only support SGX via Intel ME will not work.
{% endhint %}

## Supported CPUs <a href="#cpus" id="cpus"></a>

The following are confirmed compliant Intel CPUs:

| Brand | Family            | Model             |
| ----- | ----------------- | ----------------- |
| Intel | XEON E-Series     | `E-2174G`         |
|       |                   | `E-2176G`         |
|       |                   | `E-2178G`         |
|       |                   | `E-2186G`         |
|       |                   | `E-2188G`         |
|       |                   | `E-2274G`         |
|       |                   | `E-2276G`         |
|       |                   | `E-2278G`         |
|       |                   | `E-2286G`         |
|       |                   | `E-2288G`         |
|       |                   | `E-2334G`         |
|       |                   | `E-2386G`         |
|       |                   | `E-2388G`         |
|       | XEON Gold-Series  | \*NOT SUPPORTED\* |
| AMD   | \*NOT SUPPORTED\* |                   |

{% hint style="warning" %}
Only Intel processors support SGX. AMD processors are \*NOT\* supported.
{% endhint %}

[List of Processors that Support Intel® Software Guard Extensions](https://www.intel.com/content/www/us/en/support/articles/000028173/processors.html)

## Supported Motherboards

The distinguishing factor of these motherboards is that they support Intel SGX.

{% hint style="info" %}
This is not an exhaustive list of supported motherboards. These are simply motherboards proven supported by community members.
{% endhint %}

<table><thead><tr><th>Brand</th><th width="177">Tag</th><th width="265">Versions</th><th>Link</th></tr></thead><tbody><tr><td>Supermicro</td><td><code>X11SCM-F</code></td><td><code>SYS-5019C-M</code>, <code>SYS-5019C-MR</code></td><td><a href="https://www.supermicro.com/products/motherboard/X11/X11SCM-F.cfm">link</a></td></tr><tr><td></td><td><code>X11SCW-F</code></td><td><code>SYS-5019C-WR</code></td><td><a href="https://www.supermicro.com/products/motherboard/X11/X11SCW-F.cfm">link</a></td></tr><tr><td></td><td><code>X11SCZ-F</code></td><td></td><td></td></tr><tr><td></td><td><code>X11SSL-F</code></td><td></td><td></td></tr><tr><td>Dell</td><td><code>Dell R240</code></td><td>BIOS Version <code>2.14.1</code></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td><code>Dell R350</code></td><td>BIOS version <code>1.7.3</code></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td>HP</td><td><code>DL20 G10</code></td><td>BIOS version <code>1.80_07-20-2023</code></td><td></td></tr><tr><td></td><td><code>DL20 G10 +</code></td><td></td><td></td></tr><tr><td>ASUS</td><td><code>ASUS RS100-E10-PI2</code></td><td>BIOS version <code>5601</code></td><td><a href="https://servers.asus.com/products/Servers/Rack-Servers/RS100-E10-PI2">link</a></td></tr><tr><td>Asrock</td><td><del><code>E3C246D4U2-2T</code></del></td><td></td><td><a href="https://www.asrockrack.com/general/productdetail.asp?Model=E3C246D4U2-2T#Specifications">link</a></td></tr><tr><td>GIGABYTE</td><td><del><code>MX33-BS1-V1</code></del></td><td>BIOS version F06</td><td><a href="https://www.gigabyte.com/Enterprise/Server-Motherboard/MX33-BS0-rev-1x">link</a></td></tr></tbody></table>

### **Contributors**

* [FreshSCRT](https://secretnodes.com/secret/chains/secret-4/validators/6AFCF9EB1AC264954C784274A6ABF012D50EB0B6)
* [chainofsecrets](https://secretnodes.com/secret/chains/secret-4/validators/1B68882AB7CD6BC4CDDD742FC8F3D1FDE31C1A82)
* [Mario](https://secretnodes.com/secret/chains/secret-4/validators/2DD098C8ECAF04DFE31BBC59799C786AC09BF53F)
* [Consensus One](https://secretnodes.com/secret/chains/secret-4/validators/secretvaloper1sa8av4qw3xerr58kwvnm8wvd87zgp36mv6cnyg)
* [Lavender.Five Nodes](https://www.mintscan.io/secret/validators/secretvaloper1t5wtcuwjkdct9qkw2h6m48zu2hectpd6ulmekk)
* [danku\_zone w/ DAIC](https://www.mintscan.io/secret/validators/secretvaloper1gkk02na77t83dvmf9vd7lajptejaqkyug62h56)
