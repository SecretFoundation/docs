# Install SGX

Ensure your hardware is [hardware-compliance.md](../hardware-compliance.md "mention").

If you're running a local machine and not a cloud-based VM -

1. Go to your BIOS menu
2. Enable SGX (Set to "YES", it's not enough to set it to "software controlled")
3. Disable Secure Boot
4. Disable Hyperthreading

## Installation <a href="#installation" id="installation"></a>

### Pre-requisites
First, install all the needed system components.

#### 1. Make sure you have the latest SGX DCAP driver
```bash
# 1. Make sure the SGX driver is installed. The following devices should appear:
# /dev/sgx_enclave
# /dev/sgx_provision

# If your kernel version if 5.11 or higher, then you probably already have the SGX driver installed.
# Otherwise - please update the kernel version.

# Also make sure that the user under which the node is supposed to run has privileges to access SGX
sudo groupadd sgx_prv
sudo usermod -a -G sgx_prv $USER

# Check if the above has effect, by the following command
groups

# The sgx_prv should appear. If it does not - Logout and re-login may be needed, for the change to take effect.
```
#### 2. Install the DCAP runtime and AESM service
```bash
curl -fsSL https://download.01.org/intel-sgx/sgx_repo/ubuntu/intel-sgx-deb.key | sudo apt-key add -
. /etc/os-release; VERSION_CODENAME=${VERSION_CODENAME}
sudo add-apt-repository "deb https://download.01.org/intel-sgx/sgx_repo/ubuntu $VERSION_CODENAME main"
sudo apt-get update
sudo apt-get install -y \
    libsgx-aesm-launch-plugin \
    libsgx-enclave-common \
    libsgx-epid \
    libsgx-launch \
    libsgx-quote-ex \
    libsgx-uae-service \
    libsgx-qe3-logic \
    libsgx-pce-logic \
    libsgx-aesm-pce-plugin \
    libsgx-dcap-ql \
    libsgx-dcap-quote-verify \
    libsgx-urts \
    sgx-aesm-service \
    libsgx-aesm-ecdsa-plugin \
    libsgx-aesm-quote-ex-plugin \
    libsgx-ae-qve \
    libsgx-dcap-default-qpl	

sudo apt upgrade
```

#### If your system has 5th Gen Intel® Xeon® Scalable Processor(s)
For the DCAP attestation to work, you'll need to register your platform with Intel. This is achieved by the following:
```bash
sudo apt-get install -y sgx-ra-service
```
You can check the file `/var/log/mpa_registration.log`, to see if the platform is registered successfully.

#### 3. Configure Quote Provider
The Quote Provider library is needed to provide the data for DCAP attestation. It should be installed by now (by the previous section), but before using it should be configured.
The configuration file should be here:

`/etc/sgx_default_qcnl.conf`

#### If you're running a physical machine
The simplest would be to use the Intel PCS. Find the `pccs_url` parameter in the file, and set the following:
```
  //PCCS server address
  "pccs_url": "https://api.trustedservices.intel.com/sgx/certification/v4/"
```

You can achieve this by the following command:
```bash
sudo cp /etc/sgx_default_qcnl.conf /etc/sgx_default_qcnl.conf.BKP
sudo sed -s -i 's/localhost:8081/api.trustedservices.intel.com/' /etc/sgx_default_qcnl.conf
```

#### Cloud computers
For cloud computers, the cloud service providers may provide their own PCCS. Please see their documentation

**Note:** You'll need to restart the AESMD service each time the configuration is changed

```bash
# Restart the AESMD service
sudo systemctl restart aesmd.service
```
### 4. Use check-hw to test the DCAP attestation (Optional step)
Download and run the check-hw tool (included in the Release package). You should see the following:
```
DCAP attestation ok
Platform verification successful! You are able to run a mainnet Secret node
```
That would mean all the above steps are ok, and you're good to go.

In case you see some error messages, but at the end the following:
```
Platform Okay!
Platform verification successful! You are able to run a mainnet Secret node
```
That would mean there's a problem with DCAP attestation. However the EPID attestation still works. Although you may technically run the node, it's strongly recommended to fix this. The EPID will be phased-out by Intel on April 2025.

To get a more detailed error info, run `check-hw --testnet`


### Install SGX <a href="#install-sgx" id="install-sgx"></a>

Note: `sgx_linux_x64_driver_2.11.0_2d2b795.bin` is the latest driver as of August 24th, 2021. Please check under https://download.01.org/intel-sgx/sgx-linux/ that this is still the case. If not, please send us a PR or notify us.

If you are a node runner all you must do to install SGX is to save this as a script and run it.

1. Download the SGX install script.

```bash
wget https://raw.githubusercontent.com/SecretFoundation/docs/main/docs/node-guides/sgx
```

Execute the script.

```bash
sudo bash sgx
```

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
