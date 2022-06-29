# Run A Full Node

## How To Join Secret Network as a Full Node on Testnet <a href="#how-to-join-secret-network-as-a-full-node-on-testnet" id="how-to-join-secret-network-as-a-full-node-on-testnet"></a>

This document details how to join the Secret Network `testnet` as a full node. Once your full node is running, you can turn it into a validator in the optional last step.

### Requirements <a href="#requirements" id="requirements"></a>

* Ubuntu/Debian host (with ZFS or LVM to be able to add more storage easily)
* A public IP address
* Open ports `TCP 26656 & 26657` _Note: If you're behind a router or firewall then you'll need to port forward on the network device._
* Reading https://docs.tendermint.com/master/tendermint-core/running-in-production.html
* RPC address of an already active node. You can use `bootstrap.secrettestnet.io:26657`, or any other node that exposes RPC services. Alternate RPC nodes available in the [API Registry](https://github.com/scrtlabs/api-registry).
* [Install SGX](../set-up/install-sgx.md)

#### Minimum requirements <a href="#minimum-requirements" id="minimum-requirements"></a>

* 16GB RAM
* 150GB SSD for Prune Everything, or default pruning. 1TB premium SSD for Archive nodes.
* 1 dedicated core of any Intel Skylake processor (Intel® 6th generation) or better (Xeon gen3 (Ice Lake) NOT supported)
* Motherboard with support for SGX in the BIOS

#### Recommended requirements <a href="#recommended-requirements" id="recommended-requirements"></a>

* 32GB RAM
* 512GB SSD
* 2 dedicated cores of any Intel Skylake processor (Intel® 6th generation) or better (Xeon gen3 (Ice Lake) NOT supported)
* Motherboard with support for SGX in the BIOS

### Installation <a href="#installation" id="installation"></a>

#### 0. Step up SGX on your local machine <a href="#_0-step-up-sgx-on-your-local-machine" id="_0-step-up-sgx-on-your-local-machine"></a>

See instructions for [setup](https://docs.scrt.network/node-guides/setup-sgx.html) and [verification](https://docs.scrt.network/node-guides/verify-sgx.html). See [registration](https://docs.scrt.network/node-guides/registration.html) if you'd like a more comprehensive overview on what's happening in these steps.

#### 1. Download the Secret Network package installer for Debian/Ubuntu: <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

```
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.3.1/secretnetwork_1.3.1_testnet_goleveldb_amd64.deb"
# check the hash of the downloaded binary
echo "9a2c72ba61b00abfa2a6652ff8b5006fa9ae84d9175d2328949d1496884933dd secretnetwork_1.3.1_testnet_goleveldb_amd64.deb" | sha256sum --check
```

([How to verify releases](https://docs.scrt.network/verify-releases.html))

#### 2. Install the package: <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```
sudo dpkg -i secretnetwork_1.3.1_testnet_goleveldb_amd64.deb
```

#### 3. Initialize your installation of the Secret Network. <a href="#_3-initialize-your-installation-of-the-secret-network" id="_3-initialize-your-installation-of-the-secret-network"></a>

Choose a **moniker** for yourself, and replace `<MONIKER>` with your moniker below. This moniker will serve as your public nickname in the network.

```
secretd init <MONIKER> --chain-id pulsar-2
```

#### 4. Download a copy of the Genesis Block file: `genesis.json` <a href="#_4-download-a-copy-of-the-genesis-block-file-genesis-json" id="_4-download-a-copy-of-the-genesis-block-file-genesis-json"></a>

```
wget -O ~/.secretd/config/genesis.json "https://storage.googleapis.com/stakeordie-pulsar-2/genesis.json"
```

#### 5. Validate the checksum for the `genesis.json` file you have just downloaded in the previous step: <a href="#_5-validate-the-checksum-for-the-genesis-json-file-you-have-just-downloaded-in-the-previous-step" id="_5-validate-the-checksum-for-the-genesis-json-file-you-have-just-downloaded-in-the-previous-step"></a>

```
echo "a48a5c2ba3f0d0ee077fc9a24514caaed3914e23e0de7b88163bb4d25e0866b8 $HOME/.secretd/config/genesis.json" | sha256sum --check
```

#### 6. Validate that the `genesis.json` is a valid genesis file: <a href="#_6-validate-that-the-genesis-json-is-a-valid-genesis-file" id="_6-validate-that-the-genesis-json-is-a-valid-genesis-file"></a>

```
secretd validate-genesis
```

#### 7. The rest of the commands should be run from the home folder (`/home/<your_username>`) <a href="#_7-the-rest-of-the-commands-should-be-ran-from-the-home-folder-home-your-username" id="_7-the-rest-of-the-commands-should-be-ran-from-the-home-folder-home-your-username"></a>

```
cd ~
```

#### 8. Initialize secret enclave <a href="#_8-initialize-secret-enclave" id="_8-initialize-secret-enclave"></a>

Make sure the directory `/opt/secret/.sgx_secrets` exists:

```
mkdir -p /opt/secret/.sgx_secrets
```

Make sure SGX is enabled and running or this step might fail.\
\
Create env variables:

```
export SCRT_ENCLAVE_DIR=/usr/lib
export SCRT_SGX_STORAGE=/opt/secret/.sgx_secrets
```

```
secretd init-enclave 
```

#### 9. Check that initialization was successful <a href="#_9-check-that-initialization-was-successful" id="_9-check-that-initialization-was-successful"></a>

Attestation certificate should have been created by the previous step

```
ls -lh /opt/secret/.sgx_secrets/attestation_cert.der
```

#### 10. Check your certificate is valid <a href="#_10-check-your-certificate-is-valid" id="_10-check-your-certificate-is-valid"></a>

Should print your 64 character registration key if it was successful.

```
PUBLIC_KEY=$(secretd parse /opt/secret/.sgx_secrets/attestation_cert.der  2> /dev/null | cut -c 3-)
echo $PUBLIC_KEY
```

#### 11. Config `secretcli`, generate a key and get some test-SCRT from the faucet <a href="#_11-config-secretcli-generate-a-key-and-get-some-test-scrt-from-the-faucet" id="_11-config-secretcli-generate-a-key-and-get-some-test-scrt-from-the-faucet"></a>

The steps using `secretcli` can be run on any machine, they don't need to be on the full node itself. We'll refer to the machine where you are using `secretcli` as the "CLI machine" below.

To run the steps with `secretcli` on another machine, [set up the CLI](https://docs.scrt.network/testnet/install\_cli.html) there.

Configure `secretcli`. Initially you'll be using a community node, as you'll need to connect to a running node and your own node is not running yet.

```
secretcli config chain-id pulsar-2
secretcli config node https://rpc.pulsar.griptapejs.com
secretcli config output json
```

Set up a key. Make sure you backup the mnemonic and the keyring password.

```
secretcli keys add $INSERT_YOUR_KEY_NAME
```

This will output your address, a 45 character-string starting with `secret1...`. Copy/paste it to get some test-SCRT from [the faucet](https://faucet.secrettestnet.io/). Continue when you have confirmed your account has some test-SCRT in it.

#### 12. Register your node on-chain <a href="#_12-register-your-node-on-chain" id="_12-register-your-node-on-chain"></a>

Run this step on the CLI machine. If you're using different CLI machine than the full node, copy `attestation_cert.der` from the full node to the CLI machine.

```
secretcli tx register auth /opt/secret/.sgx_secrets/attestation_cert.der --from $INSERT_YOUR_KEY_NAME --gas 250000
```

#### 13. Pull & check your node's encrypted seed from the network <a href="#_13-pull-check-your-node-s-encrypted-seed-from-the-network" id="_13-pull-check-your-node-s-encrypted-seed-from-the-network"></a>

Run this step on the CLI machine.

```
SEED=$(secretcli query register seed "$PUBLIC_KEY" | cut -c 3-)
echo $SEED
```

#### 14. Get additional network parameters <a href="#_14-get-additional-network-parameters" id="_14-get-additional-network-parameters"></a>

Run this step on the CLI machine.

These are necessary to configure the node before it starts.

```
secretcli query register secret-network-params
ls -lh ./io-master-cert.der ./node-master-cert.der
```

If you're using different CLI machine than the validator node, copy `node-master-cert.der` from the CLI machine to the validator node.

#### 15. Configure your secret node <a href="#_15-configure-your-secret-node" id="_15-configure-your-secret-node"></a>

From here on, run commands on the full node again.

```
mkdir -p ~/.secretd/.node
secretd configure-secret node-master-cert.der "$SEED"
```

#### 16. Add seeds and persistent peers to your configuration file. <a href="#_16-add-persistent-peers-to-your-configuration-file" id="_16-add-persistent-peers-to-your-configuration-file"></a>

```
# seeds
perl -i -pe 's/seeds = ""/seeds = "7a421a6f5f1618f7b6fdfbe4854985746f85d263\@108.62.104.102:26656,a72e376dca664bac55e8ce55a2e972a8ae2c995e\@144.202.126.98:26656,a941999e72f4726d276ef055a09cb8bedf8e7a9a\@45.35.77.30:26656,f95ba3da4a9eec559397f4b47b1539e24af6904c\@52.190.249.47:26656"/' ~/.secretd/config/config.toml

# persistent_peers
perl -i -pe 's/persistent_peers = ""/persistent_peers = "7a421a6f5f1618f7b6fdfbe4854985746f85d263\@108.62.104.102:26656,a72e376dca664bac55e8ce55a2e972a8ae2c995e\@144.202.126.98:26656,a941999e72f4726d276ef055a09cb8bedf8e7a9a\@45.35.77.30:26656,f95ba3da4a9eec559397f4b47b1539e24af6904c\@52.190.249.47:26656"/' ~/.secretd/config/config.toml
```

#### 17. Listen for incoming RPC requests so that light nodes can connect to you: <a href="#_17-listen-for-incoming-rpc-requests-so-that-light-nodes-can-connect-to-you" id="_17-listen-for-incoming-rpc-requests-so-that-light-nodes-can-connect-to-you"></a>

```
perl -i -pe 's/laddr = .+?26657"/laddr = "tcp:\/\/0.0.0.0:26657"/' ~/.secretd/config/config.toml
```

#### 18. Enable `secret-node` as a system service: <a href="#_18-enable-secret-node-as-a-system-service" id="_18-enable-secret-node-as-a-system-service"></a>

```
sudo systemctl enable secret-node
```

#### 19. Start `secret-node` as a system service: <a href="#_19-start-secret-node-as-a-system-service" id="_19-start-secret-node-as-a-system-service"></a>

```
sudo systemctl start secret-node
```

#### 20. If everything above worked correctly, the following command will show your node streaming blocks (this is for debugging purposes only, kill this command anytime with Ctrl-C): <a href="#_20-if-everything-above-worked-correctly-the-following-command-will-show-your-node-streaming-blocks" id="_20-if-everything-above-worked-correctly-the-following-command-will-show-your-node-streaming-blocks"></a>

```
journalctl -f -u secret-node
```

```
-- Logs begin at Mon 2020-02-10 16:41:59 UTC. --
Feb 10 21:18:34 ip-172-31-41-58 secretd[8814]: I[2020-02-10|21:18:34.307] Executed block                               module=state height=2629 validTxs=0 invalidTxs=0
Feb 10 21:18:34 ip-172-31-41-58 secretd[8814]: I[2020-02-10|21:18:34.317] Committed state                              module=state height=2629 txs=0 appHash=34BC6CF2A11504A43607D8EBB2785ED5B20EAB4221B256CA1D32837EBC4B53C5
Feb 10 21:18:39 ip-172-31-41-58 secretd[8814]: I[2020-02-10|21:18:39.382] Executed block                               module=state height=2630 validTxs=0 invalidTxs=0
Feb 10 21:18:39 ip-172-31-41-58 secretd[8814]: I[2020-02-10|21:18:39.392] Committed state                              module=state height=2630 txs=0 appHash=17114C79DFAAB82BB2A2B67B63850864A81A048DBADC94291EB626F584A798EA
Feb 10 21:18:44 ip-172-31-41-58 secretd[8814]: I[2020-02-10|21:18:44.458] Executed block                               module=state height=2631 validTxs=0 invalidTxs=0
Feb 10 21:18:44 ip-172-31-41-58 secretd[8814]: I[2020-02-10|21:18:44.468] Committed state                              module=state height=2631 txs=0 appHash=D2472874A63CE166615E5E2FDFB4006ADBAD5B49C57C6B0309F7933CACC24B10
^C
```

You are now a full node. 🎉

#### 21. Get your node ID with: <a href="#_21-get-your-node-id-with" id="_21-get-your-node-id-with"></a>

```
secretd tendermint show-node-id
```

And publish yourself as a node with this ID:

```
<your-node-id>@<your-public-ip>:26656
```

Be sure to point your CLI to your running node instead of the bootstrap node

```
secretcli config node tcp://localhost:26657
```

If someone wants to add you as a peer, have them add the above address to their `persistent_peers` in their `~/.secretd/config/config.toml`.

And if someone wants to use your node from their `secretcli` then have them run:

```
secretcli config chain-id pulsar-2
secretcli config output json
secretcli config indent true
secretcli config node tcp://<your-public-ip>:26657
```

#### 22. Optional: make your full node a validator <a href="#_22-optional-make-your-full-node-a-validator" id="_22-optional-make-your-full-node-a-validator"></a>

To turn your full node into a validator, see [Join Testnet as a Validator](run-a-full-node.md#how-to-join-secret-network-as-a-full-node-on-testnet).

#### 23. Optional: State Sync <a href="#_23-optional-state-sync" id="_23-optional-state-sync"></a>

You can skip syncing from scratch or download a snapshot by [State Syncing](https://docs.scrt.network/node-guides/state-sync.html#mainnet-state-sync) to the current block.

