# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download and Verify `secretd` <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.9.2
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.9.2/secretnetwork_1.9.2_mainnet_goleveldb_amd64.deb"

# verify download
echo "3c62539e1e5764bc3d5c6929d63627586f5a062afebb34cc9256bf19c5022364 secretnetwork_1.9.2_mainnet_goleveldb_amd64.deb" | sha256sum --check
```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
sudo apt install -y ./secretnetwork_1.9.2_mainnet_*_amd64.deb

# verify installation
secretd version
# 1.9.2
```
