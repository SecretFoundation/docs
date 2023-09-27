# RLY

## Go Relayer (RLY) - Strangelove

{% hint style="success" %}
Official documentation: [https://github.com/cosmos/relayer/tree/main/docs](https://github.com/cosmos/relayer/tree/main/docs)
{% endhint %}

Make sure you have installed go.

### 1. Install rly

Clone the repository, checkout the latest stable release and install rly

```
git clone https://github.com/cosmos/relayer.git
cd relayer && git checkout v2.4.0
make install
```

### 2. Initialize the config file

Run the following command to initialize the configuration in `~/.relayer/config/config.yaml`

```
rly config init
```

### 3. Configure RLY

To set up the RLY config file You can add the respective channels and chains using the Chain registry queries:

```
rly chains add secretnetwork
rly chains add osmosis

rly fetch paths osmosis-secretnetwork
```

Or open the generated `~/.relayer/config/config.yaml file,` and copy-paste the sample configuration below and adjust it to point to the RPC endpoints of your Secret and Osmosis full nodes:

```
global:
    api-listen-addr: :5183
    timeout: 10s
    memo: Relayed by Me
    light-cache-size: 20
chains:
    nolus:
        type: cosmos
        value:
            key-directory: /home/<user>/.relayer/keys/pirin-1
            key: default
            chain-id: secret-4
            rpc-addr: http://127.0.0.1:26657
            account-prefix: secret
            keyring-backend: default
            gas-adjustment: 1.2
            gas-prices: 0.1uscrt
            min-gas-amount: 1
            debug: false
            timeout: 20s
            block-timeout: ""
            output-format: json
            sign-mode: direct
            extra-codecs: []
            coin-type: 529
            broadcast-mode: batch
    osmosis:
        type: cosmos
        value:
            key-directory: /home/<user>/.relayer/keys/osmosis-1
            key: default
            chain-id: osmosis-1
            rpc-addr: http://127.0.0.1:26557
            account-prefix: osmo
            keyring-backend: default
            gas-adjustment: 1.2
            gas-prices: 0.01uosmo
            min-gas-amount: 10000000
            debug: false
            timeout: 20s
            block-timeout: ""
            output-format: json
            sign-mode: direct
            extra-codecs: []
            coin-type: 118
            broadcast-mode: batch
paths:
        osmosis-secretnetwork:
        src:
            chain-id: osmosis-1
            client-id: 07-tendermint-1588
            connection-id: connection-1244
        dst:
            chain-id: secret-4
            client-id: 07-tendermint-2
            connection-id: connection-1
        src-channel-filter:
            rule: ""
            channel-list: []
```

Now you need to add a new key for your relayer or import an existing one to use to sign and relay IBC transactions. Adding a new key happens with the following command:

```
rly keys add nolus [key-name]  
rly keys add osmosis [key-name]
```

If you already have a private key and want to restore it from your mnemonic you can use the restore subcommand.

```
rly keys restore nolus [key-name] "mnemonic words here"
rly keys restore osmosis [key-name] "mnemonic words here"
```

If you specify a different \[key-name] from default you would need to edit the config.yaml and change the key parameter value to the label that you’ve chosen.

### Start RLY

If your nodes are fully synced, feel free to start the rly daemon:

```
rly start
```

