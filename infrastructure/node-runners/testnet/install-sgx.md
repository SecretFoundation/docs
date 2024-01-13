# Install SGX

Ensure your hardware is [hardware-compliance.md](../hardware-compliance.md "mention").

If you're running a local machine and not a cloud-based VM -

1. Go to your BIOS menu
2. Enable SGX (Set to "YES", it's not enough to set it to "software controlled")
3. Disable Secure Boot
4. Disable Hyperthreading

## Installation <a href="#installation" id="installation"></a>

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
