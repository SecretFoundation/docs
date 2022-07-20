# Permits

## Query Permits&#x20;

Query permits are an alternative querying method introduced in the SNIP-24 design specification. Query permits use of a cryptographic technique known as public-key encryption coupled with digital signatures.&#x20;

## Permits&#x20;

A permit is a formatted message, it outlines several arguments such as what tokens the permit applies to and what permissions the permit should allow (e.g. should the permit allow the querier to view a user’s transaction history, balance, etc.). Permits are not saved in the smart contract state and do not require the initiation of a blockchain transaction. Therefore, permits are a less permanent way of gaining viewing access with less network strain.&#x20;

## Signing Permits&#x20;

Users can sign permits with their account’s private key to give certain dApps or parties viewing access to specific parts of their private data for a specified amount of time. To get viewing access a user sends a query, with the signed permit as an argument, to a smart contract. Once received, the smart contract, using the user’s public key, can validate the identity based on the signature the user provided. If the user’s identity is confirmed, the smart contract returns the data as requested.
