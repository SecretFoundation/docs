---
description: >-
  This is intended to guide you in selecting SGX compliant hardware for Secret
  Network.
---

# Hardware Compliance

This is not a comprehensive list of compliant hardware, but rather a guide for what has been verified to work. [This list should include all current CPUs that will work](https://www.intel.com/content/www/us/en/architecture-and-technology/software-guard-extensions-processors.html) this list should include all working CPUs but we cannot guarantee it's always up to date. Also note, a future upgrade in 2025 will see smaller enclaves excluded from the network, which will exclude the E-21xx, E-22xx, and E-23xx lines.

{% hint style="danger" %}
**CPU must support SGX via SPS.** CPUs that only support SGX via Intel ME will not work.
{% endhint %}

## Supported CPUs <a href="#cpus" id="cpus"></a>

The following are confirmed compliant Intel CPUs:

| Brand | Family                | Model                                                                        |
| ----- | --------------------- | ---------------------------------------------------------------------------- |
| Intel | XEON E-Series         | `E-23xxG`                                                                    |
|       | XEON D-1700           | `All-But bios Updates may be infrequent`                                     |
|       | XEON D-2700           | `All-But bios Updates may be infrequent`                                     |
|       | XEON D-1800           | `All-But bios Updates may be infrequent`                                     |
|       | XEON D-2800           | `All-But bios Updates may be infrequent`                                     |
|       | XEON MAX              | `All-But bios Updates may be infrequent`                                     |
|       | XEON 3rd Gen Scalable | `Supported but requires extra configuration for multi-socket configurations` |
|       | XEON 4th Gen Scalable | `Supported`                                                                  |
|       | XEON 5th Gen Scalable | `Supported`                                                                  |
|       | XEON 6th Gen Scalable | `Likely supported but yet to be confirmed`                                   |
| AMD   | \*NOT SUPPORTED\*     |                                                                              |

{% hint style="warning" %}
Only Intel processors support SGX. AMD processors are \*NOT\* supported.
{% endhint %}

## Supported Motherboards

The distinguishing factors of these motherboards is not only that they support Intel SGX, but that they also support DCAP.

{% hint style="info" %}
This is not an exhaustive list of supported motherboards and may stop working if OEMs stop updating the security patches in a timely manner.
{% endhint %}

<table><thead><tr><th width="136">Brand</th><th width="177">Tag</th><th width="265">Versions</th><th>Link</th></tr></thead><tbody><tr><td>Supermicro</td><td><code>X11SCM-F</code></td><td><code>SYS-5019C-M</code>, <code>SYS-5019C-MR</code></td><td><a href="https://www.supermicro.com/products/motherboard/X11/X11SCM-F.cfm">link</a></td></tr><tr><td></td><td><code>X11SCW-F</code></td><td><code>SYS-5019C-WR</code></td><td><a href="https://www.supermicro.com/products/motherboard/X11/X11SCW-F.cfm">link</a></td></tr><tr><td></td><td><code>X11SCZ-F</code></td><td></td><td></td></tr><tr><td></td><td><code>X11SSL-F</code></td><td></td><td></td></tr><tr><td>Dell</td><td><code>Dell R240</code></td><td>BIOS Version <code>2.14.1</code></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td></td><td><code>Dell R350</code></td><td>BIOS version <code>1.7.3</code></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr><tr><td>HP</td><td><code>DL20 G10</code></td><td>BIOS version <code>1.80_07-20-2023</code></td><td></td></tr><tr><td></td><td><code>DL20 G10 +</code></td><td></td><td></td></tr><tr><td>ASUS</td><td><code>ASUS RS100-E10-PI2</code></td><td>BIOS version <code>5601</code></td><td><a href="https://servers.asus.com/products/Servers/Rack-Servers/RS100-E10-PI2">link</a></td></tr><tr><td>Asrock</td><td><del><code>E3C246D4U2-2T</code></del></td><td></td><td><a href="https://www.asrockrack.com/general/productdetail.asp?Model=E3C246D4U2-2T#Specifications">link</a></td></tr><tr><td>GIGABYTE</td><td><del><code>MX33-BS1-V1</code></del></td><td>BIOS version F06</td><td><a href="https://www.gigabyte.com/Enterprise/Server-Motherboard/MX33-BS0-rev-1x">link</a></td></tr></tbody></table>

## Support

If you have any questions or issues, please contact [Node Father](https://t.me/thenodefather)
