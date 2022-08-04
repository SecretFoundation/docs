# Security

To add basic security to your node, we've provided a guide covering 2 simple tools.

* Uncomplicated Firewall (UFW)
* Key-based SSH authentication.

## Setup Basic Firewall With UFW <a href="#setup-a-basic-firewall-with-ufw" id="setup-a-basic-firewall-with-ufw"></a>

Uncomplicated Firewall (UFW) is a program for managing a netfilter firewall designed for easy use. It uses a command-line interface (CLI) with a small number of simple commands, and is configured with [iptables](https://en.wikipedia.org/wiki/Iptables). UFW is available by default in all Ubuntu installations after 18.04 LTS, and features tools for intrusion prevention which we will cover in this guide.

## Setup <a href="#setup" id="setup"></a>

Start by checking the status of UFW.

```bash
sudo ufw status
```

Then proceed to configure your firewall with the following options, preferably in this order.

The order is important because UFW executes the instructions given to it in the order they are given, so putting the most important and specific rules first is a good security practice. You can insert UFW rules at any position you want to by using the following syntax (do not execute the following command when setting up your node security):

```bash
ufw insert 1 <command ex. deny> from <ip> to any // example only
```

The example command above would be placed in the first position (instead of the last) of the UFW hierarchy and deny a specific IP address from accessing the server.

### Set Outgoing Connections <a href="#set-outgoing-connections" id="set-outgoing-connections"></a>

This sets the default to allow outgoing connections unless specified they should not be allowed.

```bash
sudo ufw default allow outgoing
```

### Set Incoming Connections <a href="#set-incoming-connections" id="set-incoming-connections"></a>

This sets the default to deny incoming connections unless specified they should be allowed.

```bash
sudo ufw default deny incoming
```

### Set And Limit SSH Connections <a href="#set-and-limit-ssh-connections" id="set-and-limit-ssh-connections"></a>

This allows SSH connections by the firewall.

```bash
sudo ufw allow ssh/tcp
```

This limits SSH login attempts on the machine. The default is to limit SSH connections from a specific IP address if it attempts 6 or more connections within 30 seconds.

```bash
sudo ufw limit ssh/tcp
```

### Set Accessible Ports <a href="#set-accessible-ports" id="set-accessible-ports"></a>

Allow 26656 for a p2p networking port to connect with the Tendermint network; unless you manually specified a different port.

```
sudo ufw allow 26656
```

Allow 1317 if you are running a public LCD endpoint from this node. Otherwise, you can skip this.

```
sudo ufw allow 1317
```

### Enable UFW Firewall <a href="#enable-ufw-firewall" id="enable-ufw-firewall"></a>

This enables the firewall you just configured.

```
sudo ufw enable
```

{% hint style="info" %}
At any point in time you can disable your UFW firewall by running the following command.
{% endhint %}

```bash
sudo ufw disable
```

## Key-Based SSH Authentication <a href="#key-based-ssh-authentication" id="key-based-ssh-authentication"></a>

SSH keys, similarly to cryptocurrency keys, consist of public and private keys. You should store the private key on a machine you trust. The corresponding public key is what you will add to your server to secure it.

{% hint style="warning" %}
**Be sure to securely store a secure backup of your private SSH key.**
{% endhint %}

From your local machine that you plan to SSH from, generate an SSH key. This is likely going to be your laptop or desktop computer. Use the following command if you are using OSX or Linux:

```bash
ssh-keygen -t ecdsa
```

Decide on a name for your key and proceed through the prompts.

```bash
Your identification has been saved in /Users/myname/.ssh/id_ecdsa.
Your public key has been saved in /Users/myname/.ssh/id_ecdsa.pub
The key fingerprint is:
ae:89:72:0b:85:da:5a:f4:7c:1f:c2:43:fd:c6:44:38 myname@mymac.local
The key's randomart image is:
+--[ ECDSA 256]---+
|                 |
|         .       |
|        E .      |
|   .   . o       |
|  o . . S .      |
| + + o . +       |
|. + o = o +      |
| o...o * o       |
|.  oo.o .        |
+-----------------+
```

Copy the contents of your public key.

{% hint style="info" %}
**Your file name will differ from the command below based on how you named your key.**
{% endhint %}

```bash
cat /Users/myname/.ssh/id_rsa.pub
```

Give the ssh folder the correct permissions.

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh 
```

{% hint style="info" %}
**Chmod 700 (chmod a+rwx,g-rwx,o-rwx) sets permissions so the user or owner can read, write and execute, and the Group or Others cannot read, write or execute.**
{% endhint %}

Copy the contents of your newly generated public key.

```bash
cat /Users/myname/.ssh/id_ecdsa.pub
```

### Copy **SSH** Public Key To Your Server <a href="#copy-ssh-public-key-to-your-server" id="copy-ssh-public-key-to-your-server"></a>

_Now log into the server that you want to protect with your new SSH key_ and create a copy of the pubkey.

Create a file and paste in the public key information you copied from the previous step. Be sure to save the file.

```bash
nano key.pub
```

Now add the pubkey to the authorized keys list.

```bash
cat key.pub >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
```

Once you've confirmed that you can login via the new key, you can proceed to lock down the server to only allow access via the key.

Edit sshd\_config to disable password-based authentication.

```bash
sudo nano /etc/ssh/sshd_config
```

Change PasswordAuthentication yes" to "PasswordAuthentication no" and then save.

```toml
# Example of overriding settings on a per-user basis
#Match User anoncvs
#       X11Forwarding no
#       AllowTcpForwarding no
#       PermitTTY no
#       ForceCommand cvs server
PasswordAuthentication no
```

Restart ssh process for settings to take effect.

```bash
service ssh restart
```

### Securing SSH with FIDO U2F (YubiKey) <a href="#securing-ssh-with-fido-u2f-yubikey" id="securing-ssh-with-fido-u2f-yubikey"></a>

For additional security node operators may choose to secure their SSH connections with FIDO U2F hardware security devices such as YubiKey, SoloKey, or a Nitrokey. A security key ensures that SSH connections will not be possible using the private and public SSH key-pair without the security key present and activated. Even if the private key is compromised, adversaries will not be able to use it to create SSH connections without its associated password and security key.

This tutorial will go over how to set up your SSH connection with FIDO U2F using a YubiKey, but the general process should work with other FIDO U2F security devices.

**NOTE: More information on how to get started using a YubiKey can be found** [**HERE**](https://www.yubico.com/ca/setup/)**. You should have a general understanding of how to use a YubiKey before attempting this ssh guide.**

### SSH Requirements <a href="#ssh-requirements" id="ssh-requirements"></a>

For SSH secured with FIDO U2F to work both the host and server must be running SSH version 8.2 or higher. Check what version of SSH is on your local machine, and your server by running:

```bash
ssh -V
```

{% hint style="info" %}
It does not matter if there are mismatched versions between the host machine and server; as long as they are both using version 8.2 or higher you will be able to secure your ssh connection using FIDO U2F.
{% endhint %}

### Creating SSH Key-Pairs With FIDO U2F Authentication <a href="#creating-ssh-key-pairs-with-fido-u2f-authentication" id="creating-ssh-key-pairs-with-fido-u2f-authentication"></a>

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

You can now use your new ed25519-sk key-pair to secure SSH connections with your servers. Part of the key-pair is from the YubiKey, and is used to secure the SHH connection as part of a challenge-response from the devices.

## Raising The Security Floor Of The Cosmos Ecosystem

Within the #Cosmos, conversations around node security tend to start with whether or not you use backup servers, sentries, and a remote-signing key management solution. This does not see the forest for the trees. While those steps are certainly important, they are \*final\* security steps. We should instead be discussing the first steps you make when setting up a new Tendermint node; raise the floor of security, rather than the ceiling, if you will.

{% hint style="info" %}
**This is intended to be a very basic guide on Linux security practices. If you want to more in-depth information,** [**you can read about it here.**](https://github.com/imthenachoman/How-To-Secure-A-Linux-Server)
{% endhint %}

The following topics will be covered:\
1\. **SSH Key Setup**

2\. **Server Configuration**

3\. **Setting up a Basic Firewall**

**4. Using Local CLI Machinesbas**

When you receive your server, you will be provided a root user login, and a password. You’ll be inclined to log in with that login and password, but we have steps before we do that! We first want to create out ssh key as we’ll be disabling password login shortly.

### SSH Key Setup

#### **Create SSH Key**

An SSH (Secure Shell) key is a way to identify yourself as a user without using a password. It has 2 parts: the pubkey and private key. When you create the SSH key, you give your pubkey to a computer you wish to log into. You can then “show” the server your private key and it will admit you automatically. This makes it far more secure than a password, as then only you will have access to the server via your key.

This document assumes you’re using a Mac. If you need instructions for Linux or Windows, see the [Github instruction for generating an SSH key.](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

1. Open Terminal
2. Generate the SSH key:

```bash
$ ssh-keygen -t ed25519 -C “your_email@example.com”
```

![](https://cdn-images-1.medium.com/max/1600/1\*o9AlJ9J0bCCGokhQ3se5QQ.png)Generate SSH key

3\. When you’re prompted to “Enter a file in which to save the key,” press Enter. This accepts the default file location.

4\. At the prompt, type a secure passphrase. For more information, see [“Working with SSH key passphrases](https://docs.github.com/en/articles/working-with-ssh-key-passphrases).”

```bash
> Enter passphrase (empty for no passphrase): [Type a passphrase]> Enter same passphrase again: [Type passphrase again]
```

Your SSH key is now created, but we have to add it to the agent for it to be usable.

#### **Adding your SSH key to the ssh-agent**

1. Start the ssh-agent in the background

```bash
$ eval "$(ssh-agent -s)"> Agent pid 59566
```

2\. Open your SSH config file

```bash
$ open ~/.ssh/config
```

![](https://cdn-images-1.medium.com/max/1600/1\*lzrlsw-n64g9u-yLRxw6gg.png)Open \~/.ssh/config

3\. Add the following text block to your file

```bash
Host *  AddKeysToAgent yes  UseKeychain yes  IdentityFile ~/.ssh/id_ed25519
```

4\. Add your SSH key to the ssh-agent

```bash
$ ssh-add -K ~/.ssh/id_ed25519
```

Your SSH key is now set up! This only has to happen once, so you can skip this if you need to refer back to this document.

## Server Configuration

In this section we will cover:

1. **Logging In**
2. **Creating a new user**
3. **Disable root login**
4. **Disable password login**

### **Logging in**

When you provision a new server, you will be provided a username, password, and ip address. Generally that username will be **root**. Let’s log in with them now in the form of `ssh username@ip` .

1. Initiate login to server

![](https://cdn-images-1.medium.com/max/1600/1\*A63\_z3J2PhKBCTBwqMQklQ.png)SSH into the server

2\. Type `Yes`

![](https://cdn-images-1.medium.com/max/1600/1\*GgHBO4c6NrLurfepJAu9-A.png)

3\. Enter password

![](https://cdn-images-1.medium.com/max/1600/1\*sVRGmmsEhrfKhjsorOalsw.png)Logged into root

You are now logged into root. However, we do **NOT** want this as an option, so let’s fix it.

### **Create New User**

Since we no longer want to be able to log in as root, we’ll first need to create a new user to log into.

1. Create a new user

You’re going to want to choose a unique username here, as the more unique, the harder it’ll be for a bad actor to guess. We’re going to use `mellamo` .

```bash
$ adduser mellamo
```

![](https://cdn-images-1.medium.com/max/1600/1\*mSdweTS6WSZjtQLmmWJPsg.png)Create user mellamo

You will then be prompted to create a password and fill in information. Don’t worry about the information, but make sure your password is complicated!

2\. Give them sudo privileges

sudo is the name for “master” privileges, so we need to modify the user to add them to that group.

```bash
$ usermod mellamo -aG sudo
```

3\. Verify user has sudo access

```bash
$ su - mellamo$ sudo ls /root
```

![](https://cdn-images-1.medium.com/max/1600/1\*sRoT2ecQugMrvX8iA3Q\_OA.png)Testing sudo privileges

### **Disable Root Login**

Disabling root login takes away an easy method for hackers to get in. The easiest way of accessing remote servers or VPSs is via SSH and to block root user login under it, you need to edit the **/etc/ssh/sshd\_config** file.

1. From the remote server, open /etc/ssh/sshd\_config

```bash
$ sudo nano /etc/ssh/sshd_config
```

![](https://cdn-images-1.medium.com/max/1600/0\*esAbd\_PEd0Y0T4QY.png)Set PermitRootLogin to “no”

2\. Save and exit sshd\_config, then restart the service.

```bash
$ sudo systemctl restart sshd
```

### **Copy SSH key**

1. Return to you local machine.

```bash
$ exit
```

![](https://cdn-images-1.medium.com/max/1600/1\*6VYxLX8A3qRTN7HXdAn2ew.png)Log out of server

2\. Copy your ssh key to the server

```bash
$ ssh-copy-id mellamo@{ip address}
```

![](https://cdn-images-1.medium.com/max/1600/1\*-Xh5exfIRi0EakScu\_KNcA.png)Copy keys

3\. Confirm you can login with just your SSH key

```bash
$ ssh mellamo@104.149.129.250
```

![](https://cdn-images-1.medium.com/max/1600/1\*k8NnrH0mXhX\_E5OImuSyIg.png)Log in with SSH key

Done! You can now log in exclusively with your SSH key.

### **Disable Password Login**

Now that you can log in with just your ssh key, you should now disable password login.

1. Return to your remote server, and open /etc/ssh/sshd\_config again

```bash
$ sudo nano /etc/ssh/sshd_config
```

2\. Find ChallengeResponseAuthentication and set to no:

```
bbChallengeResponseAuthentication no
```

3\. Next, find PasswordAuthentication set to no too:

```
PasswordAuthentication no
```

4\. Search for UsePAM and set to no, too:

```markup
UsePAM no
```

5\. Save and exit sshd\_config, then restart the service.

```bash
$ sudo systemctl restart sshd
```

Congratulations! You can only login with your ssh key now. **Be sure to back it up in case something happens to your machine!**

## Setting Up A Basic Firewall

Uncomplicated Firewall (UFW) is a program for managing a netfilter firewall designed for easy use. It uses a command-line interface (CLI) with a small number of simple commands and is configured with [iptables](https://en.wikipedia.org/wiki/Iptables). UFW is available by default in all Ubuntu installations after 18.04 LTS, and features tools for intrusion prevention which we will cover in this guide.

1. Start by checking the status of UFW.

```bash
$ sudo ufw status
```

![](https://cdn-images-1.medium.com/max/1600/1\*RwlFFEpe\_nEB8365W8n17Q.png)Check UFW status

2\. Enable SSH

```bash
$ sudo ufw allow ssh/tcp
```

3\. Enable p2p

This is the default p2p port for Tendermint systems, but if you’ve changed the port, you’ll need to update the ufw setting.

```
$ sudo ufw allow 26656
```

4\. Enable UFW

```bash
$ sudo ufw enable
```

5\. Confirm UFW is enabled

```bash
$ sudo ufw status
```

![](https://cdn-images-1.medium.com/max/1600/1\*goWe3WgqWXX831OwfZIhRw.png)Confirm UFW is enabled

Note that at any time you can disable ufw by doing:

```bash
$ sudo ufw disable
```

## Using Local CLI Machines

Never save your validator’s keys on the remote server. You should be using your local machine and saving your keys on there to broadcast to the remote server.

In order to use a local CLI, you must:

1. Install the daemon on your local machine by going through the normal installation process
2. Set the daemon’s `config` to the remote server
