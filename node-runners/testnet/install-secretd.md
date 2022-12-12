# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download And Verify `secretd`  <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.5.0-beta.4

## goleveldb
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.6.0-rc.2/secretnetwork_1.6.0-rc.2_testnet_goleveldb_amd64.deb"
echo "568dcc85feccffe22091f4258eb32754f60b7563e7dba4b817c1fd5d2afb3036  secretnetwork_1.6.0-rc.2_testnet_goleveldb_amd64.deb" | sha256sum --check

## rocksdb
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.6.0-rc.2/secretnetwork_1.6.0-rc.2_testnet_rocksdb_amd64.deb"
echo "8f02ab1b77338b5461521f70ed5b3f1806402a7fab48195dc77bd7f632ccbda3  secretnetwork_1.6.0-rc.2_testnet_rocksdb_amd64.deb" | sha256sum --check

```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
# Install v1.6 binaries
sudo apt install -y ./secretnetwork_1.6.0-rc.2_testnet_*_amd64.deb

# verify installation
secretd version
# 1.6.0-rc.2
```
