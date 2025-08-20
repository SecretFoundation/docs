---
description: Examples on how to deploy or migrate contracts
---

# ⌨️ Usage Examples

### Deploy a contract with an Admin

```bash
secretcli tx compute instantiate <code_id> <init_msg> --from a --label <label> --admin <address>
```

### Move a contract to Governance+Admin Migration

Use the following command to change the migration mode to Governance + Admin. In this mode, the contract can be upgraded by the Admin after a governance vote that allows such upgrade is passed.

```bash
secretcli tx compute set-contract-governance <contract-address> --from <admin>
```

### Move a contract to Governance Only Migration

Use the following command to change the migration mode to Governance Only. In this mode, the contract can be migrated to a new version after a Governance Vote allows such upgrade. Anyone can issue the migration command after the voting is concluded.

To achieve this, the Admin of the contract should be updated to a custom Proxy contract that was deployed for that purpose.&#x20;

### Update the admin

```bash
secretcli tx compute set-contract-admin [contract_addr_bech32] [new_admin_addr_bech32] --from <admin>
```

### Remove the admin

```bash
secretcli tx compute clear-contract-admin [contract_addr_bech32] --from <admin>
```

### Batch Proposal Example

The example below shows a Governance Proposal that updates two&#x20;

```json
{
  "messages": [
    {
      "@type": "/secret.compute.v1beta1.MsgMigrateContractProposal",
      "authority": "secret10d07y265gmmuvt4z0w9aw880jnsr700jc88vt0",
      "title": "title",
      "description": "ds",
      "contracts": [
        {
          "address": "secret18wy2w4rzg9xxsm2ru8jq8tdq053h39epxvd4rl",
          "new_code_id": 2
        },
        {
          "address": "secret1yecdst70k0cdty04rhknmy43r7z5h5q3q72jqu",
          "new_code_id": 3
        }
      ]
    }
  ],
  "metadata": "ipfs://CID",
  "deposit": "10000000000uscrt",
  "title": "migrate contracts",
  "summary": "sum",
  "expedited": false
}
```
