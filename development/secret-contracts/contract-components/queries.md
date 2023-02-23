# Query Message

**Query messages** retrieve the relevant smart contract and execute the query message. The results of the query are then returned to the sender of the query message, providing users with information about the state of the blockchain and the smart contracts running on it.

```
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetCount {} => to_binary(&query_count(deps)?),
    }
}
```

Contracts can define query functions, or read-only operations meant for data-retrieval. Doing so allows contracts to expose rich, custom data endpoints with JSON responses instead of raw bytes from the low-level key-value store. Because the blockchain state cannot be changed, the node can directly run the query without a transaction.

Users can specify which query function alongside any arguments with a JSON `QueryMsg`. Even though there is no gas fee, the query function’s execution is capped by gas determined by metered execution, which is not charged, as a form of spam protection.
