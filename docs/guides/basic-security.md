# Basic security for your nodes.

To add basic security to your node, we've provided a guide that covers 2 simple tools.

* Fail2ban
* UFW

## FAil2ban

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
