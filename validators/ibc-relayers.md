# IBC Relayers



## Setting Up Hermes <a href="#setting-up-hermes" id="setting-up-hermes"></a>

### [#](https://docs.scrt.network/relayers/setting-up-hermes.html#assumptions)Assumptions <a href="#assumptions" id="assumptions"></a>

We assume that you already have access to Secret, Osmosis, Cosmos, and Terra nodes. These can be either local nodes, or you can access them over the network. However, for networked version, you will need to adjust the systemd configuration not to depend on the chains that are run on other servers. And naturally the hermes configuration needs to adjust the addressing of each chain as well. **All nodes should be ran on the same machine, using NVMe drives.**

The given example has all relayed chains run locally, Secret is on standard ports, other chains are configured as follows:

* Secret: 26657 and 9090
* Cosmos: 10657 and 10090
* Terra: 11657 and 11090
* Osmosis: 12657 and 12090

In these instructions, Hermes is installed under /ibc/hermes, adjust the paths according to your setup.

These instructions are based on installation on Debian 10, but should work the same on Debian 11 or recent Ubuntu.

You will need **rust**, **build-essential** and **git** installed to follow these instructions:

```
# rust:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# build-essential:
sudo apt-get install build-essential -y

# git:
sudo apt install git-all -y
```

### [#](https://docs.scrt.network/relayers/setting-up-hermes.html#building-hermes)Building Hermes <a href="#building-hermes" id="building-hermes"></a>

For preparation, we will create a dedicated user to run Hermes. Following command will also create home directory for the new user.

```
sudo useradd -m -d /ibc/hermes hermes
```

We will next switch to the hermes user and create a directory where we will compile the relayer software.

```
sudo sudo -u hermes -s
mkdir /ibc/hermes/source
mkdir /ibc/hermes/bin
cd /ibc/hermes/source
```

Now is time to clone the source repository and build it. Note that we need to checkout the latest release.

```
git clone https://github.com/informalsystems/ibc-rs.git hermes
cd hermes
git checkout v0.9.0
cargo build --release
cp target/release/hermes ~/bin
cd
```

Next we will check that the newly built hermes version is the correct one:

```
hermes@demo:~$ bin/hermes version
Nov 04 15:52:48.299  INFO ThreadId(01) using default configuration from '/ibc/hermes/.hermes/config.toml'
hermes 0.9.0
```

### [#](https://docs.scrt.network/relayers/setting-up-hermes.html#configuring-hermes)Configuring Hermes <a href="#configuring-hermes" id="configuring-hermes"></a>

Choose your favourite editor and edit the following configuration template to mach your setup. There are features like telemetry and rest API that you can enable, but they are not necessary, so they are left out from this tutorial.

```
# The global section has parameters that apply globally to the relayer operation.
[global]

# Specify the verbosity for the relayer logging output. Default: 'info'
# Valid options are 'error', 'warn', 'info', 'debug', 'trace'.
log_level = 'info'


# Specify the mode to be used by the relayer. [Required]
[mode]

# Specify the client mode.
[mode.clients]

# Whether or not to enable the client workers. [Required]
enabled = true

# Whether or not to enable periodic refresh of clients. [Default: true]
# Note: Even if this is disabled, clients will be refreshed automatically if
#      there is activity on a connection or channel they are involved with.
refresh = true

# Whether or not to enable misbehaviour detection for clients. [Default: false]
misbehaviour = false

# Specify the connections mode.
[mode.connections]

# Whether or not to enable the connection workers for handshake completion. [Required]
enabled = false

# Specify the channels mode.
[mode.channels]

# Whether or not to enable the channel workers for handshake completion. [Required]
enabled = false

# Specify the packets mode.
[mode.packets]

# Whether or not to enable the packet workers. [Required]
enabled = true

# Parametrize the periodic packet clearing feature.
# Interval (in number of blocks) at which pending packets
# should be eagerly cleared. A value of '0' will disable
# periodic packet clearing. [Default: 100]
clear_interval = 100

# Whether or not to clear packets on start. [Default: false]
clear_on_start = true

# Enable or disable the filtering mechanism.
# Valid options are 'true', 'false'.
# Currently Hermes supports two filters:
# 1. Packet filtering on a per-chain basis; see the chain-specific
#   filter specification below in [chains.packet_filter].
# 2. Filter for all activities based on client state trust threshold; this filter
#   is parametrized with (numerator = 1, denominator = 3), so that clients with
#   thresholds different than this will be ignored.
# If set to 'true', both of the above filters will be enabled.
# [Default: false]
filter = true

# Toggle the transaction confirmation mechanism.
# The tx confirmation mechanism periodically queries the `/tx_search` RPC
# endpoint to check that previously-submitted transactions
# (to any chain in this config file) have delivered successfully.
# Experimental feature. Affects telemetry if set to false.
# [Default: true]
tx_confirmation = true

# The REST section defines parameters for Hermes' built-in RESTful API.
# https://hermes.informal.systems/rest.html
[rest]

# Whether or not to enable the REST service. Default: false
enabled = true

# Specify the IPv4/6 host over which the built-in HTTP server will serve the RESTful
# API requests. Default: 127.0.0.1
host = '127.0.0.1'

# Specify the port over which the built-in HTTP server will serve the restful API
# requests. Default: 3000
port = 3000


# The telemetry section defines parameters for Hermes' built-in telemetry capabilities.
# https://hermes.informal.systems/telemetry.html
[telemetry]

# Whether or not to enable the telemetry service. Default: false
enabled = true

# Specify the IPv4/6 host over which the built-in HTTP server will serve the metrics
# gathered by the telemetry service. Default: 127.0.0.1
host = '127.0.0.1'

# Specify the port over which the built-in HTTP server will serve the metrics gathered
# by the telemetry service. Default: 3001
port = 3001


[[chains]]
id = 'secret-4'

# API access to Secret node with indexing
rpc_addr = 'http://127.0.0.1:26657'
grpc_addr = 'http://127.0.0.1:26090'
websocket_addr = 'ws://127.0.0.1:26657/websocket'

rpc_timeout = '20s'
account_prefix = 'secret'
key_name = 'secret-relayer'
store_prefix = 'ibc'
max_msg_num = 30
max_tx_size = 2097152
default_gas = 50000
max_gas = 3000000
gas_adjustment = 0.1
gas_price = { price = 0.015, denom = 'uscrt' }
clock_drift = '5s'
max_block_time = '10s'
trusting_period = '14days'
trust_threshold = { numerator = '1', denominator = '3'}
address_type = { derivation = 'cosmos' }

[chains.packet_filter]
policy = 'allow'
list = [
  ['transfer', 'channel-0'], # Cosmos
  ['transfer', 'channel-1'], # Osmosis
  ['transfer', 'channel-2'], # Terra
]

#
# Chain configuration Osmosis
#

[[chains]]
id = 'osmosis-1'

# API access to Osmosis node with indexing
rpc_addr = 'http://127.0.0.1:12657'
grpc_addr = 'http://127.0.0.1:12090'
websocket_addr = 'ws://127.0.0.1:12657/websocket'

rpc_timeout = '20s'
account_prefix = 'osmo'
key_name = 'osmosis-relayer'
store_prefix = 'ibc'
max_msg_num = 30
max_tx_size = 2097152
default_gas = 100000
max_gas = 3000000
gas_adjustment = 0.1
gas_price = { price = 0.000, denom = 'uosmo' }
clock_drift = '5s'
max_block_time = '10s'
trusting_period = '10days'
trust_threshold = { numerator = '1', denominator = '3' }
address_type = { derivation = 'cosmos' }

[chains.packet_filter]
policy = 'allow'
list = [
  ['transfer', 'channel-88'],
]

[[chains]]
id = 'cosmoshub-4'

# API access to Cosmos node with indexing
rpc_addr = 'http://127.0.0.1:10657'
grpc_addr = 'http://127.0.0.1:10090'
websocket_addr = 'ws://127.0.0.1:10657/websocket'

rpc_timeout = '10s'
account_prefix = 'cosmos'
key_name = 'cosmos-relayer'
address_type = { derivation = 'cosmos' }
store_prefix = 'ibc'
default_gas = 2000000
max_gas = 3000000
gas_price = { price = 0.008, denom = 'uatom' }
gas_adjustment = 0.1
max_msg_num = 25
max_tx_size = 180000
clock_drift = '15s'
max_block_time = '10s'
trusting_period = '14days'
memo_prefix = ''
trust_threshold = { numerator = '1', denominator = '3' }
[chains.packet_filter]
policy = 'allow'
list = [
   ['transfer', 'channel-235'] #secret
 ]

[[chains]]
id = 'columbus-5'

# API access to Cosmos node with indexing
rpc_addr = 'http://127.0.0.1:11657'
grpc_addr = 'http://127.0.0.1:11090'
websocket_addr = 'ws://127.0.0.1:11657/websocket'
rpc_timeout = '10s'
account_prefix = 'terra'
key_name = 'terra-relayer'
address_type = { derivation = 'cosmos' }
store_prefix = 'ibc'
default_gas = 1000000
max_gas = 3000000
gas_price = { price = 450, denom = 'ukrw' } #0.0147 uluna
gas_adjustment = 0.1
max_msg_num = 30
max_tx_size = 1800000
clock_drift = '15s'
max_block_time = '10s'
trusting_period = '14days'
memo_prefix = ''
trust_threshold = { numerator = '1', denominator = '3' }
[chains.packet_filter]
policy = 'allow'
list = [
 ['transfer', 'channel-16'] #secret
]
```

You can validate the configuration with following:

```
hermes@Demo:~$ bin/hermes -c .hermes/config.toml config validate
Success: "validation passed successfully"
```

### [#](https://docs.scrt.network/relayers/setting-up-hermes.html#setting-up-wallets)Setting up wallets <a href="#setting-up-wallets" id="setting-up-wallets"></a>

We will need to create a new wallet, import it, and ultimately fund it. Note the unique derivation paths for terra and secret.

```
hermes -c .hermes/config.toml keys restore secret-4 -m "mnemonics" -n "secret-relayer" -p "m/44'/529'/0'/0/0"

hermes -c .hermes/config.toml keys restore cosmoshub-4 -m "mnemonics" -n "cosmos-relayer"

hermes -c .hermes/config.toml keys restore osmosis-1 -m "mnemonics" -n "osmosis-relayer"

hermes -c .hermes/config.toml keys restore columbus-5 -m "mnemonics" -n "terra-relayer" -p "m/44'/330'/0'/0/0"
```

If you want to make sure the keys got imported, you can check them with following command:

```
bin/hermes keys list secret-4
```

### [#](https://docs.scrt.network/relayers/setting-up-hermes.html#testing-the-setup)Testing the setup <a href="#testing-the-setup" id="testing-the-setup"></a>

Let's do a quick test to see things work properly.

```
bin/hermes start
```

Once we see things load up correctly and there are no fatal errors, we can break out of hermes with **ctrl-c**.

### [#](https://docs.scrt.network/relayers/setting-up-hermes.html#configuring-systemd)Configuring systemd <a href="#configuring-systemd" id="configuring-systemd"></a>

Now we will setup hermes to be run by systemd, and to start automatically on reboots.

Create the following configuration to **/etc/systemd/system/hermes.service**

```
[Unit]
Description=Hermes IBC relayer
ConditionPathExists=/ibc/hermes/hermes
After=network.target secret-node.service cosmos.service osmo.service

[Service]
Type=simple
User=hermes
WorkingDirectory=/ibc/hermes
ExecStart=/ibc/hermes/hermes start
Restart=always
RestartSec=2

[Install]
WantedBy=multi-user.target
```

Then we will start hermes with the newly created service and enable it. Note that this step is done from your normal user account that has sudo privileges, so no longer as hermes.

```
sudo systemctl start hermes.service
sudo systemctl enable hermes.service
```
