# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download, Verify and Install `secretd` <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.14

wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.14.0/secretnetwork_1.14.0_testnet_goleveldb_amd64.deb"

# Verify the v1.14 binaries
echo '6276c53e1c5e466782d6883a1cb3c77b936198b5cb0945d837022b9599a22923  secretnetwork_1.14.0_testnet_goleveldb_amd64.deb' | sha256sum --check

# Install v1.14 binaries
sudo apt install -y "./secretnetwork_1.14.0_testnet_goleveldb_amd64.deb"

# verify installation
secretd version
# 1.14.0

```

