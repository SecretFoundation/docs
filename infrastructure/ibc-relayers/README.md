# ⛓️ IBC Relayers

## Setting up relayers <a href="#setting-up-hermes" id="setting-up-hermes"></a>

### Assumptions <a href="#assumptions" id="assumptions"></a>

We assume that you already have access to Secret and Osmosis nodes (preferably with 21 days of archive and under your own maintentance). These can be either local nodes, or you can access them over the network. However, for networked version, you will need to adjust the systemd configuration not to depend on the chains that are run on other servers. And naturally the hermes configuration needs to adjust the addressing of each chain as well. **All nodes should be ran on the same machine, using NVMe drives.**

The nodes you use should have the GRPC and Websocket ports open/enabled

The given example has all relayed chains run locally, Secret is on standard ports, other chains are configured as follows:

* Secret: 26657 and 9090
* Osmosis: 26557 and 9091

In these instructions, Hermes is installed under `/ibc/hermes`, adjust the paths according to your setup. We also install the Go relayer.

These instructions are based on installation on Debian 10, but should work the same on Debian 11 or recent Ubuntu.

\--> [Hermes installation](hermes.md)

\--> [RLY installation](rly.md)

{% hint style="info" %}
There is a group for active Secret Relayers to learn and work together on maintenance. Please contact @Ertemann on telegram if you would like to be added and contribute.\
\
**You can also contact us there if you want us to setup a channel for your network, Wasm project, Flush stuck packets etc.**
{% endhint %}

### Which software to use - Hermes vs RLY

#### Hermes

The configuration of Hermes is slightly more involved and has a less intuitive system to pull additional config items from the chain registry as it only replaces and not adds to your config.\
\
The allowlist of hermes however is very handy to specify exactly what you want to relay, so as soon as chains are configured adding more channels is a breeze.

Hermes has some problems relaying Wasm channels and startup time can increase a lot if a lot of channels are added using wildcard operators in the config.

The Hermes docs themselves are outstanding and the API utillities in the program allow you to do a lot without ever needing to install the Daemon for any specific chain.

Hermes requires a Grpc and WS endpoint which can be hard to get, especially if relaying with public nodes. their new pull mode helps to reduce this to just RPC though.

Hermes has features to keep Clients of IBC conenctions alive and the Flushing commands work great even when automised. Hermes is also the only software that supports external fee-grants.

#### RLY

Anecdotally many relayers have said it performs really well, this seems to be specifically the case for ICA and ICQ channels. Adding to that a very intuitive Config which can be added to using 2 simple commands and a PR to the chain registry and it has become quite popular.\
\
RLY uses connection based relaying, which means adding config for a connection between 2 chains is a little more work. When added however ALL channels using those clients and connections are relayed meaning no additional config changes when Teams add ICA, ICQ or WASM channels.\
\
RLY uses just RPC which makes it a great lightweight version to configurate for a testnet if needed and also simple for mainnet.&#x20;

Relayers client update tools and flushing automation are very helpful and set up by default however more detailed configs are available if needed. That together with the Commands requiring simple naming (chain registry conventions) instead of chain-ids and Channel numbers makes using the software for maintenance very enjoyable.

The docs of RLY however are quite poor, and although it has a very advanced Fee-grant splitter feature it currently does not support adding fee-grants from addresses not controlled by the relayer themselves.
