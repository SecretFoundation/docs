# Secret Network v1.4 (CosmWasm 1.0)

## CosmWasm 1.0 Breaking Changes

### Address API Changes

* `HumanAddr` has been deprecated in favour of simply `String`. It never added any significant safety bonus over `String` and was just a marker type. The new type `Addr` was created to hold validated addresses. Those can be created via `Addr::unchecked`, `Api::addr_validate`, `Api::addr_humanize` and JSON deserialization. In order to maintain type safety, deserialization into `Addr` must only be done from trusted sources like a contract's state or a query response. User inputs must be deserialized into `String`.
* `deps.api.human_address(&CanonicalAddr)` => `deps.api.addr_humanize(&CanonicalAddr)`
* `deps.api.canonical_address(&HumanAddr)` => `deps.api.addr_canonicalize(&str)`

### Extern Method Interface Changes

Use the new entry point system. From lib.rs remove

```rust
#[cfg(target_arch = "wasm32")]
cosmwasm_std::create_entry_points!(contract);

// or

#[cfg(target_arch = "wasm32")]
cosmwasm_std::create_entry_points_with_migration!(contract);
```

Then add the macro attribute `#[cfg_attr(not(feature = "library"), entry_point)]` to your contract.rs as follows:

* `init`
  * `Env` split into `Env` and `MessageInfo`
  * `InitResponse` and `InitResult` deprecated, please use `Response`
  * function name changed from `init` to `instantiate`

```rust
pub fn init<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    env: Env,
    msg: InitMsg,
) -> StdResult<InitResponse> {

// into 

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
```

* `handle`
  * `Env` split into `Env` and `MessageInfo`
  * `HandleResponse` and `HandleResult` deprecated, please use `Response`
  * function name changed from `handle` to `execute`

```rust
pub fn handle<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    env: Env,
    msg: HandleMsg,
) -> HandleResult {

// into 

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(deps: DepsMut, env: Env, info: MessageInfo, msg: ExecuteMsg) -> StdResult<Response> {
```

* `query`
  * new argument `Env` added

```rust
pub fn query<S: Storage, A: Api, Q: Querier>(
    deps: &Extern<S, A, Q>,
    msg: QueryMsg,
) -> StdResult<Binary> {

// into 

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
```

* `migrate`
  * `Env` split into `Env` and `MessageInfo`
  * `MigrateResponse` and `MigrateResult` deprecated, please use `Response`

```rust
pub fn migrate<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    env: Env,
    msg: MigrateMsg,
) -> MigrateResult {

// into 

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(_deps: DepsMut, _env: Env, _msg: MigrateMsg) -> StdResult<Response> {
```

### Response no longer be built using a structure literal

`Response` can no longer be built using a struct literal. Please use `Response::new` as well as relevant [builder-style setters](https://github.com/CosmWasm/cosmwasm/blob/402e3281ff5bc1cd7b4b3e36c2bb9914f07eaaf6/packages/std/src/results/response.rs#L103-L167) to set the data.

This is a step toward better API stability.

```rust
let send = BankMsg::Send { to_address, amount };

-     Ok(Response {
-         messages: vec![SubMsg::new(send)],
-         attributes: vec![attr("action", "burn"), attr("payout", msg.payout)],
-         events: vec![],
-         data: Some(data_msg.into()),
-     })
+     Ok(Response::new()
+         .add_message(send)
+         .add_attribute("action", "burn")
+         .add_attribute("payout", msg.payout)
+         .set_data(data_msg))
```

### Sub-messages & Reply

The sub-messages feature can be used to get the response data or events from the executed contract. For example, if a contract wants to get the address of the child contract which is instantiated from the contract. The contract can send `MsgInstantiate` as sub-messages with `ReplyOn::Success` option like [https://github.com/terraswap/terraswap/blob/7cf47f5e811fe0c4643a7cd09500702c1e7f3a6b/contracts/terraswap\_factory/src/contract.rs#L128-L142](https://github.com/terraswap/terraswap/blob/7cf47f5e811fe0c4643a7cd09500702c1e7f3a6b/contracts/terraswap\_factory/src/contract.rs#L128-L142).

Then the reply is only executed when the instantiate is successful with the instantiate response data. [https://github.com/terraswap/terraswap/blob/7cf47f5e811fe0c4643a7cd09500702c1e7f3a6b/contracts/terraswap\_factory/src/contract.rs#L148-L170](https://github.com/terraswap/terraswap/blob/7cf47f5e811fe0c4643a7cd09500702c1e7f3a6b/contracts/terraswap\_factory/src/contract.rs#L148-L170).

### Storage Migration

Rename the type `Extern` to `Deps`, and radically simplify the `init/handle/migrate/query` entrypoints. Rather than `&mut Extern<S, A, Q>`, use `DepsMut`. And instead of `&Extern<S, A, Q>`, use `Deps`. If you ever pass eg. `foo<A: Api>(api: A)` around, you must now use dynamic trait pointers: `foo(api: &dyn Api)`. Here is the quick search-replace guide on how to fix contract.rs:

In production (non-test) code:

```rust
<S: Storage, A: Api, Q: Querier> => ``
&mut Extern<S, A, Q> => DepsMut
&Extern<S, A, Q> => Deps
&mut deps.storage => deps.storage where passing into state.rs helpers
&deps.storage => deps.storage where passing into state.rs helpers
On the top, remove use cosmwasm_std::{Api, Extern, Querier, Storage}. Add use cosmwasm_std::{Deps, DepsMut}.
```

In test code only:

```rust
&mut deps, => deps.as_mut(),
&deps, => deps.as_ref(),
You may have to add use cosmwasm_std::{Storage} if the compile complains about the trait
```

If you use cosmwasm-storage, in state.rs:

```rust
<S: Storage> => ``
<S: ReadonlyStorage> => ``
<S, => <
&mut S => &mut dyn Storage
&S => &dyn Storage
If you have any references to ReadonlyStorage left after the above, please replace them with Storage
```

### Advanced Storage

We can still use `singleton` and `bucket`. But if you want more advanced storage access, you can use `cw-storage-plus` with following migration steps.

*   `cowmasm_storage::Singleton` -> `cw_stroage_plus::Item`

    * Remove `read_*` and `store_*` functions
    * Define `Item` as following (must prepend the length of key)

    ```
    pub const CONFIG: Item<Config> = Item::new("\u{0}\u{6}config");

    // store
    CONFIG.save(deps.storage, &config)?;

    // read
    let mut config: Config = CONFIG.load(deps.storage)?;
    ```
*   `cosmwasm_storage::Bucket` -> `cw_storage_plus::Map`

    * Remove `read_*` and `store_*` functions
    * Define `Map` as following

    ```
    pub const PAIRS: Map<Addr, PairInfoRaw> = Map::new("pair_info");

    // store
    PAIRS.save(deps.storage, &addr, &pair_info)?;

    // read
    let pair_info: PairInfoRaw = PAIRS.load(deps.storage, &addr)?;
    ```

### Raw Querier migration

The core now just returns raw bytes without json encoding, so we can receive the query response as what the data was stored.

```rust
- let res: Binary = deps.querier.query(&QueryRequest::Wasm(WasmQuery::Raw {
...
- let pair_info: PairInfoRaw = from_binary(&res)?;

// into 

+ let pair_info: PairInfoRaw = deps.querier.query(&QueryRequest::Wasm(WasmQuery::Raw {
...
```

Also, `mock_querier` has to remove one `to_binary` from its raw query response.
