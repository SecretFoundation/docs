# Hardware Compliance

## Hardware Compliance <a href="#hardware-compliance" id="hardware-compliance"></a>

#### [#](https://docs.scrt.network/node-guides/hardware-compliance.html#information-regarding-sgx-compliance-and-the-secret-network)Information Regarding SGX Compliance and the Secret Network <a href="#information-regarding-sgx-compliance-and-the-secret-network" id="information-regarding-sgx-compliance-and-the-secret-network"></a>

This is intended to guide you in selecting SGX compliant hardware for the Secret Network mainnet.

#### [#](https://docs.scrt.network/node-guides/hardware-compliance.html#cpus)CPUs <a href="#cpus" id="cpus"></a>

Intel XEON

Verified compliant processors:

* CPU: `E-2276G`, `E-2278G`, `E-2286G`, `E-2288G`, `E-2176G`, `E-2178G`, `E-2186G`, `E-2188G`

Verified non-compliant processors:

* CPU: all 3rd generation `E-23xxG` processors are confirmed not working.

IMPORTANT NOTE: **CPU must support SGX via SPS.** CPUs that only support SGX via intelME will not work.

[List of Processors that Support Intel® Software Guard Extensions](https://www.intel.com/content/www/us/en/support/articles/000028173/processors.html)

[**#**](https://docs.scrt.network/node-guides/hardware-compliance.html#supermicro-information)**Supermicro Information**

Supermicro builds several boards that are mainnet compliant. Here is a current working list, as of May 31, 2021.

1. Motherboard : `X11SCM-F`

* [X11SCM-F Motherboard link](https://www.supermicro.com/products/motherboard/X11/X11SCM-F.cfm)
* Barebone version SYS-5019C-M [SYS-5019C-M link](https://www.supermicro.com/en/products/system/1U/5019/SYS-5019C-M.cfm).

1. Motherboard : `X11SCM-F`

* [X11SCM-F Motherboard link](https://www.supermicro.com/products/motherboard/X11/X11SCM-F.cfm)
* Barebone version `SYS-5019C-MR` [SYS-5019C-MR link](https://www.supermicro.com/en/products/system/1U/5019/SYS-5019C-MR.cfm)

1. Motherboard : `X11SCW-F`

* [X11SCW-F Motherboard link](https://www.supermicro.com/products/motherboard/X11/X11SCW-F.cfm)
* Barebone version `SYS-5019C-WR` [SYS-5019C-WR link](https://www.supermicro.com/en/products/system/1U/5019/SYS-5019C-WR.cfm)

1. Motherboard `X11SCZ-F`
2. Motherboard `X11SSL-F`

[**#**](https://docs.scrt.network/node-guides/hardware-compliance.html#dell-information)**Dell Information**

1. Build `Dell R240`

[**#**](https://docs.scrt.network/node-guides/hardware-compliance.html#hp-information)**HP Information**

1. Build `HP DL20 G10`

[**#**](https://docs.scrt.network/node-guides/hardware-compliance.html#asus-information)**ASUS Information**

1. `ASUS RS100-E10-PI2`

* \[RS100-E10-PI2 Link] (https://servers.asus.com/products/Servers/Rack-Servers/RS100-E10-PI2)
* Requires BIOS version 4003 - ASUS Support responds in under 24 hours with a download link

[**#**](https://docs.scrt.network/node-guides/hardware-compliance.html#contributors)**Contributors**

* [FreshSCRT](https://secretnodes.com/secret/chains/secret-4/validators/6AFCF9EB1AC264954C784274A6ABF012D50EB0B6)
* [secretnodes](https://secretnodes.com/secret/chains/secret-4/validators/81EBCE2FFC29820351C086E9EDA6A220098FF41C)
* [chainofsecrets](https://secretnodes.com/secret/chains/secret-4/validators/1B68882AB7CD6BC4CDDD742FC8F3D1FDE31C1A82)
* [Mario](https://secretnodes.com/secret/chains/secret-4/validators/2DD098C8ECAF04DFE31BBC59799C786AC09BF53F)
* [Consensus One](https://secretnodes.com/secret/chains/secret-4/validators/secretvaloper1sa8av4qw3xerr58kwvnm8wvd87zgp36mv6cnyg)
