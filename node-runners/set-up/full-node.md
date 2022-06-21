# Full Node

This document details how to join the Secret Network `secret-4` mainnet as a full node. Once your full node is running and state synced to the current block, you can turn it into a validator in the optional last step.

### Requirements <a href="#requirements" id="requirements"></a>

{% hint style="danger" %}
Secret Network has strict [Hardware Requirements](../hardware-compliance.md). If your machine does not meet them, it will \*NOT\* work as a node.
{% endhint %}

* Ubuntu/Debian host (with ZFS or LVM to be able to add more storage easily)
* A public IP address
* Open ports `TCP 26656 & 26657` _Note: If you're behind a router or firewall then you'll need to port forward on the network device._
* Reading [Tendermint: Running in production](https://docs.tendermint.com/v0.34/tendermint-core/running-in-production.html)
* RPC address of an already active node. You can use any node that exposes RPC services.
* Refer to [Intel Processor Specifications](https://ark.intel.com/content/www/us/en/ark.html#@Processors) if you're unsure if your processor supports SGX

#### Minimum requirements <a href="#minimum-requirements" id="minimum-requirements"></a>

* 16GB RAM
* 512GB SDD
* 1 dedicated core of any Intel Skylake processor (Intel® 6th generation) or better (Xeon gen3 (Ice Lake) NOT supported)
* Motherboard with support for SGX in the BIOS

#### Recommended requirements <a href="#recommended-requirements" id="recommended-requirements"></a>

* 32GB RAM
* 1TB NVMe SSD
* 2 dedicated cores of any Intel Skylake processor (Intel® 6th generation) or better (Xeon gen3 (Ice Lake) NOT supported)
* Motherboard with support for SGX in the BIOS

### Installation <a href="#installation" id="installation"></a>

#### 0. Install SGX and `secretd` <a href="#_0-step-up-sgx-on-your-local-machine" id="_0-step-up-sgx-on-your-local-machine"></a>

{% hint style="danger" %}
This guide assumes you've already installed [the latest version of secretd](secretd-installation-and-setup.md) and [SGX](install-sgx.md). To setup an archive node, you must follow the [Archive Nodes](../archive-nodes.md) instructions
{% endhint %}

For more information on SGX, see instructions for [setup](https://docs.scrt.network/node-guides/setup-sgx.html) and [verification](https://docs.scrt.network/node-guides/verify-sgx.html). See [registration](https://docs.scrt.network/node-guides/registration.html) if you'd like a more comprehensive overview on what's happening in these steps.

#### 1. Initialize Secret Network <a href="#_3-initialize-your-installation-of-the-secret-network" id="_3-initialize-your-installation-of-the-secret-network"></a>

Choose a **moniker** for yourself, and replace `<MONIKER>` with your moniker below. This moniker will serve as your public nickname in the network.

```bash
secretd init <MONIKER> --chain-id secret-4
```

This will generate the following files in `~/.secretd/config/`

* `genesis.json`
* `node_key.json`
* `priv_validator_key.json`

#### 2. Download `genesis.json` <a href="#_4-download-a-copy-of-the-genesis-block-file-genesis-json" id="_4-download-a-copy-of-the-genesis-block-file-genesis-json"></a>

```bash
wget -O ~/.secretd/config/genesis.json "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.2.0/genesis.json"
# verify genesis.json checksum
echo "759e1b6761c14fb448bf4b515ca297ab382855b20bae2af88a7bdd82eb1f44b9 $HOME/.secretd/config/genesis.json" | sha256sum --check
```

#### 3. Initialize Secret Enclave <a href="#_8-initialize-secret-enclave" id="_8-initialize-secret-enclave"></a>

{% hint style="danger" %}
Ensure you've already [Setup SGX](full-node.md#\_0-step-up-sgx-on-your-local-machine) or this and the following steps will fail.
{% endhint %}

You can choose between two ways, **3a (automatic) or 3b (manual)**:

Make sure the directory `/opt/secret/.sgx_secrets` exists:

```bash
mkdir -p /opt/secret/.sgx_secrets
```

#### 3a. Initialize Secret Enclave - Automatic Registration (EXPERIMENTAL) <a href="#_8a-currently-broken-skip-to-8b-initialize-secret-enclave-automatic-registration-experimental" id="_8a-currently-broken-skip-to-8b-initialize-secret-enclave-automatic-registration-experimental"></a>

{% hint style="danger" %}
WARNING: This method is experimental, and may not work. If it doesn't work, skip to step 3b.
{% endhint %}

1. Create the necessary environment variables:

```bash
export SCRT_ENCLAVE_DIR=/usr/lib
export SCRT_SGX_STORAGE=/opt/secret/.sgx_secrets
```

1. Auto-Register:

```bash
secretd auto-register --node http://bootstrap.node.scrtlabs.com:1317 --registration-node http://register.mainnet.enigma.co:26667
```

**If this step was successful, you can skip straight to** [**step 8**](full-node.md#\_-configure-your-secret-node)**.**

#### 3b. Initialize secret enclave - Manual Registration (legacy) <a href="#_8b-initialize-secret-enclave-manual-registration-legacy" id="_8b-initialize-secret-enclave-manual-registration-legacy"></a>

```bash
secretd init-enclave
```

#### 4. Verify Enclave Initialization <a href="#_9-check-that-initialization-was-successful" id="_9-check-that-initialization-was-successful"></a>

Attestation certificate should have been created by the previous step

```bash
ls -lh /opt/secret/.sgx_secrets/attestation_cert.der
```

Verify the certificate is valid. A 64 character registration key will be printed if it was successful.

```bash
PUBLIC_KEY=$(secretd parse /opt/secret/.sgx_secrets/attestation_cert.der  2> /dev/null | cut -c 3-)
echo $PUBLIC_KEY
```

#### 5. Configure `secretd` <a href="#_11-config-secretcli-to-point-to-a-working-node-and-import-a-key-with-some-scrt" id="_11-config-secretcli-to-point-to-a-working-node-and-import-a-key-with-some-scrt"></a>

{% hint style="info" %}
The following steps should use `secretd` be ran on the full node itself. To run the steps with `secretd` on a local machine, [set up the CLI](https://docs.scrt.network/cli/install-cli.html) there.
{% endhint %}

Configure `secretd`. Initially you'll be using the bootstrap node, as you'll need to connect to a running node and your own node is not running yet.

```bash
secretd config chain-id secret-4
secretd config node https://lcd-secret.scrtlabs.com:443/rpc
secretd config output json
```

#### 6. Fund Secret Wallet

If you already have a wallet funded with `SCRT`, you can import the wallet by doing the following:&#x20;

```bash
secretd keys add <key-alias> --recover
```

Otherwise, you will need to set up a key. Make sure you back up the mnemonic and the keyring password.&#x20;

```bash
secretd keys add <key-alias>
```

This will output your address, a 45 character-string starting with `secret1...`.&#x20;

#### 7. Configure Node Attestation <a href="#_12-register-your-node-on-chain" id="_12-register-your-node-on-chain"></a>

1. Register your node on-chain

```bash
secretd tx register auth /opt/secret/.sgx_secrets/attestation_cert.der -y --from <key-alias>
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
ls -lh ./io-master-cert.der ./node-master-cert.der
```

#### 8. Configure Your Secret Node <a href="#_15-configure-your-secret-node" id="_15-configure-your-secret-node"></a>

{% hint style="info" %}
From here on, commands must be ran on the full node.
{% endhint %}

```bash
mkdir -p ~/.secretd/.node
secretd configure-secret node-master-cert.der $SEED
```

#### 9. Enable `secret-node`: <a href="#_16-listen-for-incoming-rpc-requests-so-that-light-nodes-can-connect-to-you" id="_16-listen-for-incoming-rpc-requests-so-that-light-nodes-can-connect-to-you"></a>

{% hint style="info" %}
Note that the `secret-node` system file is created in a previous step.
{% endhint %}

```bash
sudo systemctl enable secret-node && sudo systemctl start secret-node
```

If everything above worked correctly, the following command will show your node streaming blocks (this is for debugging purposes only, kill this command anytime with Ctrl-C).

```bash
journalctl -f -u secret-node
```

```bash
-- Logs begin at Mon 2020-02-10 16:41:59 UTC. --
Nov 09 11:16:31 scrt-node-01 secretd[619529]: 11:16AM INF indexed block height=12 module=txindex
Nov 09 11:16:35 scrt-node-01 secretd[619529]: 11:16AM INF Ensure peers module=pex numDialing=0 numInPeers=0 numOutPeers=0 numToDial=10
Nov 09 11:16:35 scrt-node-01 secretd[619529]: 11:16AM INF No addresses to dial. Falling back to seeds module=pex
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF Timed out dur=4983.86819 height=13 module=consensus round=0 step=1
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF received proposal module=consensus proposal={"Type":32,"block_id":{"hash":"0AF9693538AB0C753A7EA16CB618C5D988CD7DC01D63742DC4795606D10F0CA4","parts":{"hash":"58F6211ED5D6795E2AE4D3B9DBB1280AD92B2EE4EEBAA2910F707C104258D2A0","total":1}},"height":13,"pol_round":-1,"round":0,"signature":"eHY9dH8dG5hElNEGbw1U5rWqPp7nXC/VvOlAbF4DeUQu/+q7xv5nmc0ULljGEQR8G9fhHaMQuKjgrxP2KsGICg==","timestamp":"2021-11-09T11:16:36.7744083Z"}
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF received complete proposal block hash=0AF9693538AB0C753A7EA16CB618C5D988CD7DC01D63742DC4795606D10F0CA4 height=13 module=consensus
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF finalizing commit of block hash=0AF9693538AB0C753A7EA16CB618C5D988CD7DC01D63742DC4795606D10F0CA4 height=13 module=consensus num_txs=0 root=E4968C9B525DADA22A346D5E158C648BC561EEC351F402A611B9DA2706FD8267
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF minted coins from module account amount=6268801uscrt from=mint module=x/bank
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF executed block height=13 module=state num_invalid_txs=0 num_valid_txs=0
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF commit synced commit=436F6D6D697449447B5B373520353520323020352032342031312032333820353320383720313137203133372031323020313638203234302035302032323020353720343520363620313832203138392032333920393920323439203736203338203131322035342032332033203233362034375D3A447D
Nov 09 11:16:36 scrt-node-01 secretd[619529]: 11:16AM INF committed state app_hash=4B371405180BEE3557758978A8F032DC392D42B6BDEF63F94C2670361703EC2F height=13 module=state num_txs=0
^C
```

You are now a full node. 🎉

#### 10. Optimization <a href="#_20-optimization" id="_20-optimization"></a>

In order to be able to handle NFT minting and other Secret Contract-heavy operations, it's recommended to update your SGX memory enclave cache:

```bash
sed -i.bak -e "s/^contract-memory-enclave-cache-size *=.*/contract-memory-enclave-cache-size = \"15\"/" ~/.secretd/config/app.toml
```

Also checkout[ this document](https://gist.github.com/blockpane/40bc6b64caa48fdaff3b0760acb51eaa) by `[ block pane ]` for fine tuning your machine for better uptime.&#x20;

#### 11. State Sync <a href="#_23-optional-state-sync" id="_23-optional-state-sync"></a>

You can skip syncing from scratch or download a snapshot by [State Syncing](https://docs.scrt.network/node-guides/state-sync.html#mainnet-state-sync) to the current block.

#### 12. Optional: make your full node into a validator <a href="#_22-optional-make-your-full-node-into-a-validator" id="_22-optional-make-your-full-node-into-a-validator"></a>

To turn your full node into a validator, see [Joining Mainnet as a Validator](https://docs.scrt.network/node-guides/join-validator-mainnet.html).
