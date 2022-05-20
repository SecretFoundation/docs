# Run A Full Node

## How To Join Secret Network as a Full Node on Testnet <a href="#how-to-join-secret-network-as-a-full-node-on-testnet" id="how-to-join-secret-network-as-a-full-node-on-testnet"></a>

This document details how to join the Secret Network `testnet` as a full node. Once your full node is running, you can turn it into a validator in the optional last step.

### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#requirements)Requirements <a href="#requirements" id="requirements"></a>

* Ubuntu/Debian host (with ZFS or LVM to be able to add more storage easily)
* A public IP address
* Open ports `TCP 26656 & 26657` _Note: If you're behind a router or firewall then you'll need to port forward on the network device._
* Reading https://docs.tendermint.com/master/tendermint-core/running-in-production.html
* RPC address of an already active node. You can use `bootstrap.secrettestnet.io:26657`, or any other node that exposes RPC services.

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#minimum-requirements)Minimum requirements <a href="#minimum-requirements" id="minimum-requirements"></a>

* 1GB RAM
* 150GB SSD for Prune Everyting, or default pruining. 1TB premium SSD for Archive nodes.
* 1 dedicated core of any Intel Xeon CPU with SGX through SPS.

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#recommended-requirements)Recommended requirements <a href="#recommended-requirements" id="recommended-requirements"></a>

* 4GB RAM
* 256GB SSD for Prune Everyting, or default pruining. 1TB premium SSD for Archive nodes.
* 2 dedicated core of any Intel Xeon CPU with SGX through SPS.
* Known Working CPUs (E-2276G, E-2278G, E-2286G, E-2288G) Non Xeon CPUs are reported to not get updated often enough to be compliant.
* Motherboard with support for SGX in the BIOS

Refer to https://ark.intel.com/content/www/us/en/ark.html#@Processors if unsure if your processor supports SGX.

### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#installation)Installation <a href="#installation" id="installation"></a>

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_0-step-up-sgx-on-your-local-machine)0. Step up SGX on your local machine <a href="#_0-step-up-sgx-on-your-local-machine" id="_0-step-up-sgx-on-your-local-machine"></a>

See instructions for [setup](https://docs.scrt.network/testnet/setup-sgx-testnet.html) and [verification](https://docs.scrt.network/testnet/verify-sgx.html).

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_1-download-the-secret-network-package-installer-for-debian-ubuntu)1. Download the Secret Network package installer for Debian/Ubuntu: <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

```
wget https://github.com/chainofsecrets/SecretNetwork/releases/download/v1.0.0/secretnetwork_1.0.0_amd64.deb
```

([How to verify releases](https://docs.scrt.network/verify-releases.html))

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_2-install-the-package)2. Install the package: <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```
sudo dpkg -i secretnetwork_1.0.0_amd64.deb
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_3-initialize-your-installation-of-the-secret-network)3. Initialize your installation of the Secret Network. <a href="#_3-initialize-your-installation-of-the-secret-network" id="_3-initialize-your-installation-of-the-secret-network"></a>

Choose a **moniker** for yourself, and replace `<MONIKER>` with your moniker below. This moniker will serve as your public nickname in the network.

```
secretd init <MONIKER> --chain-id holodeck-2
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_4-download-a-copy-of-the-genesis-block-file-genesis-json)4. Download a copy of the Genesis Block file: `genesis.json` <a href="#_4-download-a-copy-of-the-genesis-block-file-genesis-json" id="_4-download-a-copy-of-the-genesis-block-file-genesis-json"></a>

```
wget -O ~/.secretd/config/genesis.json "https://github.com/chainofsecrets/SecretNetwork/releases/download/v1.0.0/holodeck-2-genesis.json"
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_5-validate-the-checksum-for-the-genesis-json-file-you-have-just-downloaded-in-the-previous-step)5. Validate the checksum for the `genesis.json` file you have just downloaded in the previous step: <a href="#_5-validate-the-checksum-for-the-genesis-json-file-you-have-just-downloaded-in-the-previous-step" id="_5-validate-the-checksum-for-the-genesis-json-file-you-have-just-downloaded-in-the-previous-step"></a>

```
echo "e45d6aa9825bae70c277509c8346122e265d64cb4211c23def4ae8f6bf3da2f1 $HOME/.secretd/config/genesis.json" | sha256sum --check
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_6-validate-that-the-genesis-json-is-a-valid-genesis-file)6. Validate that the `genesis.json` is a valid genesis file: <a href="#_6-validate-that-the-genesis-json-is-a-valid-genesis-file" id="_6-validate-that-the-genesis-json-is-a-valid-genesis-file"></a>

```
secretd validate-genesis
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_7-the-rest-of-the-commands-should-be-ran-from-the-home-folder-home-your-username)7. The rest of the commands should be ran from the home folder (`/home/<your_username>`) <a href="#_7-the-rest-of-the-commands-should-be-ran-from-the-home-folder-home-your-username" id="_7-the-rest-of-the-commands-should-be-ran-from-the-home-folder-home-your-username"></a>

```
cd ~
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_8-initialize-secret-enclave)8. Initialize secret enclave <a href="#_8-initialize-secret-enclave" id="_8-initialize-secret-enclave"></a>

Make sure the directory `~/.sgx_secrets` exists:

```
mkdir -p ~/.sgx_secrets
```

Make sure SGX is enabled and running or this step might fail.

```
export SCRT_ENCLAVE_DIR=/usr/lib
```

```
secretd init-enclave 
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_9-check-that-initialization-was-successful)9. Check that initialization was successful <a href="#_9-check-that-initialization-was-successful" id="_9-check-that-initialization-was-successful"></a>

Attestation certificate should have been created by the previous step

```
ls -lh ./attestation_cert.der
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_10-check-your-certificate-is-valid)10. Check your certificate is valid <a href="#_10-check-your-certificate-is-valid" id="_10-check-your-certificate-is-valid"></a>

Should print your 64 character registration key if it was successful.

```
PUBLIC_KEY=$(secretd parse attestation_cert.der 2> /dev/null | cut -c 3-)
echo $PUBLIC_KEY
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_11-config-secretcli-generate-a-key-and-get-some-test-scrt-from-the-faucet)11. Config `secretcli`, generate a key and get some test-SCRT from the faucet <a href="#_11-config-secretcli-generate-a-key-and-get-some-test-scrt-from-the-faucet" id="_11-config-secretcli-generate-a-key-and-get-some-test-scrt-from-the-faucet"></a>

The steps using `secretcli` can be run on any machine, they don't need to be on the full node itself. We'll refer to the machine where you are using `secretcli` as the "CLI machine" below.

To run the steps with `secretcli` on another machine, [set up the CLI](https://docs.scrt.network/testnet/install\_cli.html) there.

Configure `secretcli`. Initially you'll be using the bootstrap node, as you'll need to connect to a running node and your own node is not running yet.

```
secretcli config chain-id holodeck-2
secretcli config node tcp://bootstrap.secrettestnet.io:26657
secretcli config output json
secretcli config indent true
secretcli config trust-node true
```

Set up a key. Make sure you backup the mnemonic and the keyring password.

```
secretcli keys add $INSERT_YOUR_KEY_NAME
```

This will output your address, a 45 character-string starting with `secret1...`. Copy/paste it to get some test-SCRT from [the faucet](https://faucet.secrettestnet.io/). Continue when you have confirmed your account has some test-SCRT in it.

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_12-register-your-node-on-chain)12. Register your node on-chain <a href="#_12-register-your-node-on-chain" id="_12-register-your-node-on-chain"></a>

Run this step on the CLI machine. If you're using different CLI machine than the full node, copy `attestation_cert.der` from the full node to the CLI machine.

```
secretcli tx register auth <path/to/attestation_cert.der> --from $INSERT_YOUR_KEY_NAME --gas 250000
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_13-pull-check-your-node-s-encrypted-seed-from-the-network)13. Pull & check your node's encrypted seed from the network <a href="#_13-pull-check-your-node-s-encrypted-seed-from-the-network" id="_13-pull-check-your-node-s-encrypted-seed-from-the-network"></a>

Run this step on the CLI machine.

```
SEED=$(secretcli query register seed "$PUBLIC_KEY" | cut -c 3-)
echo $SEED
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_14-get-additional-network-parameters)14. Get additional network parameters <a href="#_14-get-additional-network-parameters" id="_14-get-additional-network-parameters"></a>

Run this step on the CLI machine.

These are necessary to configure the node before it starts.

```
secretcli query register secret-network-params
ls -lh ./io-master-cert.der ./node-master-cert.der
```

If you're using different CLI machine than the validator node, copy `node-master-cert.der` from the CLI machine to the validator node.

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_15-configure-your-secret-node)15. Configure your secret node <a href="#_15-configure-your-secret-node" id="_15-configure-your-secret-node"></a>

From here on, run commands on the full node again.

```
mkdir -p ~/.secretd/.node
secretd configure-secret node-master-cert.der "$SEED"
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_16-add-persistent-peers-to-your-configuration-file)16. Add persistent peers to your configuration file. <a href="#_16-add-persistent-peers-to-your-configuration-file" id="_16-add-persistent-peers-to-your-configuration-file"></a>

You can also use Chain of Secrets' node:

```
perl -i -pe 's/persistent_peers = ""/persistent_peers = "64b03220d97e5dc21ec65bf7ee1d839afb6f7193\@bootstrap.secrettestnet.io:26656"/' ~/.secretd/config/config.toml
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_17-listen-for-incoming-rpc-requests-so-that-light-nodes-can-connect-to-you)17. Listen for incoming RPC requests so that light nodes can connect to you: <a href="#_17-listen-for-incoming-rpc-requests-so-that-light-nodes-can-connect-to-you" id="_17-listen-for-incoming-rpc-requests-so-that-light-nodes-can-connect-to-you"></a>

```
perl -i -pe 's/laddr = .+?26657"/laddr = "tcp:\/\/0.0.0.0:26657"/' ~/.secretd/config/config.toml
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_18-enable-secret-node-as-a-system-service)18. Enable `secret-node` as a system service: <a href="#_18-enable-secret-node-as-a-system-service" id="_18-enable-secret-node-as-a-system-service"></a>

```
sudo systemctl enable secret-node
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_19-start-secret-node-as-a-system-service)19. Start `secret-node` as a system service: <a href="#_19-start-secret-node-as-a-system-service" id="_19-start-secret-node-as-a-system-service"></a>

```
sudo systemctl start secret-node
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_20-if-everything-above-worked-correctly-the-following-command-will-show-your-node-streaming-blocks-this-is-for-debugging-purposes-only-kill-this-command-anytime-with-ctrl-c)20. If everything above worked correctly, the following command will show your node streaming blocks (this is for debugging purposes only, kill this command anytime with Ctrl-C): <a href="#_20-if-everything-above-worked-correctly-the-following-command-will-show-your-node-streaming-blocks" id="_20-if-everything-above-worked-correctly-the-following-command-will-show-your-node-streaming-blocks"></a>

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

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_21-get-your-node-id-with)21. Get your node ID with: <a href="#_21-get-your-node-id-with" id="_21-get-your-node-id-with"></a>

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
secretcli config chain-id holodeck-2
secretcli config output json
secretcli config indent true
secretcli config node tcp://<your-public-ip>:26657
```

#### [#](https://docs.scrt.network/testnet/run-full-node-testnet.html#\_22-optional-make-your-full-node-a-validator)22. Optional: make your full node a validator <a href="#_22-optional-make-your-full-node-a-validator" id="_22-optional-make-your-full-node-a-validator"></a>

Your full node is now part of the network, storing and verifying chain data and Secret Contracts, and helping to distribute transactions and blocks. It's usable as a sentry node, for people to connect their CLI or light clients, or just to support the network.

It is however not producing blocks yet, and you can't delegate funds to it for staking. To do that that you'll have to turn it into a validator by submitting a `create-validator` transaction.

On the full node, get the pubkey of the node:

```
secretd tendermint show-validator
```

The pubkey is an 83-character string starting with `secretvalconspub...`.

On the CLI machine, run the following command. The account you use becomes the operator account for your validator, which you'll use to collect rewards, participate in on-chain governance, etc, so make sure you keep good backups of the key. `<moniker>` is the name for your validator which is shown e.g. in block explorers.

```
secretcli tx staking create-validator \
  --amount=<amount-to-delegate-to-yourself>uscrt \
  --pubkey=<pubkey of the full node> \
  --commission-rate="0.10" \
  --commission-max-rate="0.20" \
  --commission-max-change-rate="0.01" \
  --min-self-delegation="1" \
  --moniker="<moniker>" \
  --from=$INSERT_YOUR_KEY_NAME
```

The `create-validator` command allows using some more parameters. For more info on these and the additional parameters, run `secretcli tx staking create-validator --help`.

After you submitted the transaction, check you've been added as a validator:

```
secretcli q staking validators | grep moniker
```

Congratulations! You are now running a validator on the Secret Network testnet.
