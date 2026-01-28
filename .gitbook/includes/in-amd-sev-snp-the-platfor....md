---
title: In AMD SEV-SNP, the Platfor...
---

> In AMD SEV-SNP, the Platform Security Processor (PSP) running SNP firmware is the hardware root of trust and performs the VM measurement. At guest launch, it computes a single cumulative measurement over the initial guest state, which includes the guest memory pages populated by the hypervisor at launch time (containing the firmware, kernel, kernel command line, initramfs, and any preloaded root filesystem), together with the guest policy, CPU state, and VM configuration. This measurement is immutable after launch and is reported as the measurement field in the SNP attestation report; any change to the initial image or policy results in a different measurement.
