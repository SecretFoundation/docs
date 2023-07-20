# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download And Verify `secretd` <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.9.0-beta.6

## goleveldb
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.9.3/secretnetwork_1.9.3_testnet_goleveldb_amd64.deb"
echo "2573d2501a8a39c21b1971bd6ff474e5d905782868c3f81a0fe3525d7f91a404  secretnetwork_1.9.3_testnet_goleveldb_amd64.deb" | sha256sum --check


```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
# Install 1.9.3 binaries
sudo apt install -y ./secretnetwork_1.9.3_testnet_*_amd64.deb

# verify installation
secretd version
# 1.9.3
```
