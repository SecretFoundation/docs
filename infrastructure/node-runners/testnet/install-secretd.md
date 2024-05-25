# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download, Verify and Install `secretd` <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.13

wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.13.0-beta.9/secretnetwork_1.13.0-beta.9_testnet_goleveldb_amd64.deb"

# Verify the v1.13 binaries
echo '1fb5a1853cb9c25b8905b51578ea5ab8f467c34a2ecf52c84d2f2b00ce9ca9ce secretnetwork_1.13.0-beta.9_testnet_goleveldb_amd64.deb' | sha256sum --check

# Install v1.13 binaries
sudo apt install -y "./secretnetwork_1.13.0-beta.9_testnet_goleveldb_amd64.deb"

# verify installation
secretd version
# 1.13.0-beta.9

```

