# Install SGX

{% hint style="info" %}
Got problems with using SGX and DCAP attestation in your system? Please ask in the Telegram or Discord for help. For Validators, you can also ask in the SN Validators chat.
{% endhint %}

Ensure your hardware is [hardware-compliance.md](../hardware-setup/hardware-compliance.md "mention").

If you're running a local machine and not a cloud-based VM -

1. Update your BIOS to the latest available version
2. Go to your BIOS menu
3. Enable SGX (Set to "YES", it's not enough to set it to "software controlled")
4. Disable Secure Boot
5. Disable Hyperthreading

{% hint style="warning" %}
Please use Ubuntu 22.04 LTS If you install SGX on a fresh node to ensure that DCAP will work correctly. Ubuntu 20.04 LTS is not supported by default anymore.
{% endhint %}

## Check latest SGX DCAP driver

Make sure the SGX driver is installed. The following devices should appear:

```bash
/dev/sgx_enclave
/dev/sgx_provision
```

If your kernel version if `5.11` or higher, then you probably already have the SGX driver installed. Otherwise - please update the kernel version to `5.11` or higher to ensure that these two devices appear.&#x20;

Also make sure that the user under which the node is supposed to run has privileges to access SGX:

```bash
sudo groupadd sgx_prv
sudo groupadd sgx
sudo usermod -a -G sgx_prv $USER
sudo usermod -a -G sgx $USER

# Check if the above has effect, by the following command
groups
```

The `sgx_prv` should appear.&#x20;

If it does not - Logout and re-login may be needed, for the change to take effect.

## Install the DCAP runtime and AESM service

First, you need to add the Intel repository to APT and install the necessary SGX libraries:

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

**If your system has 5th Gen Intel® Xeon® Scalable Processor(s)**

For the DCAP attestation to work, you'll need to register your platform with Intel. This is achieved by the following:

```bash
sudo apt-get install -y sgx-ra-service
```

You can check the file `/var/log/mpa_registration.log`, to see if the platform is registered successfully.

## Configure Quote Provider

The Quote Provider library is needed to provide the data for DCAP attestation.The configuration file for it should can be found here:

`/etc/sgx_default_qcnl.conf`

1. **Running a baremetal/physical machine**

The simplest would be to use the PCCS run by SCRTLabs. Modify the following parameters in the file:

```bash
//PCCS server address
"pccs_url": "https://pccs.scrtlabs.com/sgx/certification/v4/"
```

You can set those parameters by the following command:

```bash
sudo cp /etc/sgx_default_qcnl.conf /etc/sgx_default_qcnl.conf.BKP
sudo sed -s -i 's/localhost:8081/pccs.scrtlabs.com/' /etc/sgx_default_qcnl.conf
```

2. **Running on Cloud VPS providers**&#x20;

For cloud VPS providers, the cloud service providers may provide their own PCCS. Please see their documentation for more infomation.

{% hint style="info" %}
**Note:** You'll need to restart the AESMD service each time the configuration is changed
{% endhint %}

Next, restart your aesmd service for the changes to take effect.

```bash
sudo systemctl restart aesmd.service
```

## Use check-hw to test the DCAP attestation

Download and run the check-hw tool (included in the [Release package here](https://github.com/scrtlabs/SecretNetwork/releases/tag/v1.13.0-rc.2)). You should see the following:

```bash
DCAP attestation ok
Platform verification successful! You are able to run a mainnet Secret node
```

That would mean all the above steps are ok, and you're good to go.

In case you see some error messages, but at the end the following:

```bash
Platform Okay!
Platform verification successful! You are able to run a mainnet Secret node
```

That would mean there's a problem with DCAP attestation.&#x20;

However the EPID attestation still works. Although you may technically run the node, it's strongly recommended to fix this. The EPID will be phased-out by Intel on April 2025.

To get a more detailed error info, run `check-hw --testnet`
