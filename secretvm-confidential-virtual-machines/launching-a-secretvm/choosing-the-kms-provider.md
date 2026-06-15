# 🔑 Choosing the KMS provider

When you launch a SecretVM, a **Key Management Service (KMS)** is responsible for managing the keys that protect your VM — the keys used to encrypt your secrets and, for persistent VMs, to unseal persistent storage. SecretVM lets you choose which KMS provider to use.

You select the provider from the **KMS Provider** picker in the encrypted-secrets section of the VM launch form. SecretVM supports three providers:

* **Secret Network Contract KMS** (default)
* **Google KMS**
* **Dstack KMS**

<figure><img src="../../.gitbook/assets/image (57).png" alt=""><figcaption></figcaption></figure>

### Secret Network Contract KMS

The default provider. Keys are managed on-chain by a smart contract on Secret Network, which securely stores the VM's RTMR values and encryption keys. Because key management lives in a Secret Network contract, it inherits the confidentiality and verifiability guarantees of the network itself — keys are released only to a VM whose attestation measurements match.

Choose this when you want fully on-chain, Secret Network–native key management with no external dependencies. The contract source is available on GitHub at [scrtlabs/secret-vm-kms](https://github.com/scrtlabs/secret-vm-kms).

### Google KMS

A Google KMS–managed vault stores your VM's persistence keys outside of the blockchain. Choose this when you prefer to keep key material in Google Cloud's managed key infrastructure — for example to align with an existing Google Cloud setup or compliance requirement.

See Google's [Cloud Key Management Service documentation](https://cloud.google.com/kms/docs) for background on how Google KMS works.

### Dstack KMS

Dstack KMS provides on-chain key management using **Ethereum smart contracts**. Choose this when you want your VM's keys managed on-chain through Ethereum rather than through the Secret Network contract or a Google-managed vault — for example when your workload is part of an Ethereum-based ecosystem.

### Which should I choose?

| Provider                        | Key management                                    | Pick it when                                                                |
| ------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------- |
| **Secret Network Contract KMS** | On-chain, Secret Network smart contract (default) | You want native, fully on-chain key management with no external dependency. |
| **Google KMS**                  | Google Cloud–managed vault, off-chain             | You want keys held in Google Cloud's managed infrastructure.                |
| **Dstack KMS**                  | On-chain, Ethereum smart contracts                | You want on-chain key management within an Ethereum-based ecosystem.        |

If you're not sure, keep the default **Secret Network Contract KMS**.

