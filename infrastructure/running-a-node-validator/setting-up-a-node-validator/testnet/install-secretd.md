# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download, Verify and Install `secretd` <a href="#id-1-download-the-secret-network-package-installer-for-debian-ubuntu" id="id-1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.15.0-beta.15

wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.14.0/secretnetwork_1.14.0_testnet_goleveldb_amd64.deb"

# Verify the v1.15.0-beta.15 binaries
echo 'd57c81dd6bdcc9bed920c0beed599bd8b8d45b1f2802d50ecd2cfe56489d90a5 secretnetwork_1.15.0-beta.15_testnet_goleveldb_amd64_ubuntu-22.04.deb' | sha256sum --check

# Install v1.15.0-beta.15 binaries
sudo apt install -y "./secretnetwork_1.15.0-beta.15_testnet_goleveldb_amd64_ubuntu-22.04.deb"

# verify installation
secretd version
# v1.15.0-beta.15

```
