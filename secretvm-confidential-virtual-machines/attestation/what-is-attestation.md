---
icon: comment-question
---

# What is Attestation

#### What is Attestation?

**Attestation** is a cryptographic process that produces **verifiable evidence** about the integrity and identity of a computing environment.

In the context of **Confidential Computing**, attestation allows a third party to verify that:

* The workload is executing inside a **genuine Confidential Virtual Machine (CVM)**.
* The CVM is running on **authentic Trusted Execution Environment (TEE)** hardware (e.g. Intel TDX or AMD SEV).
* The environment is running a **specific, expected software stack**—down to the exact Docker container image.

#### Attestation in SecretVM

Within **SecretVM**, attestation is foundational to trust and decentralization. It ensures that:

* The VM is **built from open-source, independently auditable components** (including the kernel, rootfs, and runtime).
* A particular **Docker container**, defined by the user, is the actual workload running inside the VM.
* No tampering has occurred at any stage of the boot process or workload initialization.

The attestation process produces a **quote**, which is submitted to an **on-chain Key Management System (KMS)** contract on Secret Network. This quote is verified on-chain, allowing **confidential keys to be released** only to trusted, verified workloads.

> In essence, attestation bridges **privacy with verifiability**, making SecretVM workloads secure, trusted, and provably confidential.
