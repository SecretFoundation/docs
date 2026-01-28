---
icon: pencil
---

# Intel TDX Attestation Report - Key Fields

A **TDX Attestation Report** contains several cryptographic measurements that prove the integrity of the Confidential Virtual Machine. These values are generated during the boot process and serve as a **verifiable fingerprint** of the system state.

Below are the **key fields** that validate the integrity of a SecretVM instance based on Intel TDX:

| Field                                                                   | Description                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <p><strong>MRTD</strong><br>(Measurement Register for Trust Domain)</p> | Contains the **cryptographic hash of the firmware** running in the TEE. This is measured within the **SEAM (Secure Arbitration Mode)**.                                                                                                                                                                                                                         |
| **RTMR0**                                                               | <p>Measures firmware-related configuration elements such as:<br>- Configuration Firmware Volume (CFV)<br>- Trusted Domain Hand-Off Blocks (TDHOB)<br>- ACPI tables and more.  Refer to <a href="https://cdrdv2-public.intel.com/733585/tdx-virtual-firmware-design-guide-rev-004-20231206.pdf">Intel TDX Virtual Firmware Design Guide</a> for full details</p> |
| **RTMR1**                                                               | Contains the measurement (hash) of the **Linux kernel** used by the SecretVM.                                                                                                                                                                                                                                                                                   |
| **RTMR2**                                                               | Measures the **kernel command line** and the **Initial RAM Filesystem (initramfs)**.                                                                                                                                                                                                                                                                            |
| **RTMR3**                                                               | Measures the **root file system** and the `docker-compose.yaml` file that defines the container workload.                                                                                                                                                                                                                                                       |
| **reportdata**                                                          | <p>A special field that concatenates:<br>- The <strong>fingerprint of the TLS certificate</strong> generated on the VM<br>- The <strong>nonce of the GPU Attestation Quote</strong> (for GPU-enabled machines only).</p>                                                                                                                                        |

***

These measurements establish a **chain of trust** between each software layer of the VM—from firmware to container runtime—enabling secure and verifiable confidential workloads.

The architectural diagram below illustrates how each of these measurements maps to specific components of the SecretVM stack:

<figure><img src="../../.gitbook/assets/image (19).png" alt=""><figcaption></figcaption></figure>
