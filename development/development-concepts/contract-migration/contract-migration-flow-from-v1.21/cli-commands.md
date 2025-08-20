# CLI Commands

#### New Transaction Commands

**Set Contract Governance**

```bash
secretcli tx compute set-contract-governance <contract-address> --from <admin>
```

**Note**: This is a one-way operation - governance cannot be disabled once enabled

#### New Query Commands

**Query Authorized Migration**

```bash
secretcli query compute authorized-migration <contract-address>
```

**Example**:

```bash
secretcli query compute authorized-migration secret1abc123...
# Output: {"new_code_id": "42"} or {"new_code_id": "0"}
```



\
