# nForce Setup

Website: [nForce](https://www.nforce.com/customserver)

Things to note before setting up on Nforce.

1. Only certain chasis and CPU configuration have SGX enabled.
2. You need to manually communicate with Nforce to give you the right configuration so that SGX works on the BIOS.

### Installation Step By Step

#### 1. Getting the Right Configuration

For the purpose of this Guide i selected the **HP DL20 G10** Chasis. For the CPU i slected the **Intel E2174G (3.8-4.7 Ghz, 4C/8T)**

With 32 GB ram, Ubuntu OS 20.04, and 512 GB SSD.

#### 2. Wait for the configuration to be delivered to you.

This takes about 1 day, you may need to make sure they have the servers, if they do not make sure you request only the same configuration or the SGX wont be enabled.

#### 3. Login into their [Portal](https://ssc.nforce.com/account)

The SSC portal is only enabled once you finish the payment. Go to your dedicated servers and select the image. Go to remote management and create a session to log into the BIOS via IPMI. You'll need to make sure Hyper Threading is disabled.

#### 4. Install SGX utilities from the Secret Network Documentation

Login with your credentials and proceed with [SGX installation](../../node-setup/install-sgx.md).
