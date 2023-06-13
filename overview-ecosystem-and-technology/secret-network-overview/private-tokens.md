# Private Tokens

## SNIP-20 - Private Tokens On Secret Network

Secret Network’s programmable privacy enables non-private tokens to be wrapped into their private and fungible equivalent through the Secret Network Improvement Proposals 2020 ( known as SNIP-20 standard), thereby providing complete confidentiality and anonymity through viewing keys via Secret contract. For example, SCRT can be wrapped into sSCRT(pronounced as secretSCRT) through SNIP-20 standard. Hence, sSCRT is a privacy-preserving and fungible equivalent of SCRT. Whenever you transact using a wrapped token such as sSCRT, the transaction remains private and nobody knows whether you send/receive sSCRT to/from whom.

All native tokens like SHD, SEFI, ALTER, SIENNA are SNIP-20s and have privacy by default, all coins and tokens bridged from other networks like sATOM, sETH and sBNB are also private by default.

{% hint style="success" %}
Secret Tokens really are the backbone behind the programmable privacy of Secret Network and have various different use-cases.\
\
Learn more about Secret Tokens on the [Secret Network website.](https://scrt.network/about/secret-tokens-bridges)
{% endhint %}

### Example Of SNIP-20 Privacy

If wallet A sends 100 sSCRT to wallet B this will happen:

* Block explorer denotes that wallet A interacted with the sSCRT smart contract (It is not known whether this was a send, buy of NFT, viewing key etc. Amount of tokens is also unknown)
* Wallet B will NOT have an interaction listed on chain (aka on the block explorer)
* Wallet B can use their viewing key to decrypt the receiving transaction so will see the address of the sender and the amount they got.

{% hint style="info" %}
Want to learn about the Tech enabling Secret Tokens? Check out the [SNIP-20 reference implementation](https://github.com/scrtlabs/snip20-reference-impl) or the section on [permissioned viewing ](../../development/development-concepts/permissioned-viewing/)/[ access control](../../development/secret-contract-fundamentals/access-control/) .
{% endhint %}
