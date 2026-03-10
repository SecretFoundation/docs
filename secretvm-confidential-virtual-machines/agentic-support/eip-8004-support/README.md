# 📃 EIP-8004 Support

### Overview

When creating a SecretVM, you can enable Register on ERC-8004 under Agentic Settings.

Once enabled, SecretVM lets you attach agent metadata to the VM and register it onchain as an ERC-8004 agent. This makes the VM discoverable as an agent and allows clients to inspect its declared services and trust properties.

SecretVM automatically registers two built-in services:

* teequote — exposes the VM’s attestation quote
* workload — exposes the workload manifest (docker-compose.yaml)

These default services are specific to SecretVM and are intended to make each registered agent both discoverable and verifiable from the start.



Read more about the ERC-8004 standard [here](https://eips.ethereum.org/EIPS/eip-8004)

