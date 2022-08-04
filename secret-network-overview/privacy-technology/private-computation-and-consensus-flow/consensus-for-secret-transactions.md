# Consensus For Secret Transactions

The following process is based on how Tendermint works to reach consensus in a standard app chain but with specificity related to the privacy features of Secret Network:&#x20;

1. Developers write and deploy Secret Contracts which are executed by the validators&#x20;
2. Users submit transactions to the mempool — which can include encrypted data inputs&#x20;
3. Validators receive encrypted data from users and execute the Secret Contract&#x20;
4. During Secret Contract execution:&#x20;
   * Encrypted inputs are decrypted inside a Trusted Execution Environment&#x20;
   * Requested functions are executed inside a Trusted Execution Environment&#x20;
   * Read/write state from Tendermint can be performed (state is always encrypted when at rest, and is only decrypted within the Trusted Execution Environment)&#x20;
   * Outputs are encrypted&#x20;
5. The block-proposing validator proposes a block containing the encrypted outputs and updated encrypted state&#x20;
6. At least 2/3 of participating validators achieve consensus on the encrypted output and state
7. The encrypted output and state is committed on-chain

![](<../../../.gitbook/assets/image (3) (2).png>)
