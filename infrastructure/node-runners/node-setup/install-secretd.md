# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download and Verify `secretd` <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.12.1
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.12.1/secretnetwork_1.12.1_mainnet_goleveldb_amd64.deb"

# verify download
echo '0f6ebfb2513c21c88ba828648d16f9429786e2c9be216baff03ba9846545c2ea secretnetwork_1.12.1_mainnet_goleveldb_amd64.deb' | sha256sum --check
```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
sudo apt install -y ./secretnetwork_1.12.1_mainnet_*_amd64.deb

# verify installation
secretd version
# 1.12.1
```
