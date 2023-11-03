# Hermes

## Hermes - Rust Relayer (Informal Systems)

{% hint style="success" %}
Official documentation: [https://hermes.informal.systems/documentation](https://hermes.informal.systems/documentation)
{% endhint %}

### 1. Install Rust Dependencies

You will need **rust**, **build-essential** and **git** installed to follow these instructions:

```bash
# rust:
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# build-essential:
sudo apt-get install build-essential -y

# git:
sudo apt install git-all -y
```

### 2. Building Hermes <a href="#building-hermes" id="building-hermes"></a>

For preparation, we will create a dedicated user to run Hermes. Following command will also create home directory for the new user.

```bash
sudo useradd -m -d /ibc/hermes hermes
```

We will next switch to the hermes user and create a directory where we will compile the relayer software.Open the generated `~/.relayer/config/config.yaml file,`

```bash
sudo sudo -u hermes -s
mkdir /ibc/hermes/source
mkdir /ibc/hermes/bin
cd /ibc/hermes/source
```

Now is time to clone the source repository and build it. Note that we need to checkout the latest release.

```bash
git clone https://github.com/informalsystems/ibc-rs.git hermes
cd hermes
git checkout v0.9.0
cargo build --release
cp target/release/hermes ~/bin
cd
```

Next we will check that the newly built hermes version is the correct one:

```bash
hermes@demo:~$ bin/hermes version
Nov 04 15:52:48.299  INFO ThreadId(01) using default configuration from '/ibc/hermes/.hermes/config.toml'
hermes 0.9.0
```

### 3. Configuring Hermes <a href="#configuring-hermes" id="configuring-hermes"></a>

Choose your favourite editor and edit the following configuration template to mach your setup. There are features like telemetry and rest API that you can enable, but they are not necessary, so they are left out from this tutorial.



Open config

```
nano $HOME/.hermes/config.toml
```

Edit the config

```toml
[mode.clients]
enabled = true
refresh = true
misbehaviour = false

[mode.connections]
enabled = true

[mode.channels]
enabled = true

[mode.packets]
enabled = true

[[chains]]
id = 'secret-4'
rpc_addr = 'http://127.0.0.1:26657'
websocket_addr = 'ws://127.0.0.1:26657/websocket'
grpc_addr = 'http://127.0.0.1:9090'
rpc_timeout = '10s'
account_prefix = 'secret'
key_name = 'secret-relayer'
store_prefix = 'ibc'
default_gas = 350000
max_gas = 1500000
gas_multiplier = 1.2
max_msg_num = 30
max_tx_size = 2097152
clock_drift = '5s'
max_block_time = '30s'
trusting_period = '14days'
memo_prefix = ''
[chains.trust_threshold]
numerator = '1'
denominator = '3'
[chains.gas_price]
price = 0.1
denom = 'uscrt'
[chains.packet_filter]
policy = 'allow'
list = [
    ['transfer', 'channel-1'], #osmosis
]
[chains.address_type]
derivation = 'cosmos'


[[chains]]
id = 'osmosis-1'
rpc_addr = 'http://127.0.0.1:26557'
websocket_addr = 'ws://127.0.0.1:26557/websocket'
grpc_addr = 'http://127.0.0.1:9091'
rpc_timeout = '10s'
account_prefix = 'osmo'
key_name = 'osmosis-relayer'
store_prefix = 'ibc'
default_gas = 500000
max_gas = 1500000
gas_multiplier = 1.2
max_msg_num = 20
max_tx_size = 209715
clock_drift = '20s'
max_block_time = '10s'
trusting_period = '10days'
memo_prefix = ''
[chains.trust_threshold]
numerator = '1'
denominator = '3'
[chains.gas_price]
price = 0.0025
denom = 'uosmo'
[chains.packet_filter]
policy = 'allow'
list = [
    ['transfer', 'channel-88'],
]
[chains.address_type]
derivation = 'cosmos'
```

{% hint style="success" %}
Want to relay for all/more existing connections on secret? -- check the channel database
{% endhint %}

You can validate the configuration with following:

```bash
hermes@Demo:~$ bin/hermes -c .hermes/config.toml config validate
Success: "validation passed successfully"
```

### 4. Setting Up Wallets <a href="#setting-up-wallets" id="setting-up-wallets"></a>

We will need to create a new wallet, import it, and ultimately fund it. Note the unique derivation paths for secret.

```bash
hermes -c .hermes/config.toml keys restore secret-4 -m "mnemonics" -n "secret-relayer" -p "m/44'/529'/0'/0/0"

hermes -c .hermes/config.toml keys restore osmosis-1 -m "mnemonics" -n "osmosis-relayer"
```

If you want to make sure the keys got imported, you can check them with following command:

```bash
bin/hermes keys list secret-4
```

### 5. Testing the setup <a href="#testing-the-setup" id="testing-the-setup"></a>

Let's do a quick test to see things work properly.

Validate your `~/.hermes/config.toml` file by running:

```
hermes config validate
```

Perform a health check:

```
hermes health-check
```

You should see a similar output as the one below:

```
INFO ThreadId(01) [secret-4] chain is healthy
INFO ThreadId(01) [osmosis-1] chain is healthy
```

### 6. Run hermes

```bash
bin/hermes start
```

Once we see things load up correctly and there are no fatal errors, we can break out of hermes with **ctrl-c**.

### Configuring systemd <a href="#configuring-systemd" id="configuring-systemd"></a>

Now we will setup hermes to be run by systemd, and to start automatically on reboots.

Create the following configuration to **/etc/systemd/system/hermes.service**

```systemd
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

```bash
sudo systemctl start hermes.service
sudo systemctl enable hermes.service
```
