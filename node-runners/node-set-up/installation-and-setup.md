# Installation and Setup

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download and Verify `secretd`  <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.3.1
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.3.1/secretnetwork_1.3.1_mainnet_goleveldb_amd64.deb"

# verify download
echo "3b501e572ab6021df3371d5fae73952cd6fc5a85b726310cf32a000f4c093207 secretnetwork_1.3.1_mainnet_goleveldb_amd64.deb" | sha256sum --check
# secretnetwork_1.3.1_mainnet_goleveldb_amd64.deb: OK
```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
sudo apt install -y ./secretnetwork_1.3.1_mainnet_*_amd64.deb

# verify installation
secretd version
# 1.3.1
```
