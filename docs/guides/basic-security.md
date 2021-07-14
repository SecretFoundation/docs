# Basic security for your nodes.

To add basic security to your node, we've provided a guide that covers 2 simple tools.

* Uncomplicated Firewall UFW
* Key based SSH authentication.


## Setup a basic Firewall with UFW

Uncomplicated Firewall is a program for managing a netfilter firewall designed to be easy to use. It uses a command-line interface consisting of a small number of simple commands, and uses iptables for configuration. UFW is available by default in all Ubuntu installations after 18.04 LTS. UFW also includes some features for intrusion prevention, such as the "limit" command for ssh which we will cover in this guide.

# Setup

Start by checking the status of ufw.

```bash
sudo ufw status
```

Then proceed to configure your firewall with the following options, preferably in this order.


This sets the default to allow outgoing connections unless specified they should not be allowed.


```bash
sudo ufw default allow outgoing
```

This sets the default to deny incomming connections unless specified they should be allowed.

```bash
sudo ufw default deny incoming
```

This allows SSH connections by the firewall.

```bash
sudo ufw allow ssh/tcp
```

This limits SSH login attempts on the machine. The default is to limit SSH connections from a specific IP address if it attempts 6 or more connections within 30 seconds.

```bash
sudo ufw limit ssh/tcp
```

Allow 26656 for p2p networking port to connect to the tendermint network. Unless you specified a different port for this manually.

```bash
sudo ufw allow 26656
```

Allow 1317 if you are running a public LCD endpoint from this node. Otherwise you can skip this.

```bash
sudo ufw allow 1317
```

This enables the firewall you just configured.

```bash
sudo ufw enable
```

Note: At any point in time you can disable your UFW firewall by running the following command.

```bash
sudo ufw disable
```

## Key based SSH authentication

SSH keys, similarly to crypto currency keys, consist of a public and private key. The machine you store the private key on should be a machine you trust, and the correspending public key is what you add to your server to secure it. **For this reasons be sure to securely store a backup of your private ssh key.**

From your local machine that you plan to SSH from, enerate an SSH key. This is likely going to be your laptop or desktop computer. This is written for OSX or Linux.

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

Copy the contents of your public key. Note, your file name will differ from the command below based on how you named your key.

```bash
cat /Users/myname/.ssh/id_rsa.pub
```

Give the ssh folder the correct permissions.

```bash
mkdir -p ~/.ssh && chmod 700 ~/.ssh
```

Copy the contents of your newly generated public key.

```bash
cat /Users/myname/.ssh/id_ecdsa.pub
```

## Copy ssh public key to your server.

*Now log into the server that you want to protect with your new SSH key* and create a copy of the pubkey.

Create a file and paste in the public key information you copied from the previous step. Be sure to save the file.

```bash
nano key.pub
```

Now add the pubkey to the authorized keys list.

```bash
cat key.pub >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys
```

Once you've confirmed that you can login via the new key, you can proceed to lock down the server to only allow access via the key.

Edit sshd_config to disallow password based authentication.

```bash
sudo nano /etc/ssh/sshd_config
```

Change PasswordAuthentication yes" to "PasswordAuthentication no" and then save.

```bash
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
