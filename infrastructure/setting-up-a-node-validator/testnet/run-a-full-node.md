# Setup Full Node

## How To Join Secret Network as a Full Node on Testnet <a href="#how-to-join-secret-network-as-a-full-node-on-testnet" id="how-to-join-secret-network-as-a-full-node-on-testnet"></a>

This document details how to join the Secret Network `testnet` as a full node. Once your full node is running, you can turn it into a validator in the optional last step.

### Requirements <a href="#requirements" id="requirements"></a>

{% hint style="danger" %}
Secret Network has strict Hardware Requirements. If your machine does not meet them, it will \*NOT\* work as a node.
{% endhint %}

* Ubuntu/Debian host (with ZFS or LVM to be able to add more storage easily)
* A public IP address
* Open ports `TCP 26656 & 26657` _Note: If you're behind a router or firewall then you'll need to port forward on the network device._
* Reading [Tendermint: Running in production](https://docs.tendermint.com/v0.34/tendermint-core/running-in-production.html)
* RPC address of an already active node. You can use `http://bootstrap.pulsar3.scrtlabs.com:26657`, or any other node that exposes RPC services. Alternate RPC nodes available in the [API Registry.](../../../development/resources-api-contract-addresses/connecting-to-the-network/)
* [Install SGX](install-sgx.md)

## Installation <a href="#installation" id="installation"></a>

### **Install SGX and `secretd`**

{% hint style="danger" %}
This guide assumes you've already installed the latest version of secretd and SGX. To setup an archive node, you must follow the [Archive Nodes](../../sentry-archive-and-ibc-node-setup/archive-nodes.md) instructions.
{% endhint %}

For more information on SGX, see instructions for [SGX Installation](../node-setup/install-sgx.md) and [Verifying SGX](../../node-runners/testnet/broken-reference/). See [Node Registration Information](../../node-runners/testnet/broken-reference/) if you'd like a more comprehensive overview on what's happening in these steps.

### **Initialize Secret Network Configs**

Choose a **moniker** for yourself, and replace `<MONIKER>` with your moniker below. This moniker will serve as your public nickname in the network.

```bash
secretd init <MONIKER> --chain-id pulsar-3
```

This will generate the following files in `~/.secretd/config/`

* `genesis.json`
* `node_key.json`
* `priv_validator_key.json`

### **Download `genesis.json`**

The genesis file is how other nodes on the network know what network you should be on.

```bash
curl https://rpc.pulsar.scrttestnet.com/genesis | jq '.result.genesis' > ~/.secretd/config/genesis.json
# verify genesis.json checksum
echo "adb91d0ee8cb5da80ef47e0b13d42b89bba003063542054d67522e52ddb4f514 $HOME/.secretd/config/genesis.json" | sha256sum --check
```

### **Initialize Secret Enclave**

Initialize `/opt/secret/.sgx_secrets`:

```bash
mkdir -p /opt/secret/.sgx_secrets
```

You can choose between two methods, **3a (automatic) or 3b (manual)**:

#### **Initialize Secret Enclave - Automatic Registration (EXPERIMENTAL)**

{% hint style="danger" %}
WARNING: This method is experimental, and may not work. If it doesn't work, skip to step 3b.
{% endhint %}

The following commands will create the necessary environment variables and attempt to automatically register the node.

```bash
export SCRT_ENCLAVE_DIR=/usr/lib
export SCRT_SGX_STORAGE=/opt/secret/.sgx_secrets
secretd auto-register --pulsar
```

If this step was successful, you can skip straight to [Optimization](run-a-full-node.md#optimization).

#### **Initialize Secret Enclave - Manual Registration**

```bash
secretd init-enclave
```

### Verify Enclave Initialization

Attestation certificate should have been created by the previous step

```bash
ls -lh /opt/secret/.sgx_secrets/attestation_combined.bin
```

Verify the certificate is valid. A 64 character registration key will be printed if it was successful.

```bash
PUBLIC_KEY=$(secretd dump /opt/secret/.sgx_secrets/pubkey.bin)
echo $PUBLIC_KEY
```

### **Configure `secretd`**

{% hint style="info" %}
The following steps should use `secretd` be ran on the full node itself. To run the steps with `secretd` on a local machine, [set up the CLI](https://docs.scrt.network/cli/install-cli.html) there.
{% endhint %}

Configure `secretd`. Initially you'll be using the bootstrap node, as you'll need to connect to a running node and your own node is not running yet.

```bash
secretd config chain-id pulsar-3
secretd config node https://rpc.pulsar.scrttestnet.com
secretd config output json
```

### **Fund Secret Wallet**

If you already have a wallet funded with `SCRT`, you can import the wallet by doing the following:

```bash
secretd keys add <key-alias> --recover
```

Otherwise, you will need to set up a key. Make sure you back up the mnemonic and the keyring password.

```bash
secretd keys add <key-alias>
```

This will output your address, a 45 character-string starting with `secret1...`. Copy/paste it to get some test-SCRT from [the faucet](https://faucet.pulsar.scrttestnet.com/). Continue when you have confirmed your account has some test-SCRT in it.

### **Configure Node Attestation**

1. Register your node on-chain

```bash
secretd tx register auth /opt/secret/.sgx_secrets/attestation_combined.bin -y --gas 700000 --from <key-alias>
```

2\. Pull & check your node's encrypted seed from the network

```bash
SEED=$(secretd query register seed $PUBLIC_KEY | cut -c 3-)
echo $SEED
```

3\. Get additional network parameters

These are necessary to configure the node before it starts.

```bash
secretd query register secret-network-params
ls -lh ./io-master-key.txt ./node-master-key.txt
```

### **Configure Your Secret Node**

{% hint style="info" %}
From here on, commands must be ran on the full node.
{% endhint %}

```bash
mkdir -p ~/.secretd/.node
secretd configure-secret node-master-key.txt $SEED
```

#### Add Seeds And Persistent Peers To Configuration File. <a href="#id-16-add-persistent-peers-to-your-configuration-file" id="id-16-add-persistent-peers-to-your-configuration-file"></a>

```bash
# seeds
perl -i -pe 's/seeds = ""/seeds = "07234140a165b470846fe995951401a8db88dd36\@bootstrap.pulsar3.scrtlabs.com:26656,b5d1bb9194c6148367b64586d6bc0128866fc646\@212.7.211.39:26656,a3c9c415fe6b46babd16f000c7dbd4d94be6e450\@178.162.151.73:26656,c088b57ebc7b2cfa2ec99e8b4ffef90bead96b47\@185.56.139.84:26656"/' ~/.secretd/config/config.toml

# persistent_peers
perl -i -pe 's/persistent_peers = ""/persistent_peers = "07234140a165b470846fe995951401a8db88dd36\@bootstrap.pulsar3.scrtlabs.com:26656,b5d1bb9194c6148367b64586d6bc0128866fc646\@212.7.211.39:26656,a3c9c415fe6b46babd16f000c7dbd4d94be6e450\@178.162.151.73:26656,c088b57ebc7b2cfa2ec99e8b4ffef90bead96b47\@185.56.139.84:26656"/' ~/.secretd/config/config.toml
```

### **Optimization**

In order to be able to handle NFT minting and other Secret Contract-heavy operations, it's recommended to update your SGX memory enclave cache:

```bash
sed -i.bak -e "s/^contract-memory-enclave-cache-size *=.*/contract-memory-enclave-cache-size = \"15\"/" ~/.secretd/config/app.toml
```

Also checkout[ this document](https://gist.github.com/blockpane/40bc6b64caa48fdaff3b0760acb51eaa) by `[ block pane ]` for fine tuning your machine for better uptime.

### **Set `minimum-gas-price` Parameter**

We recommend `0.0125uscrt` per gas unit:

```bash
perl -i -pe 's/^minimum-gas-prices = .+?$/minimum-gas-prices = "0.0125uscrt"/' ~/.secretd/config/app.toml
```

Your node will not accept transactions that specify `--fees` lower than the `minimun-gas-price` you set here.

### **Enable `secret-node`:**

{% hint style="info" %}
Note that the `secret-node` system file is created when installing sgx.
{% endhint %}

```bash
sudo systemctl enable secret-node
```

You are now a now ready to finally sync the full node. 🎉.

Go to [testnet-state-sync.md](testnet-state-sync.md "mention") to continue.

### Get Node ID <a href="#id-21-get-your-node-id-with" id="id-21-get-your-node-id-with"></a>

`secretd tendermint show-node-id`

And publish yourself as a node with this ID:

```bash
<your-node-id>@<your-public-ip>:26656
```

Be sure to point your CLI to your running node instead of the bootstrap node

`secretcli config node tcp://localhost:26657`

If someone wants to add you as a peer, have them add the above address to their persistent\_peers in their \~/.secretd/config/config.toml.

And if someone wants to use your node from their secretcli then have them run:

```bash
secretcli config chain-id pulsar-3
secretcli config output json
secretcli config indent true
secretcli config node tcp://<your-public-ip>:26657
```

### **State Sync**

You can skip syncing from scratch or download a snapshot by [State Syncing](testnet-state-sync.md) to the current block.

### **Optional: Become a Validator**

To turn your full node into a validator, see [Join Testnet as a Validator](run-a-full-node.md#how-to-join-secret-network-as-a-full-node-on-testnet).
