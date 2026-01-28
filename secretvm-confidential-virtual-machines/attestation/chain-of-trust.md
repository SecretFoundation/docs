---
description: This page describes how the chain of trust works on SecretVMs
icon: link
---

# Chain of Trust

A **Chain of Trust** is a hierarchical verification process that ensures each layer of a system can be trusted before control is handed off to the next. It creates an **unbroken sequence of trusted components**, starting from the hardware and extending up through the entire software stack.

The Chain of Trust process is anchored in **cryptographic measurements**—hashes of each various components of the system, starting from the Firwmware and going up to the actual guest workload.

Each component is measured **before** the control is passed to it, creating the chain of trust.

### SecretVMs based on Intel TDX

In a TDX-powered SecretVM, that are stored in **secure hardware registers** such as `MRTD` and `RTMR0–RTMR3`. These measurements are later used to generate an **attestation report**, allowing external verifiers to confirm the VM’s integrity.

<figure><img src="../../.gitbook/assets/TDX Attestation - Chain of Trust-2025-04-14-211234.png" alt=""><figcaption></figcaption></figure>

#### SecretVM Boot-Time Chain of Trust

The following sequence outlines how SecretVM establishes trust, step by step:

1. [**SEAM Module**](https://app.gitbook.com/o/-MlH37YRwVXTVUXFvf5t/s/gF1LuzRcRVxJ2tTkh299/~/changes/943/secretvm-confidential-virtual-machines/glossary#seam) **(Secure Arbitration Mode)**
   * Measures the firmware into the **MRTD** register.
   * Transfers control to the **firmware layer**.
2. **Firmware**
   * Measures key system configurations into **RTMR0**, including:
     * Configuration Firmware Volume (CFV)
     * Trusted Domain Hand-Off Blocks (TDHOB)
     * ACPI tables
   * Measures the **OS kernel** into **RTMR1**.
   * Measures the **initramfs** (Initial RAM Filesystem) and kernel command line into **RTMR2**.
   * Transfers control to the **initramfs**.
3. **Initramfs**
   * Runs an initialization script that:
     * Measures the **Root File System (RootFS)** and `docker-compose.yaml` into **RTMR3**.
   * Transfers control to the **RootFS**.
4. **Root File System**
   * Launches startup services for SecretVM, including:
     * Generating (or restoring) a **TLS certificate** for the machine.
     * Producing a **GPU attestation quote** if a GPU is attached.
     * Storing the **GPU nonce** and **TLS certificate fingerprint** into the `reportdata` field of the Attestation Report.
     * Starting the **Attestation Service**.
     * Launching the **containerized workload** defined by `docker-compose.yaml`.

This layered verification process ensures that **every stage of SecretVM’s initialization** is cryptographically measured, trusted, and verifiable. The final attestation report reflects the **complete trust state of the VM**, enabling secure key provisioning and external validation.

### SecretVM based on AMD SEV-SNP

In addition to Intel TDX–based SecretVMs, SecretVM also supports [AMD](chatgpt://generic-entity?number=0) SEV-SNP, which provides a different but equally strong chain-of-trust model.

#### Single-measurement trust model

Unlike [Intel](chatgpt://generic-entity?number=1) TDX, which uses multiple runtime measurement registers (RTMRs), AMD SEV-SNP relies on a single cumulative measurement, available in the **measurement** field.

In AMD SEV-SNP, the Platform Security Processor (PSP) running SNP firmware is the hardware root of trust and performs the VM measurement. At guest launch, it computes a single cumulative measurement over the initial guest state, which includes the guest memory pages populated by the hypervisor at launch time (containing the firmware, kernel, kernel command line, initramfs, and any preloaded root filesystem), together with the guest policy, CPU state, and VM configuration. This measurement is immutable after launch and is reported as the measurement field in the SNP attestation report; any change to the initial image or policy results in a different measurement.

#### Measurement sequence

During VM launch and boot, the following components are measured in order:

1. First, Firmware and VM configuration
2. Bootloader and kernel
3. Initramfs
4. Root filesystem
5. Workload definition (docker-compose configuration)

Each stage _extends_ the same measurement hash.



A verifier compares this measurement against an expected value before trusting the VM or releasing secrets.
