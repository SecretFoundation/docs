# Run a full node on the Secret Network

:warning: This guide is currently using a work around to spin up a node. It will be updated after new binaries are released.

- [Validators](#validators)
  - [1. Install the new binaries on your SGX machine](#2-install-the-new-binaries-on-your-sgx-machine)
  - [2. Install the new binaries on your SGX machine](#2-install-the-Secret-Network-binaries-on-your-machine)
  - [3. Import the quicksync data](#3-import-the-quicksync-data)
  - [4. Migrate your validator's signing key](#4-migrate-your-validators-signing-key)
  - [5. Migrate your node's encrypted seed](#5-migrate-your-nodes-encrypted-seed)
  - [6. Migrate your validator's wallet](#6-migrate-your-validators-wallet)
  - [7. Set up your SGX machine and become a `secret-3` validator](#7-set-up-your-sgx-machine-and-become-a-secret-3-validator)
- [In case of an upgrade failure](#in-case-of-an-upgrade-failure)
- [Removing an installation](#removing-an-installation)
  - [Appendix: Registration on a new Secret-3 node](#appendix-registration-on-a-new-secret-3-node)

# Validators

Resources:

- [Setup SGX](node-guides/setup-sgx.md)
- [Verify SGX](node-guides/verify-sgx.md)

Download the SGX script and execute it

```bash
wget https://raw.githubusercontent.com/SecretFoundation/docs/main/docs/node-guides/sgx
sudo bash sgx
```

## 2. Install the Secret Network 1.0.4 binaries on your machine

(This is a community shared work around to getting a node up and running currently)

On the machine:

```bash
cd ~

wget https://github.com/enigmampc/SecretNetwork/releases/download/v1.0.4/secretnetwork_1.0.4_amd64.deb

echo "97c1aa2421a203184e541928cc9c409c50afcfac5cbd55993e6a9593399587f9 secretnetwork_1.0.4_amd64.deb" | sha256sum --check

sudo apt install ./secretnetwork_1.0.4_amd64.deb

secretd init-enclave
```

## 3. Install the Secret Network 1.0.5 binaries on your machine

On the machine:

```bash
cd ~

wget "https://github.com/enigmampc/SecretNetwork/releases/download/v1.0.5/secretnetwork_1.0.5_amd64.deb"

echo "6b0259f3669ab81d41424c1db5cea5440b00eb3426cac3f9246d0223bbf9f74c secretnetwork_1.0.5_amd64.deb" | sha256sum --check

sudo apt install -y ./secretnetwork_1.0.5_amd64.deb

sudo chmod +x /usr/local/bin/secretd

secretd init <MONIKER> --chain-id secret-3
```

## 3. Import the quicksync data

```bash
cd ~

wget "https://engfilestorage.blob.core.windows.net/quicksync-secret-3/quicksync.tar.xz"

echo "66fe25ae54a8c3957999300c5955ee74452c7826e0a5e0eabc2234058e5d601d quicksync.tar.xz" | sha256sum --check

pv quicksync.tar.xz | tar -xJf -
```

# In case of an upgrade failure

If after a few hours the Enigma team announces on the chat that the upgrade failed, we will relaunch `secret-2`.

1. On the old machine (`secret-2`):

   ```bash
   perl -i -pe 's/^halt-time =.*/halt-time = 0/' ~/.secretd/config/app.toml

   sudo systemctl restart secret-node
   ```

2. Wait for 67% of voting power to come back online.

# Removing an installation

You can remove previous `secretnetwork` installations and start fresh using:

```bash
cd ~
sudo systemctl stop secret-node
secretd unsafe-reset-all
sudo apt purge -y secretnetwork
rm -rf ~/.secretd/*
```

## Appendix: Registration on a new Secret-3 node

```bash
cd ~

rm ~/.secretd/config/genesis.json

secretd init <MONIKER> --chain-id secret-3

wget -O ~/.secretd/config/genesis.json "https://github.com/enigmampc/SecretNetwork/releases/download/v1.0.5/genesis.json"

echo "1c5682a609369c37e2ca10708fe28d78011c2006045a448cdb4e833ef160bf3f .secretd/config/genesis.json" | sha256sum --check

secretd init-enclave # Can be skipped if you're installing secret-3 on your secret-2 machine

PUBLIC_KEY=$(secretd parse attestation_cert.der 2> /dev/null | cut -c 3-)
echo $PUBLIC_KEY

secretcli config chain-id secret-3
secretcli config node http://20.51.225.193:26657
secretcli config trust-node true
secretcli config output json
secretcli config indent true

secretcli tx register auth ./attestation_cert.der --from "$YOUR_KEY_NAME" --gas 250000 --gas-prices 0.25uscrt # Can be skipped if you're installing secret-3 on your secret-2 machine

SEED=$(secretcli query register seed "$PUBLIC_KEY" | cut -c 3-) # Can be skipped if you're installing secret-3 on your secret-2 machine
echo $SEED # Can be skipped if you're installing secret-3 on your secret-2 machine

secretcli query register secret-network-params # Can be skipped if you're installing secret-3 on your secret-2 machine

mkdir -p ~/.secretd/.node

secretd configure-secret node-master-cert.der "$SEED" # Can be skipped if you're installing secret-3 on your secret-2 machine

perl -i -pe 's/persistent_peers =.*/persistent_peers = "27db2f21cfcbfa40705d5c516858f51d5af07e03\@20.51.225.193:26656"/' ~/.secretd/config/config.toml

sudo systemctl enable secret-node

sudo systemctl start secret-node # (Now your new node is live and catching up)

secretcli config node tcp://localhost:26657
```
