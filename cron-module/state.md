# State

The `cron` module keeps state of the following primary objects:

1. Params
2. Schedules
3. Schedule execution tracking

#### Params

Params is a module-wide configuration structure that stores system parameters and defines overall functioning of the cron module.

* Params: `0x01 | ProtocolBuffer(Params)`

```protobuf
message Params {
  string security_address = 1;  // Emergency removal authority
  uint64 limit = 2;             // Max schedules executed per block
}
```

#### Schedule

Schedule defines the scheduled execution configuration.

* Schedule: `0x02 | []byte(name) | ProtocolBuffer(Schedule)`

```protobuf
message Schedule {
  string name = 1;                         // Schedule identifier
  uint64 period = 2;                       // Execution interval in blocks
  repeated MsgExecuteContract msgs = 3;    // Messages to execute
  uint64 last_execute_height = 4;          // Last execution block height
}
```

#### ScheduleCount

ScheduleCount tracks the total number of schedules for governance limits.

* ScheduleCount: `0x03 | ProtocolBuffer(ScheduleCount)`

```protobuf
message ScheduleCount {
  int32 count = 1;  // The number of current schedules
}
```

#### ExecutionStage

ExecutionStage controls the height offset used in schedule readiness checking:

```protobuf
enum ExecutionStage {
  EXECUTION_STAGE_END_BLOCKER = 0;   // Check schedules ready for next block (height + 1)
  EXECUTION_STAGE_BEGIN_BLOCKER = 1; // Check schedules ready for current block (height + 0)
}
```

**Height Offset Logic in `intervalPassed` function**:

```go
func (k *Keeper) intervalPassed(ctx sdk.Context, schedule types.Schedule, executionStage types.ExecutionStage) bool {
    delta := 0
    if executionStage == types.ExecutionStage_EXECUTION_STAGE_END_BLOCKER {
        delta = 1  // Add 1 to current height for next block readiness check
    }
    return uint64(ctx.BlockHeight())+uint64(delta) >= (schedule.LastExecuteHeight + schedule.Period)
}
```

**Usage in Message Retrieval**:

* **EXECUTION\_STAGE\_END\_BLOCKER**: Checks if schedules will be ready in the next block (for hash calculation)
* **EXECUTION\_STAGE\_BEGIN\_BLOCKER**: Checks if schedules are ready in the current block (for immediate execution)

#### Cross-Block State (tm-secret-enclave)

The cron module also maintains state across block boundaries using the `tm-secret-enclave` component:

**Implicit Hash Storage**

```rust
// Global hash storage with thread safety
static IMPLICIT_HASH: Mutex<[u8; 32]> = Mutex::new(DEFAULT_IMPLICIT_HASH);
```

This storage maintains the SHA-256 hash of scheduled messages between blocks:

* **Block N-1**: Hash calculated and stored during EndBlock
* **Block N**: Hash retrieved and included in block header
* **Verification**: Hash verified during message execution in enclave
