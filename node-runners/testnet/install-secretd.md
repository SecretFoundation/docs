# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download And Verify `secretd`  <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.3.1
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.3.1/secretnetwork_1.3.1_testnet_goleveldb_amd64.deb"

# verify download
echo "9a2c72ba61b00abfa2a6652ff8b5006fa9ae84d9175d2328949d1496884933dd secretnetwork_1.3.1_testnet_goleveldb_amd64.deb" | sha256sum --check
# secretnetwork_1.3.1_testnet_goleveldb_amd64.deb: OK
```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
sudo dpkg -i secretnetwork_1.3.1_testnet_*_amd64.deb

# verify installation
secretd version
# 1.3.1
```
