# Consensus For Secret Transactions

The following process is based on how Tendermint works to reach consensus in a standard app chain but with specificity related to the privacy features of Secret Network. Please note that Secret Network is permissionless, validators and nodes can join the network at any time. For more information on how Encrypted data is handled read: [Steps of a Private transaction](detailed-steps-of-a-private-transaction.md).

1. Developers write and deploy Secret Contracts which are executed by the validators, the binary for these contracts is public.
2. Users submit transactions to the mempool — which can include encrypted data inputs
3. Validators receive encrypted data from users and execute the Secret Contract
4. During Secret Contract execution:
   * Encrypted inputs are decrypted inside a Trusted Execution Environment
   * Requested functions are executed inside a Trusted Execution Environment
   * Read/write state from Tendermint can be performed (state is always encrypted when at rest, and is only decrypted within the Trusted Execution Environment)
   * Outputs are encrypted
5. The block-proposing validator proposes a block containing the encrypted outputs and updated encrypted state
6. At least 2/3 of participating validators achieve consensus on the encrypted output and state following Tendermint BFT
7. The encrypted output and state is committed on-chain to the specific contract

![](<../../.gitbook/assets/image (3) (2).png>)

**Want to learn about Secret transactions in a video format instead? Check out the last part of the Secret Network techstack video series.**

{% embed url="https://www.youtube.com/watch?index=5&list=PLL1JDiTNCUAW_jGFyBjOFAzzTw3zKb3TM&v=IKd7mOY3DQs" %}
