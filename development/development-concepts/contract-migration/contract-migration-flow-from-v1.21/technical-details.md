# Technical Details

### New Data Structures

#### ContractInfo Enhancement

```protobuf
message ContractInfo {
  // ... existing fields ...
  bool require_governance = 9;  // NEW FIELD
}
```

**Purpose**: Flag indicating whether governance approval is required for migrations. Behavior: One-way ratchet (can only change from false → true)

### New Message Types

**MigrateContractInfo**

```protobuf
message MigrateContractInfo {
  string address = 1;
  uint64 new_code_id = 2;
}
```

**Purpose**: Individual contract migration specification for batch operations.

**MsgMigrateContractProposal**

```protobuf
message MsgMigrateContractProposal {
  string authority = 1; // Governance module address
  string title = 2; // Proposal title
  string description = 3; // Proposal description
  repeated MigrateContractInfo contracts = 4; // Multiple contracts
}
```

**Purpose**: Governance message to authorize a specific contract migration.&#x20;

**Authority**: Only callable by governance module.

**MsgSetContractGovernance**

```protobuf
message MsgSetContractGovernance {
  string sender = 1; // Contract admin
  string contract_address = 2; // Target contract
}
```

**Purpose**: Admin message to enable governance requirement for a contract.

**Behavior**: Always sets require\_governance = true (simplified one-way operation).

### New Query Types

**QueryAuthorizedMigrationRequest/Response**

```protobuf
message QueryAuthorizedMigrationRequest {
  string contract_address = 1;
}
message QueryAuthorizedMigrationResponse {
  uint64 new_code_id = 1; // Authorized code ID (0 if none)
}
```

**Purpose**: Query pending governance authorizations for a contract.

<br>
