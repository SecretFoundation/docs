# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download And Verify `secretd` <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.11

## goleveldb
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.11.0-beta.2/secretnetwork_1.11.0-beta.2_testnet_goleveldb_amd64.deb"
# Verify the v1.11 binaries
echo '723a2d03ec51deadf4675f8363e79ae85c2965ea94fe9cc8d6063eb58062e40f secretnetwork_1.11.0-beta.2_testnet_goleveldb_amd64.deb' | sha256sum --check


```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
# Install v1.11 binaries
sudo apt install -y "./secretnetwork_1.11.0-beta.2_testnet_goleveldb_amd64.deb"

# verify installation
secretd version
# 1.11.0-beta.2
```
