# ℹ️ What ERC-8004 stores

ERC-8004 uses an identity registry based on ERC-721, where each agent is represented by a unique agentId. The registry points to an agent registration file via agentURI, and that registration file contains fields such as name, description, image, services, x402Support, registrations, and supportedTrust.&#x20;

In SecretVM, the registration flow maps naturally to this structure:

* Agent name → name
* Image URL → image
* Description → description
* Services → services
* x402 support → x402Support
* Supported trust models → supportedTrust

ERC-8004 allows agents to advertise arbitrary service endpoints, and the supportedTrust field is optional. If present, it communicates which trust assumptions or validation models the agent supports.&#x20;
