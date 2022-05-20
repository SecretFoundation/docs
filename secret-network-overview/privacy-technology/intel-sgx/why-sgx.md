# Why SGX

Intel SGX is one of the most used and widely available implementations of Trusted Execution Environments (TEEs). We have selected this technology for the initial version of the Secret Network for two main reasons:

1. Usability: SGX is more performant and more flexible than other solutions for privacy-preserving computation. The Secret Network is building a platform for decentralized, general purpose private computation. This requires a privacy solution that can enable a wide-range of use cases. It also requires computations to be on par, performance-wise, with non-privacy preserving computation, so that speed does not limit application usability.
2. Security: SGX is one of the most widely adopted technologies for TEEs, it is also battle-hardened. Attacks are often theoretical, executed in laboratory settings, and are rapidly addressed by Intel. Many high-value targets exist which have not been compromised. No privacy solution is 100% secure, but we believe the security guarantees provided by Intel SGX are adequate for a wide range of use-cases.
