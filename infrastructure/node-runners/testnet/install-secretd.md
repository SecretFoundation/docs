# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download And Verify `secretd` <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.9.0-beta.6

## goleveldb
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.9.0-beta.6/secretnetwork_1.9.0-beta.6_testnet_goleveldb_amd64.deb"
echo "fe5097d8bd78699ba453896fee88c8ca4bbf1c1f6128c11b1fb22ab8540edab7  secretnetwork_1.9.0-beta.6_testnet_goleveldb_amd64.deb" | sha256sum --check


```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
# Install 1.9.0-beta.6 binaries
sudo apt install -y ./secretnetwork_1.9.0-beta.6_testnet_*_amd64.deb

# verify installation
secretd version
# 1.9.0-beta.6
```
