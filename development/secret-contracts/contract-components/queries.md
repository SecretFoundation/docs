# Query

Contracts can define query functions, or read-only operations meant for data-retrieval. Doing so allows contracts to expose rich, custom data endpoints with JSON responses instead of raw bytes from the low-level key-value store. Because the blockchain state cannot be changed, the node can directly run the query without a transaction.

Users can specify which query function alongside any arguments with a JSON `QueryMsg`. Even though there is no gas fee, the query function’s execution is capped by gas determined by metered execution, which is not charged, as a form of spam protection.
