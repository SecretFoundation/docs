# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement. For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Download and Verify `secretd`  <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for install `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# download secretd v1.4.0
wget "https://github.com/scrtlabs/SecretNetwork/releases/download/v1.5.0/secretnetwork_1.5.0_mainnet_goleveldb_amd64.deb"

# verify download
# echo "483e25f6ba189d4763a81da94f32e20306370bb3111aa208d16c0141a4a0da7d secretnetwork_1.5.0_mainnet_goleveldb_amd64.deb" | sha256sum --check
# secretnetwork_1.5.0_mainnet_goleveldb_amd64.deb: OK
```

### Install `secretd` <a href="#_2-install-the-package" id="_2-install-the-package"></a>

```bash
sudo apt install -y ./secretnetwork_1.5.0_mainnet_*_amd64.deb

# verify installation
secretd version
# 1.5.0
```
