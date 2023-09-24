# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download And Verify `secretd` <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.11

## goleveldb
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.11.0-beta.14/secretnetwork_1.11.0-beta.14_testnet_goleveldb_amd64.deb"
# Verify the v1.11 binaries
echo '6919f6ff544c6bfc8e408dcc3ce53cec2d42f30abd7c775f6872a1edf75258a7 secretnetwork_1.11.0-beta.14_testnet_goleveldb_amd64.deb' | sha256sum --check


```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
# Install v1.11 binaries
sudo apt install -y "./secretnetwork_1.11.0-beta.14_testnet_goleveldb_amd64.deb"

# verify installation
secretd version
# 1.11.0-beta.14
```
