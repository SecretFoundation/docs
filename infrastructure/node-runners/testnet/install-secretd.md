# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download, Verify and Install `secretd` <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.12

wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.12.0-beta.8/secretnetwork_1.12.0-beta.8_testnet_goleveldb_amd64.deb"

# Verify the v1.12 binaries
echo '10bd6edf4425041bfaaf43df3741b8a81151a707249b4714f521f8abc56776d1 secretnetwork_1.12.0-beta.8_testnet_goleveldb_amd64.deb' | sha256sum --check

# Install v1.12 binaries
sudo apt install -y "./secretnetwork_1.12.0-beta.8_testnet_goleveldb_amd64.deb"

# verify installation
secretd version
# 1.12.0-beta.8

```

