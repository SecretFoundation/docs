## Securing SSH with FIDO U2F (YubiKey)

For additional security node operators may choose to secure their SSH connections with FIDO U2F hardware security devices such as YubiKey, SoloKey, or a Nitrokey. A security key ensures that SSH connections will not be possible using the private and public SSH key-pair without the security key present and activated. Even if the private key is compromised, adversaries will not be able to use it to create SSH connections without its associated password and security key.

This tutorial will go over how to set up your SSH connection with FIDO U2F using a YubiKey, but the general process should work with other FIDO U2F security devices. 

**NOTE: More information on how to get started using a YubiKey can be found [HERE](https://www.yubico.com/ca/setup/). You should have a general understanding of how to use a YubiKey before attempting this ssh guide.**

### SSH Requirements 

For SSH secured with FIDO U2F to work both the host and server must be running SSH version 8.2 or higher. Check what version of SSH is on your local machine, and your server by running: 

```bash
ssh -V
```
**NOTE: It does not matter if there are mismatched versions between the host machine and server; as long as they are both using version 8.2 or higher you will be able to secure your ssh connection using FIDO U2F

### Creating SSH key-pairs with FIDO U2F authentication 

SSH key-pairs with FIDO U2F authentication use 'sk' in addition to the typical commands you would expect to generate SSH key-pairs with and support both ecdsa-sk and ed25519-sk. 

YubiKeys require firmware version 5.2.3 or higher to support FIDO U2F using ed25519-sk to generate SSH key-pairs. To check the firmware version of a YubiKey, connect the YubiKey to your host machine and execute the following command: 

```bash
lsusb -v 2>/dev/null | grep -A2 Yubico | grep "bcdDevice" | awk '{print $2}'
```
To allow your host machine to communicate with a FIDO device through USB to verify attestation and assert signatures the libsk-fido2 library must be installed.

```bash
sudo apt install libfido2-dev

# macos users will need to run the command found below
brew install libfido2
```
Generate an ed25519-sk key-pair with the following command with your YubiKey connected to your host machine (NOTE: you will be prompted to touch your YubiKey to authorize SSH key-pair generation): 

```bash
ssh-keygen -t ed25519-sk -C "$(hostname)-$(date +'%d-%m-%Y')-yubikey1"
```
You can now use your new ed25519-sk key-pair to secure SSH connections with your servers. Part of the key-pair is from the YubiKey, and is used to secure the SHH connection as part of a challenge response from the devices.  
