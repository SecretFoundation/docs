---
description: Avoid data leaks with proper precautions
---

# Padding/Datatype

While everything that happens within a smart contract is encrypted, gas usage in contracts is still recorded publicly on chain. Because of this, unless certain practices are followed, an observer can get some information from transactions by observing variations in gas costs. Specifically, it can reveal things such as how many digits are in a number, or letters in a word (such as a password), due those variations.

## Uint128 vs u128

U128s are not serializable, thus it is necessary to make use of Uint128s in contract inputs and outputs. However, outside of these instances Uint128s should be avoided, and you should convert them to u128s before operating or saving them inside the contract. This is because Uint128 has a variable gas cost depending on its contents and thus is a potential vulnerability for the data leaks we discussed earlier. Because u128 is a constant gas cost, it does not suffer from this issue, thus it should be used whenever possible.
