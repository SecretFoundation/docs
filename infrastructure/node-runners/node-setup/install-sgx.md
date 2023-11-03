# Install SGX

Ensure your hardware is [Secret Node Compliant](../hardware-compliance.md).

If you're running a local machine or bare-metal and not a cloud-based VM -

1. Go to your BIOS menu
2. Enable SGX (Software controlled is not enough)
3. Disable Secure Boot
4. Disable Hyperthreading (recommended)

## Installation <a href="#installation" id="installation"></a>

#### Install SGX <a href="#install-sgx" id="install-sgx"></a>

{% hint style="info" %}
`sgx_linux_x64_driver_1.41.bin` is the latest driver as of March 9th, 2023. Please check under [https://download.01.org/intel-sgx/sgx-linux/](https://download.01.org/intel-sgx/sgx-linux/) that this is still the case. If not, please send us a PR or notify us.
{% endhint %}

If you are a node runner all you must do to install SGX is to save this as a script and run it.

#### Download the SGX install script

```bash
wget https://raw.githubusercontent.com/SecretFoundation/docs/main/docs/node-guides/sgx
```

#### Execute the script

```bash
sudo bash sgx
```

Copy of raw script.

{% code title="sgx" %}
```shell
#! /bin/bash

sudo apt-get update && sudo apt upgrade -y
sudo apt-get install make build-essential gcc git jq chrony dkms gpg-agent -y

UBUNTUVERSION=$(lsb_release -r -s | cut -d '.' -f 1)
PSW_PACKAGES='libsgx-enclave-common libsgx-aesm-launch-plugin libsgx-aesm-epid-plugin libsgx-aesm-quote-ex-plugin libsgx-urts sgx-aesm-service libsgx-uae-service autoconf libtool make gcc'

if (($UBUNTUVERSION < 16)); then
	echo "Your version of Ubuntu is not supported. Must have Ubuntu 16.04 and up. Aborting installation script..."
	exit 1
elif (($UBUNTUVERSION == 16)); then
	DISTRO='xenial'
	OS='ubuntu16.04-server'
elif (($UBUNTUVERSION == 18)); then
	DISTRO='bionic'
	OS='ubuntu18.04-server'
elif (($UBUNTUVERSION == 20)); then
	DISTRO='focal'
	OS='ubuntu20.04-server'
elif (($UBUNTUVERSION == 22)); then
	DISTRO='jammy'
	OS='ubuntu22.04-server'
fi

echo "\n\n###############################################"
echo "#####       Installing Intel SGX driver       #####"
echo "###############################################\n\n"

# Download SGX driver
if (($UBUNTUVERSION == 16)); then
   # Ubuntu 16 was deprecated by the latest Intel SGX drivers
   wget "https://download.01.org/intel-sgx/sgx-linux/2.13/distro/${OS}/sgx_linux_x64_driver_2.11.0_0373e2e.bin"
else
   wget "https://download.01.org/intel-sgx/sgx-linux/2.17/distro/${OS}/sgx_linux_x64_driver_1.41.bin"
fi

# Make the driver installer executable
chmod +x ./sgx_linux_x64_driver_*.bin

# Install the driver
sudo ./sgx_linux_x64_driver_*.bin

# Remount /dev as exec, also at system startup
sudo tee /etc/systemd/system/remount-dev-exec.service >/dev/null <<EOF
[Unit]
Description=Remount /dev as exec to allow AESM service to boot and load enclaves into SGX

[Service]
Type=oneshot
ExecStart=/bin/mount -o remount,exec /dev
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable remount-dev-exec
sudo systemctl start remount-dev-exec

echo "\n\n###############################################"
echo "#####       Installing Intel SGX PSW          #####"
echo "###############################################\n\n"

# Add Intels's SGX PPA
echo "deb [arch=amd64] https://download.01.org/intel-sgx/sgx_repo/ubuntu $DISTRO main" |
   sudo tee /etc/apt/sources.list.d/intel-sgx.list
wget -qO - https://download.01.org/intel-sgx/sgx_repo/ubuntu/intel-sgx-deb.key |
   sudo apt-key add -
sudo apt update

# Install libprotobuf - should not be necessary anymore
# if (($UBUNTUVERSION > 18)); then
#   sudo apt install -y gdebi
#   # Install all the additional necessary dependencies (besides the driver and the SDK)
#   # for building a rust enclave
#   wget -O /tmp/libprotobuf30_3.19.4-1_amd64.deb https://engfilestorage.blob.core.windows.net/filestorage/libprotobuf30_3.19.4-1_amd64.deb
#   yes | sudo gdebi /tmp/libprotobuf30_3.19.4-1_amd64.deb
#else
#   PSW_PACKAGES+=' libprotobuf-dev'
#fi

sudo apt install -y $PSW_PACKAGES
```
{% endcode %}

If the script fails with an error similar to the following:

```
Failed to fetch https://download.01.org/intel-sgx/sgx_repo/ubuntu/dists/focal/InRelease 503 Service Unavailable [IP: 2a02:26f0:9100:b9e::4b21 443]
```

it might mean that the SGX apt repo went down, some validators have setup a mirror you can use instead, please modify line 63 of the script above with:

```shell
echo "deb [arch=amd64] https://scrt-validator.digiline.io/sgx-mirror/ubuntu $DISTRO main"
```

and run it again.

## Testing your SGX setup <a href="#testing-your-sgx-setup" id="testing-your-sgx-setup"></a>

#### Run `secretd init-enclave` <a href="#run-secretd-init-enclave" id="run-secretd-init-enclave"></a>

See [Verify SGX](broken-reference/) for a guide how to test your setup.

## Uninstall <a href="#uninstall" id="uninstall"></a>

To uninstall the Intel(R) SGX Driver, run:

```
sudo /opt/intel/sgxdriver/uninstall.sh
```

The above command produces no output when it succeeds. If you want to verify that the driver has been uninstalled, you can run the following, which should print `SGX Driver NOT installed`:

```
ls /dev/isgx &>/dev/null && echo "SGX Driver installed" || echo "SGX Driver NOT installed"
```

To uninstall the SGX SDK, run:

```
sudo "$HOME"/.sgxsdk/sgxsdk/uninstall.sh
rm -rf "$HOME/.sgxsdk"
```

To uninstall the rest of the dependencies, run:

```
sudo apt purge -y libsgx-enclave-common libsgx-enclave-common-dev libsgx-urts sgx-aesm-service libsgx-uae-service libsgx-launch libsgx-aesm-launch-plugin libsgx-ae-le
```

## Refs <a href="#refs" id="refs"></a>

1. [https://github.com/apache/incubator-teaclave-sgx-sdk/wiki/Environment-Setup](https://github.com/apache/incubator-teaclave-sgx-sdk/wiki/Environment-Setup)
2. [https://github.com/openenclave/openenclave/blob/master/docs/GettingStartedDocs/install\_oe\_sdk-Ubuntu\_18.04.md](https://github.com/openenclave/openenclave/blob/master/docs/GettingStartedDocs/install\_oe\_sdk-Ubuntu\_18.04.md)
3. [https://github.com/apache/incubator-teaclave-sgx-sdk/blob/783f04c002e243d1022c5af8a982f9c2a7138f32/dockerfile/Dockerfile.1804.nightly](https://github.com/apache/incubator-teaclave-sgx-sdk/blob/783f04c002e243d1022c5af8a982f9c2a7138f32/dockerfile/Dockerfile.1804.nightly)
4. [https://edp.fortanix.com/docs/installation/guide/](https://edp.fortanix.com/docs/installation/guide/)

### **Contributors**

* [FreshSCRT](https://secretnodes.com/secret/chains/secret-3/validators/6AFCF9EB1AC264954C784274A6ABF012D50EB0B6)
* [secretnodes](https://secretnodes.com/secret/chains/secret-3/validators/81EBCE2FFC29820351C086E9EDA6A220098FF41C)
* [Lavender.Five](https://secretnodes.com/secret/chains/secret-3/validators/84BC2C72491187FAB144F628166E10D592786616)
