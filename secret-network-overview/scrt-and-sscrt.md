---
description: Learn about the SCRT coin, native to the Secret Network
---

# The SCRT coin

## SCRT - The Native Coin Of Secret Network

SCRT (pronounced as “secret”) is the native coin of Secret Network. It is denoted by an 𝕊 enclosed within a circle, symbolizing the programmable privacy features of Secret Network. SCRT is similar to other coins, such as BTC and ETH, because it's used to pay gas fees to perform computations on Secret Network.&#x20;

There are many use cases for SCRT such as Payment of transactional and computational fees such as gas fees, staking with validators to secure the underlying network and earn inflation rewards, participation in community governance which helps to shape the future of the network, and so on.&#x20;

### SCRT is public

The SCRT coin is a public asset on-chain, interactions with the coin are public-by-default (eg. balance, receiver etc).&#x20;

This means interactions on the network that require SCRT gas like: Viewing key generation, NFT minting, AMM swaps and more will all show as interactions on chain. These interactions can sill have private metadata thanks to the design of Secret Tokens, but the interaction is publicly verifiable on-chain.

### SCRT utillity

#### Governance&#x20;

Voting on Secret Network is powered by the SCRT token, every staked SCRT equals to 1 vote. Secret Network uses the delegated-Proof-of-Stake (dPOS) system coming with the Cosmos SDK and the Tendermint Consensus engine. This means validators vote with the power of the combined total staked SCRT of all their delegators. A delegator overrides the vote of their validator by voting themselves.\
\
If Quorum on a proposal is reached a simple majority of staked SCRT is needed to pass a governance proposal. Proposals have a 7-day voting period and a delegator can switch their vote up till the last block. Staking SCRT giver any network participant a vote in the ecosystem which is a very important utility of the SCRT token.

#### Staking/inflation

The SCRT coin has no supply cap because it constantly rewards network participants with SCRT inflation to enable security of the protocol. When staking users secure the protocol from potential attacks, for this delegators are rewarded. Validators receive a commission from the inflation rewards of their delegators so they can run a sustainable business and pay their hardware.\
\
The Secret Network inflation parameters are dynamic, the current inflation is 15% as long as the ratio of staked to non-staked SCRT remains under 66%. If the bonded rate goes above 66% the inflation gradually declines to 7%. The current Secret Network staking APR is \~23% which is higher than the annual inflation.\
\
If a user stakes SCRT they gain a real return of \~5-7%, if a user does not stake they are being diluted. These tokenomics help generate a sustainable environment for the SCRT coin and all network participants.

#### Gas Fee

When processing transactions on Secret Network users need to pay for the space they take up in a block. This payment for computation of data is called a gas fee. The gas fee on Secret Network is set by the validators and their `min_gas_fee` setting.&#x20;

The current gas fee per unit of gas is `0.0125uSCRT` . A transaction on average is sized at 100,000 gas units, each transaction therefore costs `100,000 * 0.0125 *10^-6 = 0,00125 SCRT` . The prices for these example transactions can always change if validators decide to run with different settings.&#x20;

There is no reason for a fee market to arise on Secret Network due to the high throughput and fast finality. The fee on Secret Network could be `0` but this is not done as to eliminate denial-of-service attacks. An attacker would have to pay a full block worth of gas every 6 seconds to keep up that attack this can become costly quite fast which disincentives the attacker.

The transaction fees are paid out to stakers on the network and are an addition to their yield. Every wallet on Secret Network needs some SCRT to complete transactions, this drives utility to the SCRT coin.

``
