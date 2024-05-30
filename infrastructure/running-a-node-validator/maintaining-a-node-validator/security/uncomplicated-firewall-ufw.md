# Uncomplicated-Firewall (UFW)

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

```bash
sudo ufw allow 26656
```

Allow 1317 if you are running a public LCD endpoint from this node. Otherwise, you can skip this.

```bash
sudo ufw allow 1317
```

Allow 26657 if you are running a public RPC endpoint from this node. Otherwise, you can skip this.

```bash
sudo ufw allow 26657
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
