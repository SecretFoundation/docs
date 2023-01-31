# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download And Verify `secretd`  <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.7.0-rc.2

## goleveldb
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.7.0-rc.2/secretnetwork_1.7.0-rc.2_testnet_goleveldb_amd64.deb"
echo "9c6266f3e4bf0cac968e6a999ee5f7e7c7294c59f8fbbb7aa7237b468b0d72ad secretnetwork_1.7.0-rc.2_testnet_goleveldb_amd64.deb" | sha256sum --check

## rocksdb
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.7.0-rc.2/secretnetwork_1.7.0-rc.2_testnet_rocksdb_amd64.deb"
echo "9c6266f3e4bf0cac968e6a999ee5f7e7c7294c59f8fbbb7aa7237b468b0d72ad secretnetwork_1.7.0-rc.2_testnet_rocksdb_amd64.deb" | sha256sum --check

```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
# Install 1.7.0 binaries
sudo apt install -y ./secretnetwork_1.7.0-rc.2_testnet_*_amd64.deb

# verify installation
secretd version
# 1.7.0-rc.2
```
