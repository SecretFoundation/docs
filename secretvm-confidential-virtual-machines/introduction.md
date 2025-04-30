---
description: >-
  SecretVM is Secret Network's solution for creating and running Confidential
  Virtual Machines.
hidden: true
---

# 🤝 Introduction

### Secret Network Confidential Virtual Machines (SecretVM)

**SecretVM** is the Confidential Virtual Machine framework of Secret Network, allowing developers to easily deploy and run secure workloads within Trusted Execution Environments (TEEs). It brings the core benefits of smart contracts—**verifiability**, **trustlessness**, and **data confidentiality**—to **general-purpose applications**, without sacrificing flexibility or performance. With advancements in TEEs—such as **Intel® Trust Domain Extensions (TDX)** and **AMD Secure Encrypted Virtualization (SEV)**—arbitrary workloads can now be executed securely and verifiably in a decentralized setting.

#### 🔐 Key Benefits

* **Data Confidentiality**\
  TEEs ensure that even the owner of the physical hardware cannot access the data inside the VM.
* **Remote Attestation**\
  Every workload can be cryptographically verified to ensure it's running trusted code in a secure enclave.
* **Language & Stack Agnostic**\
  SecretVM supports Docker containers, allowing you to deploy applications in any language or framework.
* **Low Overhead**

#### 💡 Use Cases

Confidential VMs are ideal for a wide variety of privacy-preserving use cases, including:

* **AI & Machine Learning**
  * Secure LLM inference, fine-tuning, and training
  * Deployment of autonomous AI agents
  * Confidential multi-agent coordination (e.g., MCP servers)
* **Finance & DeFi**
  * Encrypted trading algorithms
  * Confidential portfolio management
  * Private credit scoring systems
* **Healthcare & Biomedical**
  * Privacy-preserving medical data processing
  * Federated learning for diagnostic models
  * HIPAA-compliant AI applications
* **General Confidential Workloads**\
  Any computation that benefits from privacy, trustlessness, and verifiability can run on SecretVM—without constraints on tooling or performance.

{% hint style="success" %}
**SecretVM** is currently under active development. As we progress, ongoing updates and enhancements are expected in the coming months.
{% endhint %}
