# Migration Guide

### Governance Integration

#### Proposal Flow

1. **Create Batch Proposal:** Submit MsgMigrateContractProposal with multiple contracts
2. **Voting Period:** Standard governance voting process
3. **Execution:** If passed, authorizations are stored for all contracts
4. **Migration:** Admin/Proxy contract can execute migrations
5. **Cleanup:** Authorizations are consumed and deleted

### For Contract Admins

**Enable Governance for Your Contract**

```bash
# Enable governance requirement (one-way operation)
secretcli tx compute set-contract-governance <your-contract> --from <admin>
```

**Check Authorization Status**

```bash
# Check if your contract has pending authorization
secretcli query compute authorized-migration <your-contract>
```

### For Governance-Only Contracts

**Setup Governance-Only Migration**

```bash
# 1. Set GovernanceProxy as admin
secretcli tx compute set-contract-admin <target-contract> <governance-proxy-contract> --from current-admin
```

\
**For Governance Participants**

**Create Migration Proposal**

```bash
# Submit proposal to authorize migration
secretcli tx gov submit-proposal proposal.json
  --from <proposer>
```

**Execute Authorized Migration**

```bash
# After proposal passes, execute via admin or Migr contract
secretcli tx compute migrate <contract> <code-id> '{}' --from <admin>

# Or via GovernanceProxy contract (governance-only pattern)
secretcli tx compute execute <migr-contract> \
  '{"migrate_contract": {"contract_addr": "<contract>", "new_code_id": 42, "migrate_msg": "e30="}}' \
  --from any-user
```
