# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download And Verify `secretd` <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.9.0-beta.3

## goleveldb
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.9.0-beta.3/secretnetwork_1.9.0-beta.3_testnet_goleveldb_amd64.deb"
echo "5f5e978056e1b7c41f545772c55139274ede8f15c5f2511561f7dbcb6a6a3e5b secretnetwork_1.9.0-beta.3_testnet_goleveldb_amd64.deb" | sha256sum --check

## rocksdb
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.9.0-beta.3/secretnetwork_1.9.0-beta.3_testnet_rocksdb_amd64.deb"
echo "0f7da3d0dfe8786a3e0dfd2344b9e567186cbef24af4a2b752fdc2b38c8b44a2 secretnetwork_1.9.0-beta.3_testnet_rocksdb_amd64.deb" | sha256sum --check

```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
# Install 1.9.0-beta.3 binaries
sudo apt install -y ./secretnetwork_1.9.0-beta.3_testnet_*_amd64.deb

# verify installation
secretd version
# 1.9.0-beta.3
```
