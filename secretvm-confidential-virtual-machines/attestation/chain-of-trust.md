---
icon: link
---

# Chain of Trust

A **Chain of Trust** is a hierarchical verification process that ensures each layer of a system can be trusted before control is handed off to the next. It creates an **unbroken sequence of trusted components**, starting from the hardware and extending up through the entire software stack.

In SecretVM, this process is anchored in **cryptographic measurements**—hashes of each component—that are stored in **secure hardware registers** such as `MRTD` and `RTMR0–RTMR3`. These measurements are later used to generate an **attestation report**, allowing external verifiers to confirm the VM’s integrity.

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
