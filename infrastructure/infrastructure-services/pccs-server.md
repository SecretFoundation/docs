---
description: Installing and running a PCCS server
icon: server
---

# PCCS Server

The Provisioning Certificate Caching Service (PCCS) is a critical infrastructure component that enables DCAP-based SGX attestation for Secret Network nodes. PCCS acts as a local caching layer between your SGX-enabled hardware and Intel's Provisioning Certificate Service, storing and serving attestation collateral including Platform Certification Keys (PCK certificates), Certificate Revocation Lists (CRLs), TCB information, and enclave identity data.&#x20;

PCCS server is developed and maintained by Intel.

For Secret Network validators and node operators, running a PCCS ensures reliable quote generation and verification without depending on real-time access to Intel's remote services—essential for maintaining network uptime and enabling the trusted execution environment that powers Secret Network's confidential smart contracts.

### How to install

#### Register with Intel Trusted Services

1. Visit [https://api.portal.trustedservices.intel.com/](https://api.portal.trustedservices.intel.com/)
2. Click "Sign In" (even if you don't have an account)
3. Enter your email.&#x20;

<figure><img src="../../.gitbook/assets/image (1) (1).png" alt=""><figcaption></figcaption></figure>

4. If the email is not known, the registration will start

<figure><img src="../../.gitbook/assets/image (1) (1) (1).png" alt=""><figcaption></figcaption></figure>

#### Obtain an API key

Once logged in to Trusted Services, click "[Intel® SGX and Intel® TDX Registration Service](https://api.portal.trustedservices.intel.com/registration)"

<figure><img src="../../.gitbook/assets/image (2) (1).png" alt=""><figcaption></figcaption></figure>

\
or just go to this URL: [https://api.portal.trustedservices.intel.com/registration](https://api.portal.trustedservices.intel.com/registration)

Once on the Registration Service page, click "Subscribe":

<figure><img src="../../.gitbook/assets/image (3) (1).png" alt=""><figcaption></figcaption></figure>

After you confirm your subscription on the following page, you should be taken to the Subscription page. Click "show" next to the primary key and copy it to a secure location:



#### Install PCCS Package

1. Add the official Intel Debian repository to your system sources and import the signing key:

```
curl -fsSL https://download.01.org/intel-sgx/sgx_repo/ubuntu/intel-sgx-deb.key | \ 
     sudo apt-key add - . /etc/os-release; VERSION_CODENAME=${VERSION_CODENAME} 

sudo add-apt-repository "deb https://download.01.org/intel-sgx/sgx_repo/ubuntu \ 
      $VERSION_CODENAME main" 
      
sudo apt-get update
```

2. Install the PCCS Package

```
sudo apt install sgx-dcap-pccs
```

During the installation you will be prompted for: PCCS API Key: Enter the key you obtained from in the previous step.&#x20;

PCCS Listening Port: Default is typically 8081. PCCS Administrator&#x20;

Password: Set a password for administrative tasks.

3. Verify installation:

```
sudo systemctl status pccs
```

4. PCCS server should be up and running now. Secret Nodes operators can set the URL of the PCCS server their `/etc/sgx_default_qcnl.conf` configuration file
