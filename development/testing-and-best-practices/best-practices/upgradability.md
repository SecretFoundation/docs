---
description: Allowing your contract to be swapped out smoothly
---

# Upgradability

In some cases, you may want to write a new updated smart contract. This can be for multiple reasons, such as fixing bugs or adding new features. However, because you cannot just change the code of a contract already uploaded on the chain, the upgrade process becomes significantly more complex than web2 and there are many things you will need to consider.

#### Block size limitations

Due to the expense of sending large amounts of data, it would be unreasonable or impossible to send all data to a new contract in a single transaction if you store a significant amount, such as in the case of a token contract which may have tens of thousands of users. You will have to set up functions to transfer data strategically and in manageable chunks.

#### Decentralization and security

If a single admin calls a function that would transfer over all user data to a new contract, in many cases that would also mean they could simply read the data themselves by transferring it to a contract they have total read access to. To prevent this risk to user privacy, it is wise to only give your users permission to transfer over their own data. Using the example of a token contract once again, allow only the users permission to transfer their token balance to the upgraded token contract. Otherwise there is a risk of an admin reading their balance without their permission.

#### Data removal

In some cases, you may want to ensure once the data is transferred it is immediately deleted, or otherwise prevented from being accessed again from the old contract. This is to prevent the possibility of a user taking advantage of their data existing on two contracts simultaneously. For example, if an NFT contract was updated and the NFTs were moved over to the new contract, but the old contract did not remove them after transferring, you could risk your users selling both the old and new copy their NFTs. Your specific contract may not require data deletion like this, but it is important to consider all possibilities and think from the perspective of potential attackers to decide if this is a risk you need to prevent.
