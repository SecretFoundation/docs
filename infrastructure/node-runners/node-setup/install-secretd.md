# Install secretd

{% hint style="warning" %}
Unlike other Tendermint/Cosmos based daemons, `secretd` cannot be built from source due to the SGX requirement.&#x20;

For other builds other than `.deb`, see the [Secret Network Github Releases](https://github.com/scrtlabs/SecretNetwork/releases).
{% endhint %}

### Install script <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

#### Download the secretd install script

```bash
wget https://raw.githubusercontent.com/SecretFoundation/docs/main/docs/node-guides/install-secretd
```

#### Execute the script

```bash
sudo bash install-secretd
```

### Manual method: Download and Install `secretd` <a href="#_1-download-the-secret-network-package-installer-for-debian-ubuntu" id="_1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

The most common method for installing `secretd` is the Secret Network package installer for Debian/Ubuntu:

```bash
# Get the latest release info
RELEASE_INFO=$(curl -s https://api.github.com/repos/scrtlabs/SecretNetwork/releases/latest)

# Extract the URL of the .deb file
DEB_URL=$(echo $RELEASE_INFO | jq -r '.assets[] | select(.name | endswith("mainnet_goleveldb_amd64.deb")) | .browser_download_url')

# Download the .deb file
wget $DEB_URL

# Extract the file name from URL
DEB_FILE="${DEB_URL##*/}"

# Install the .deb file
sudo apt install -y ./$DEB_FILE

# verify installation
secretd version
```

