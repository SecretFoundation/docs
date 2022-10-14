# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download and Verify `secretd`  <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.4.0
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.4.0-patch.1/secretnetwork_1.4.0-patch.1_mainnet_goleveldb_amd64.deb"

# verify download
# echo "3fa95c373cc85277e6ae85256c5261aa99b9128255162c8e467e0498fd3017a0 secretnetwork_1.4.0-patch.1_mainnet_goleveldb_amd64.deb" | sha256sum --check
# secretnetwork_1.4.0_mainnet_goleveldb_amd64.deb: OK
```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
sudo apt install -y ./secretnetwork_1.4.0-patch.1_mainnet_*_amd64.deb

# verify installation
secretd version
# 1.4.0
```
