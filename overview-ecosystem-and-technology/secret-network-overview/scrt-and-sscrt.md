---
description: Learn about the SCRT coin, native to the Secret Network
---

# The SCRT coin

### SCRT - the Native coin of Secret Network

SCRT (pronounced “secret”) is the native coin of Secret Network. SCRT is used for payment of transactional and computational fees such as gas fees, staking with validators to secure the underlying network and earn inflation rewards, participation in community governance which helps to shape the future of the network, and so on.

The SCRT coin is a public asset on-chain and interactions with the coin are public-by-default (eg. balance, receiver etc).

This means interactions on the network that require SCRT gas such as viewing key generation, NFT minting, AMM swaps, and more will all show as interactions on-chain. These interactions can sill have private metadata through the implementation of [Secret Tokens](private-tokens.md), but the interaction is publicly verifiable on-chain.

### SCRT utility

#### Governance

Voting on Secret Network is powered by the SCRT token: **every staked SCRT is equivalent to 1 vote**. Secret Network uses the delegated-Proof-of-Stake (dPOS) system included with the Cosmos SDK and the Tendermint Consensus engine. This means validators vote with the power of the combined total staked SCRT of all of their delegators. A delegator overrides the vote of their validator by voting themselves.\
\
If Quorum on a proposal is reached, a simple majority of staked SCRT is needed to pass a governance proposal. Proposals have a 7-day voting period and delegators can change their vote until the last block. **Staking SCRT gives any network participant a vote in the ecosystem.**&#x20;

#### Staking/Inflation

The SCRT coin has no supply cap because it constantly rewards network participants with SCRT inflation to enable security of the protocol. When staked users secure the protocol from potential attacks, delegators are rewarded. Validators receive a commission from the inflation rewards of their delegators so they can run a sustainable business and pay their hardware.\
\
The Secret Network inflation parameters are dynamic: the current inflation is 15% as long as the ratio of staked to non-staked SCRT remains under 66%. If the bonded rate goes above 66%, the inflation gradually declines to 7%. The current Secret Network staking APR is \~23%, which is higher than the annual inflation.\
\
If a user stakes SCRT, they gain a real return of \~5-7%. If a user does not stake, they are being diluted. These tokenomics  generate a sustainable environment for the SCRT coin and all network participants.

#### Gas Fees

When processing transactions on Secret Network, users need to pay for the space they take up in a block. This payment for computation of data is called a gas fee. The gas fee on Secret Network is set by the validators and their `min_gas_fee` setting.

The current gas fee per unit of gas is `0.0125uSCRT` . A transaction, on average, is sized at 100,000 gas units, each transaction therefore costs `100,000 * 0.0125 *10^-6 = 0.00125 SCRT` . The prices for these example transactions can always change if validators decide to run with different settings.

There is no reason for a fee market to arise on Secret Network due to high throughput and fast finality. The fee on Secret Network could be `0` but this is not done as to eliminate denial-of-service attacks. An attacker would have to pay a full block worth of gas every 6 seconds to maintain an attack, which disincentives the attacker.

Transaction fees are paid out to stakers on the network and are an addition to their yield. Every wallet on Secret Network needs  SCRT to complete transactions: this drives utility to the SCRT coin.

Want to learn more about SCRT and how you can participate in the Secret ecosystem? [Visit Secret Network's website](https://scrt.network/about/get-scrt) for more information on how to buy and store SCRT.&#x20;
