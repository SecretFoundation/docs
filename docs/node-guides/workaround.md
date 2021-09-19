# Secret-3 new node Workaround

[Credit to Gaia / FreshSCRTs](https://secretnodes.com/secret/chains/secret-3/validators/6AFCF9EB1AC264954C784274A6ABF012D50EB0B6)

:warning: This guide is currently using a work around to spin up a node. It will be updated after new binaries are released.

- [SGX](#SGX)
  - [1. Install old binaries on your SGX machine](#2-install-the-old-binaries-on-your-sgx-machine)
  - [2. Install the new binaries on your SGX machine](#2-install-the-Secret-Network-binaries-on-your-machine)
  - [3. Configure your node](#3-configure-your-node)
  - [4. Wallets](#4-wallets)
  - [5. Import the quicksync data](#5-import-the-quicksync-data)
  - [6. Finish setup and Start Node](#7-finish-setup-and-start-node)

# SGX

Resources:

- [Setup SGX](setup-sgx.md)
- [Verify SGX](verify-sgx.md)

Download the SGX script and execute it

```bash
wget https://raw.githubusercontent.com/SecretFoundation/docs/main/docs/node-guides/sgx
sudo bash sgx
```

## 2. Install the old binaries on your machine

These are the official 1.0.4 binaries.

On the machine:

```bash
cd ~

wget https://github.com/enigmampc/SecretNetwork/releases/download/v1.0.4/secretnetwork_1.0.4_amd64.deb

echo "97c1aa2421a203184e541928cc9c409c50afcfac5cbd55993e6a9593399587f9 secretnetwork_1.0.4_amd64.deb" | sha256sum --check

sudo apt install ./secretnetwork_1.0.4_amd64.deb

secretd init-enclave
```

## 3. Install the new binaries on your machine

Remove the 1.0.4 binaries and install the 1.0.5 binaries.

On the machine:

```bash
cd ~

sudo apt purge -y secretnetwork

wget "https://github.com/enigmampc/SecretNetwork/releases/download/v1.0.5/secretnetwork_1.0.5_amd64.deb"

echo "6b0259f3669ab81d41424c1db5cea5440b00eb3426cac3f9246d0223bbf9f74c secretnetwork_1.0.5_amd64.deb" | sha256sum --check

sudo apt install -y ./secretnetwork_1.0.5_amd64.deb

sudo chmod +x /usr/local/bin/secretd
```

## 3. Configure your node

Create the enclave attestation certificate and store its public key:

```bash
secretd init <MONIKER> --chain-id secret-3

PUBLIC_KEY=$(secretd parse attestation_cert.der 2> /dev/null | cut -c 3-)
echo $PUBLIC_KEY
```

```bash
secretcli config chain-id secret-2
secretcli config node http://api.scrt.network:26656
secretcli config output json
secretcli config indent true
```

## 4. Wallets

If you haven't **already created a key**, use these steps to create a secret address and send some SCRT to it. The key will be used to register your node with the Secret Network.

##### Generate a new key pair for yourself

(change `<key-alias>` with any word of your choice, this is just for your internal/personal reference):

```bash
secretcli keys add <key-alias>
```

**:warning:Note:warning:: Backup the mnemonics!**
**:warning:Note:warning:: Please make sure you also [backup your validator](backup-a-validator.md)**

**Note**: If you already have a key you can import it with the bip39 mnemonic with `secretcli keys add <key-alias> --recover` or with `secretcli keys export` (exports to `stderr`!!) & `secretcli keys import`.

Then transfer funds to the address you just created.

##### Check that you have the funds:

```bash
secretcli q account $(secretcli keys show -a <key-alias>)
```

If you get the following message, it means that you have no tokens yet:

```bash
ERROR: unknown address: account secret1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx does not exist
```

#### Register and configure your node:

_NOTE_: Substitute **$YOUR_KEY_NAME** (below) with the `key-alias` you created earlier. Be sure to exclude the `$` character from the keyname.

```bash
secretcli tx register auth ./attestation_cert.der --from "$YOUR_KEY_NAME" --gas 250000 --gas-prices 0.25uscrt

SEED=$(secretcli query register seed "$PUBLIC_KEY" | cut -c 3-)
echo $SEED

secretcli query register secret-network-params

mkdir -p ~/.secretd/.node

secretd configure-secret node-master-cert.der "$SEED"

perl -i -pe 's/^persistent_peers = ".*?"/persistent_peers = "e768e605f9a3a8eb7c36c36a6dbf9bd707ac0bd0\@bootstrap.secretnodes.org:26667"/' ~/.secretd/config/config.toml
perl -i -pe 's;laddr = "tcp://127.0.0.1:26657";laddr = "tcp://0.0.0.0:26657";' ~/.secretd/config/config.toml
```

Configure CLI settings

```bash
secretcli config chain-id secret-2
secretcli config node http://api.scrt.network:26656
secretcli config output json
secretcli config indent true
```

## 5. Import the quicksync data

```bash
cd ~

curl https://quicksync.scrt.network/secret-3-sep19.tar.gz -o secret-3-sep19.tar.gz

tar -xf secret-3-sep19.tar.gz
```

## 6. Finish setup and start node

```bash
secretcli config node tcp://0.0.0.0:26657

sudo systemctl enable secret-node

sudo systemctl start secret-node # (Now your new node is live and catching up)
```
