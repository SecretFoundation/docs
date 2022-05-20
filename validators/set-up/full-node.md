# Full Node

This document details how to join the Secret Network `secret-4` mainnet as a full node. Once your full node is running, you can turn it into a validator in the optional last step.

### Requirements <a href="#requirements" id="requirements"></a>

* Ubuntu/Debian host (with ZFS or LVM to be able to add more storage easily)
* A public IP address
* Open ports `TCP 26656 & 26657` _Note: If you're behind a router or firewall then you'll need to port forward on the network device._
* Reading [Tendermint: Running in production](https://docs.tendermint.com/v0.34/tendermint-core/running-in-production.html)
* RPC address of an already active node. You can use any node that exposes RPC services.
* Refer to [Intel Processor Specifications](https://ark.intel.com/content/www/us/en/ark.html#@Processors) if you're unsure if your processor supports SGX

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#minimum-requirements)Minimum requirements <a href="#minimum-requirements" id="minimum-requirements"></a>

* 16GB RAM
* 256GB SDD
* 1 dedicated core of any Intel Skylake processor (Intel® 6th generation) or better (Xeon gen3 (Ice Lake) NOT supported)
* Motherboard with support for SGX in the BIOS

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#recommended-requirements)Recommended requirements <a href="#recommended-requirements" id="recommended-requirements"></a>

* 32GB RAM
* 512GB SSD
* 2 dedicated cores of any Intel Skylake processor (Intel® 6th generation) or better (Xeon gen3 (Ice Lake) NOT supported)
* Motherboard with support for SGX in the BIOS

### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#installation)Installation <a href="#installation" id="installation"></a>

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_0-step-up-sgx-on-your-local-machine)0. Step up SGX on your local machine <a href="#_0-step-up-sgx-on-your-local-machine" id="_0-step-up-sgx-on-your-local-machine"></a>

See instructions for [setup](https://docs.scrt.network/node-guides/setup-sgx.html) and [verification](https://docs.scrt.network/node-guides/verify-sgx.html). See [registration](https://docs.scrt.network/node-guides/registration.html) if you'd like a more comprehensive overview on what's happening in these steps.

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_1-download-the-secret-network-package-installer-for-debian-ubuntu)1. Download the Secret Network package installer for Debian/Ubuntu: <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

```
wget https://github.com/scrtlabs/SecretNetwork/releases/download/v1.2.2/secretnetwork_v1.2.2_mainnet_amd64.deb
# check the hash of the downloaded binary
echo "1a51d3d9324979ef9a1f56023e458023488b4583bf4587abeed2d1f389aea947 secretnetwork_v1.2.2_mainnet_amd64.deb" | sha256sum --check
```

([How to verify releases](https://docs.scrt.network/verify-releases.html))

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_2-install-the-package)2. Install the package: <a href="#_2-install-the-package" id="_2-install-the-package"></a>

Note: if you are upgrading from v1.2.0, it may say secret-node is downgrading to version 0. Ignore it.

```
sudo dpkg -i secretnetwork_v1.2.2_mainnet_amd64.deb
```

Verify the installation by doing:

```
secretd version
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_3-initialize-your-installation-of-the-secret-network)3. Initialize your installation of the Secret Network. <a href="#_3-initialize-your-installation-of-the-secret-network" id="_3-initialize-your-installation-of-the-secret-network"></a>

Choose a **moniker** for yourself, and replace `<MONIKER>` with your moniker below. This moniker will serve as your public nickname in the network.

```
secretd init <MONIKER> --chain-id secret-4
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_4-download-a-copy-of-the-genesis-block-file-genesis-json)4. Download a copy of the Genesis Block file: `genesis.json` <a href="#_4-download-a-copy-of-the-genesis-block-file-genesis-json" id="_4-download-a-copy-of-the-genesis-block-file-genesis-json"></a>

```
wget -O ~/.secretd/config/genesis.json "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.2.0/genesis.json"
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_5-validate-the-checksum-for-the-genesis-json-file-you-have-just-downloaded-in-the-previous-step)5. Validate the checksum for the `genesis.json` file you have just downloaded in the previous step: <a href="#_5-validate-the-checksum-for-the-genesis-json-file-you-have-just-downloaded-in-the-previous-step" id="_5-validate-the-checksum-for-the-genesis-json-file-you-have-just-downloaded-in-the-previous-step"></a>

```
echo "759e1b6761c14fb448bf4b515ca297ab382855b20bae2af88a7bdd82eb1f44b9 $HOME/.secretd/config/genesis.json" | sha256sum --check
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_6-validate-that-the-genesis-json-is-a-valid-genesis-file)6. Validate that the `genesis.json` is a valid genesis file: <a href="#_6-validate-that-the-genesis-json-is-a-valid-genesis-file" id="_6-validate-that-the-genesis-json-is-a-valid-genesis-file"></a>

```
secretd validate-genesis
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_7-the-rest-of-the-commands-should-be-run-from-the-home-folder-home-your-username)7. The rest of the commands should be run from the home folder (`/home/<your_username>`) <a href="#_7-the-rest-of-the-commands-should-be-run-from-the-home-folder-home-your-username" id="_7-the-rest-of-the-commands-should-be-run-from-the-home-folder-home-your-username"></a>

```
cd ~
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_8-initialize-secret-enclave)8. Initialize secret enclave <a href="#_8-initialize-secret-enclave" id="_8-initialize-secret-enclave"></a>

You can choose between two ways, **8a (automatic)** or **8b (manual)**:

**Note:** if this machine has been registered before, and have the following files:

```
/home/user/.sgx_secrets/
├── consensus_seed.sealed
└── new_node_seed_exchange_keypair.sealed
```

you can move them to `/opt/secret/.sgx_secrets` and skip to [**step 16**](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#16-add-persistent-peers-to-your-configuration-file) (if not working, try registering anyway).

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_8a-currently-broken-skip-to-8b-initialize-secret-enclave-automatic-registration-experimental)8a. CURRENTLY BROKEN - SKIP TO 8b. Initialize secret enclave - Automatic Registration (EXPERIMENTAL) <a href="#_8a-currently-broken-skip-to-8b-initialize-secret-enclave-automatic-registration-experimental" id="_8a-currently-broken-skip-to-8b-initialize-secret-enclave-automatic-registration-experimental"></a>

* **Note:** Make sure SGX is running or this step might fail.

Make sure the directory `/opt/secret/.sgx_secrets` exists:

```
mkdir -p /opt/secret/.sgx_secrets
```

Create env variables:

```
export SCRT_ENCLAVE_DIR=/usr/lib
export SCRT_SGX_STORAGE=/opt/secret/.sgx_secrets
```

Register:

```
secretd auto-register --node http://bootstrap.node.scrtlabs.com:1317 --registration-node http://register.mainnet.enigma.co:26667
```

**If this step was successful, you can skip straight to** [**step 16**](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#16-add-persistent-peers-to-your-configuration-file)

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_8b-initialize-secret-enclave-manual-registration-legacy)8b. Initialize secret enclave - Manual Registration (legacy) <a href="#_8b-initialize-secret-enclave-manual-registration-legacy" id="_8b-initialize-secret-enclave-manual-registration-legacy"></a>

Make sure the directory `/opt/secret/.sgx_secrets/` exists:

```
mkdir -p /opt/secret/.sgx_secrets/
```

Make sure SGX is running or this step might fail.

```
secretd init-enclave
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_9-check-that-initialization-was-successful)9. Check that initialization was successful <a href="#_9-check-that-initialization-was-successful" id="_9-check-that-initialization-was-successful"></a>

Attestation certificate should have been created by the previous step

```
ls -lh /opt/secret/.sgx_secrets/attestation_cert.der
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_10-check-your-certificate-is-valid)10. Check your certificate is valid <a href="#_10-check-your-certificate-is-valid" id="_10-check-your-certificate-is-valid"></a>

Should print your 64 character registration key if it was successful.

```
PUBLIC_KEY=$(secretd parse /opt/secret/.sgx_secrets/attestation_cert.der  2> /dev/null | cut -c 3-)
echo $PUBLIC_KEY
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_11-config-secretcli-to-point-to-a-working-node-and-import-a-key-with-some-scrt)11. Config `secretcli`, to point to a working node and import a key with some SCRT <a href="#_11-config-secretcli-to-point-to-a-working-node-and-import-a-key-with-some-scrt" id="_11-config-secretcli-to-point-to-a-working-node-and-import-a-key-with-some-scrt"></a>

The steps using `secretcli` can be run on any machine, they don't need to be on the full node itself. We'll refer to the machine where you are using `secretcli` as the "CLI machine" below.

To run the steps with `secretcli` on another machine, [set up the CLI](https://docs.scrt.network/cli/install-cli.html) there.

Configure `secretcli`. Initially you'll be using the bootstrap node, as you'll need to connect to a running node and your own node is not running yet.

```
secretcli config chain-id secret-4
secretcli config node https://lcd-secret.scrtlabs.com:443/rpc
secretcli config output json
```

Set up a key. Make sure you back up the mnemonic and the keyring password.

```
secretcli keys add <key-alias>
```

This will output your address, a 45 character-string starting with `secret1...`. Then you can fund it with some SCRT.

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_12-register-your-node-on-chain)12. Register your node on-chain <a href="#_12-register-your-node-on-chain" id="_12-register-your-node-on-chain"></a>

Run this step on the CLI machine. If you're using a different CLI machine than the full node, copy `/opt/secret/.sgx_secrets/attestation_cert.der` from the full node to the CLI machine.

```
secretcli tx register auth /opt/secret/.sgx_secrets/attestation_cert.der -y --from <key-alias>
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_13-pull-check-your-node-s-encrypted-seed-from-the-network)13. Pull & check your node's encrypted seed from the network <a href="#_13-pull-check-your-node-s-encrypted-seed-from-the-network" id="_13-pull-check-your-node-s-encrypted-seed-from-the-network"></a>

Run this step on the CLI machine.

```
SEED=$(secretcli query register seed $PUBLIC_KEY | cut -c 3-)
echo $SEED
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_14-get-additional-network-parameters)14. Get additional network parameters <a href="#_14-get-additional-network-parameters" id="_14-get-additional-network-parameters"></a>

Run this step on the CLI machine.

These are necessary to configure the node before it starts.

```
secretcli query register secret-network-params
ls -lh ./io-master-cert.der ./node-master-cert.der
```

If you're using a different CLI machine than the validator node, copy `node-master-cert.der` from the CLI machine to the validator node.

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_15-configure-your-secret-node)15. Configure your secret node <a href="#_15-configure-your-secret-node" id="_15-configure-your-secret-node"></a>

From here on, run commands on the full node again.

```
mkdir -p ~/.secretd/.node
secretd configure-secret node-master-cert.der $SEED
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_16-listen-for-incoming-rpc-requests-so-that-light-nodes-can-connect-to-you)16. Listen for incoming RPC requests so that light nodes can connect to you: <a href="#_16-listen-for-incoming-rpc-requests-so-that-light-nodes-can-connect-to-you" id="_16-listen-for-incoming-rpc-requests-so-that-light-nodes-can-connect-to-you"></a>

```
perl -i -pe 's/laddr = .+?26657"/laddr = "tcp:\/\/0.0.0.0:26657"/' ~/.secretd/config/config.toml
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_17-enable-secret-node-as-a-system-service)17. Enable `secret-node` as a system service: <a href="#_17-enable-secret-node-as-a-system-service" id="_17-enable-secret-node-as-a-system-service"></a>

Note that the `secret-node` system file is created in a previous step.

```
sudo systemctl enable secret-node
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_18-start-secret-node-as-a-system-service)18. Start `secret-node` as a system service: <a href="#_18-start-secret-node-as-a-system-service" id="_18-start-secret-node-as-a-system-service"></a>

```
sudo systemctl start secret-node
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_19-if-everything-above-worked-correctly-the-following-command-will-show-your-node-streaming-blocks-this-is-for-debugging-purposes-only-kill-this-command-anytime-with-ctrl-c)19. If everything above worked correctly, the following command will show your node streaming blocks (this is for debugging purposes only, kill this command anytime with Ctrl-C): <a href="#_19-if-everything-above-worked-correctly-the-following-command-will-show-your-node-streaming-blocks" id="_19-if-everything-above-worked-correctly-the-following-command-will-show-your-node-streaming-blocks"></a>

```
journalctl -f -u secret-node
```

```
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

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_20-optimization)20. Optimization <a href="#_20-optimization" id="_20-optimization"></a>

In order to be able to handle NFT minting and other Secret Contract-heavy operations, it's recommended to update your SGX memory enclave cache:

```
sed -i.bak -e "s/^contract-memory-enclave-cache-size *=.*/contract-memory-enclave-cache-size = \"15\"/" ~/.secretd/config/app.toml
```

Also checkout this document by `[ block pane ]` for fine tuning your machine for better uptime: https://gist.github.com/blockpane/40bc6b64caa48fdaff3b0760acb51eaa

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_21-get-your-node-id-with)21. Get your node ID with: <a href="#_21-get-your-node-id-with" id="_21-get-your-node-id-with"></a>

```
secretd tendermint show-node-id
```

Be sure to point your CLI to your running node instead of the bootstrap node

```
secretcli config node tcp://localhost:26657
```

If someone wants to add you as a peer, have them add the above address to their `persistent_peers` in their `~/.secretd/config/config.toml`.

And if someone wants to use your node from their `secretcli` then have them run:

```
secretcli config chain-id secret-4
secretcli config output json
secretcli config node tcp://<your-public-ip>:26657
```

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_22-optional-make-your-full-node-into-a-validator)22. Optional: make your full node into a validator <a href="#_22-optional-make-your-full-node-into-a-validator" id="_22-optional-make-your-full-node-into-a-validator"></a>

To turn your full node into a validator, see [Joining Mainnet as a Validator](https://docs.scrt.network/node-guides/join-validator-mainnet.html).

#### [#](https://docs.scrt.network/node-guides/run-full-node-mainnet.html#\_23-optional-state-sync)23. Optional: State Sync <a href="#_23-optional-state-sync" id="_23-optional-state-sync"></a>

You can skip syncing from scratch or download a snapshot by [State Syncing](https://docs.scrt.network/node-guides/state-sync.html#mainnet-state-sync) to the current block.
