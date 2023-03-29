# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download and Verify `secretd`  <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.6.0
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.8.0/secretnetwork_1.8.0_mainnet_goleveldb_amd64.deb"

# verify download
# wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.8.0/secretnetwork_1.8.0_mainnet_goleveldb_amd64.deb"
# echo "d1bb747afd5cdbbd5330f37a8c1eeba1312cc891af19a1f589eb3e3f44630e23 secretnetwork_1.8.0_mainnet_goleveldb_amd64.deb" | sha256sum --check
```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
sudo apt install -y ./secretnetwork_1.8.0_mainnet_*_amd64.deb

# verify installation
secretd version
# 1.8.0
```
