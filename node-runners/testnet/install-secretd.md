# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download And Verify `secretd`  <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.5.0-beta.4

## goleveldb
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.5.0-beta.4/secretnetwork_1.5.0-beta.4_testnet_goleveldb_amd64.deb"
echo "2807c176955e29ff219b0cf60aac51d922785800a4bdac887ae8bc6721f8e4fe secretnetwork_1.5.0-beta.4_testnet_goleveldb_amd64.deb" | sha256sum --check

## rocksdb
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.5.0-beta.4/secretnetwork_1.5.0-beta.4_testnet_rocksdb_amd64.deb"
echo "b00d09df145ec98414c75f6a69ac4a94de4f1f2b66b705f0e5a3492d1a0937f9 secretnetwork_1.5.0-beta.4_testnet_rocksdb_amd64.deb" | sha256sum --check

```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
# Install v1.5 binaries
sudo apt install -y ./secretnetwork_1.5.0-beta.4_testnet_*_amd64.deb

# verify installation
secretd version
# 1.5.0-beta.4
```
