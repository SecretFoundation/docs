# Data Handling

## Uint128

`Uint128` is a data structure designed to work with usigned 128-bit integers.

If you are familiar with Rust, you might know that it has it's own native primitive - `u128`. `Uint128` differs from `u128` in that it is a string encoded number, rather than the traditional little/big-endian.

### When To Use Them Instead Of u128

`Uint128` is a thin wrapper around `u128` that is using strings for JSON encoding/decoding, such that the full `u128` range can be used for clients that convert JSON numbers to floats, like JavaScript and jq.

### Entrypoint Messages

You are already familiar with the [contract entrypoints](TODO) and the concept of [Messages](TODO). Most of the time we will use [serde](TODO) to serialize them.

In general, JSON implementations usually accept `[-(2^53)+1,(2^53)-1]` as an acceptable range for numbers. That's why we'll prefer to use `Uint128` in entrypoint messages, for example:

```rust
// TODO

// Instead of:

// TODO
```

### Storage

Depends on the needs of your contract, you can choose to use either `Uint128` or `u128`.

**As a rule of thumb, most of the time you will want to store numbers as `u128` rather than `Uint128`.**

More specifically, since `Uint128` is a string encoded number the storage space it'll consume will depend on the number of digits of the number you are storing. `u128` on the other hand will always take a constant amount of storage space. That's why `Uint128` will be more efficient for very small numbers (and then, why use 128-bit integer to begin with?), while `u128` will be more efficient for most use cases.

### Data Hygiene

### How Uint128s Can Become A Security Risk

## Floats

### Never Use Floats

### Detecting Floating Point Operations
