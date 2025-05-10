---
description: The Anatomy of a Secret Virtual Machine.
---

# 🏗️ Architecture

The architecture of **SecretVM** brings together multiple components to ensure **confidentiality, integrity, and verifiability** of every workload. The diagram below illustrates the full stack, from host machine firmware to the guest container, and how the **chain of trust** is preserved.

<figure><img src="../.gitbook/assets/image (17).png" alt=""><figcaption><p>SecretVM Architecture</p></figcaption></figure>

The key artiacts (shown in the bottom row) are as follows:

1. **Open Virtual Machine Firmware** (OVMF) image - the UEFI firmware that initializes the VM, manages the secure boot process, and offers an interface to interact with the hardware
2. **Initial RAM File System** (Initramfs) - a temporary root file system that takes control before the permanent file system is loaded. In SecretVM, the main role of initramfs is to perform measurements of the Rootfs and of the Docker Container, extending the chain of trust
3. **Kernel** - the Linux kernel to be used by the Virtual Machine
4. **Rootfs** - an image containing a Poky Linux operating system, with all the necessary drivers, including NVIDIA GPU drivers,  and the Secret CVM Runtime installed.

{% hint style="info" %}
All these base artifacts are built using **reproducible build pipelines** and reused across SecretVM deployments to ensure consistency, transparency, and auditability.
{% endhint %}

#### Workload-Specific Components

The actual application logic and state for each Confidential VM is defined by two customizable components:

**Docker Compose File**

* Describes the **identity, configuration, and dependencies** of the guest container.
* This is the user-defined workload that will run securely within the Confidential VM.

**Encrypted File System Image**

* Mounted by the guest container as its persistent storage.
* Fully encrypted to prevent host-level access or leakage of sensitive data.
* Encryption keys are retrieved securely from the **on-chain KMS contract** via attestation.

{% hint style="info" %}
The source code of those artifacts, and the repeatable build scripts are available in the secret-vm-build repository [here](https://github.com/scrtlabs/secret-vm-build).
{% endhint %}

#### On-Chain Key Management System (KMS)

SecretVM leverages a decentralized **Key Management System (KMS)**, implemented as a smart contract on **Secret Network**.

* When the VM boots, the **Attestation Service** produces a cryptographic quote representing the identity and integrity of the TEE.
* The **SecretVM Runtime** submits this quote to the on-chain KMS contract to retrieve the **VM’s encryption key**.
* The quote is **validated on-chain**, ensuring only authorized and untampered workloads gain access to sensitive keys.

{% hint style="info" %}
🔗 The source code for the KMS contract is [available on GitHub](https://github.com/scrtlabs/secret-vm-kms).
{% endhint %}
