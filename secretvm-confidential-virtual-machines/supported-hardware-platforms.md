---
icon: server
---

# Supported Hardware Platforms

SecretVM currently supports two leading Confidential Computing platforms for CPU instances, allowing the developers maximum flexibility.

*   **Intel TDX**&#x20;

    Intel TDX (Trust Domain Extensions)is a confidential-computing extension of Intel’s SGX lineage that brings hardware-enforced isolation and attestation to full virtual machines; it was introduced with 4th-generation Intel Xeon Scalable (“Sapphire Rapids”) processors. Intel TDX was publicly introduced in 2021, and was first widely available in 2023

    Docs: [https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html)
*   **AMD SEV-SNP**&#x20;

    AMD SEV-SNP (Secure Encrypted Virtualization – Secure Nested Paging) is AMD’s confidential-computing technology for full virtual machines, adding memory encryption _and integrity protection_ against malicious hypervisors; it is available on AMD EPYC “Milan” and newer processors and widely deployed in production clouds. AMD SEV-SNP was announced in 2020 and first shipped with AMD EPYC "Milan" CPUs in 2021. AMD SEV-SNP is an exension of earlier AMD SEV technology, introduced in 2016 and first available with AMD EPYC "Naples" in 2017.

    Docs: [https://www.amd.com/en/developer/sev.html](https://www.amd.com/en/developer/sev.html)

    SNP spec: [https://www.amd.com/system/files/TechDocs/56860.pdf](https://www.amd.com/system/files/TechDocs/56860.pdf)



SecretVM also supports Confidential Computing on GPUs using NVIDIA Confidential Computing, currently available on the following devices:

* H100 (SXM & PCIe)
* H200
* GH200 Grace Hopper Superchip

NVIDIA Confidential Computing docs are available here: [https://www.nvidia.com/en-eu/data-center/solutions/confidential-computing/](https://www.nvidia.com/en-eu/data-center/solutions/confidential-computing/)

Currently, NVIDIA Confidential Computing is only available with Intel TDX CPUs. Adding support for AMD  is planned for Q2 2026.
