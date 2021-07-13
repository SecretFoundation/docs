# Basic security for your nodes.

To add basic security to your node, we've provided a guide that covers 2 simple tools.

* Fail2ban
* UFW

## Setup basic intrusion prevention software with Fail2ban

Fail2Ban is an intrusion prevention software framework that protects computer servers from brute-force attacks. Written in the Python programming language, it is able to run on POSIX systems that have an interface to a packet-control system or firewall installed locally, for example, iptables or TCP Wrapper.

# Setup

Install, enable, and start fail2ban

```bash
sudo apt -y install fail2ban
```

```bash
sudo systemctl enable fail2ban
```

```bash
sudo systemctl start fail2ban
```

To see what fail2ban is up to, you can check the logs by running the following command.

```bash
sudo tail -f /var/log/fail2ban.log
```


## Setup a basic Firewall with UFW

Uncomplicated Firewall is a program for managing a netfilter firewall designed to be easy to use. It uses a command-line interface consisting of a small number of simple commands, and uses iptables for configuration. UFW is available by default in all Ubuntu installations after 18.04 LTS.

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

This limits SSH login attempts on the machine. The default is to limit SSH connections from a specific IP address if it attempts 6 or more connections within 30 seconds. Note: fail2ban will do something similar by default, but it doesn't hurt to use both. Using fail2ban vs ufw or in combination with ufw all comes down to preference.

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
