# TPS and scalability

### Max gas per block

As explained in the[ Gas and fee](gas-fee-usage.md) section Secret computational load is denominated in `gas`. The amount of gas that can be spend at every block is capped via the `max_gas` block parameter. This cap is currently set at 6000000 (6 million) `gas` meaning a block will never contain more computational load what is represented by 6 million gas. The computational load per gas unit is calculated and then denominated in the chain binary (cosmos SDK - Enclave functions).

### Expected block time

The `max_gas` parameter is chosen in such a way that validators can ensure they process the full computational load within the target block execution time (\~6s). If this computation and expected blocktime don't align the blocks will become longer and longer as they await 66% of voting power to sign the block. When block time increases the TPS of the blockchain drastically decreases only complicating the situation further.

### Transactions per Second



### Encryption overhead



### Scalabillity

Short term:\
\
Long term:





