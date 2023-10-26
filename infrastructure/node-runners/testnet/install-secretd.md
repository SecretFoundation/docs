# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download, Verify and Install `secretd` <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.11

wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.11.0-beta.18/secretnetwork_1.11.0-beta.18_testnet_goleveldb_amd64.deb"

# Verify the v1.11 binaries
echo 'a84b5097166aa9f518004b184a17771c5433f89be1bae7e6649c949a3eae240b  secretnetwork_1.11.0-beta.18_testnet_goleveldb_amd64.deb' | sha256sum --check

# Install v1.11 binaries
sudo apt install -y "./secretnetwork_1.11.0-beta.18_testnet_goleveldb_amd64.deb"

# verify installation
secretd version
# 1.11.0-beta.14

```

