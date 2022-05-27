# Validator Optimisation

Put the content from here and explain it better: [https://gist.github.com/blockpane/40bc6b64caa48fdaff3b0760acb51eaa](https://gist.github.com/blockpane/40bc6b64caa48fdaff3b0760acb51eaa)

Original Content:

### Super-secret tuning tips for secret networks

I'll make a few assumptions here mostly that the reader can find the settings in the .toml files without help; validating on secret isn't exactly a good "my-first-validator" choice.

config:

* Expose validator p2p via firewall, enable pex, make frens.
* Set inbound peers to 200 outbound to 100.
* Disable kv indexer.
* log level set to error with json output -- probably doesn't matter in this case, just less IO.
* disable mempool broadcasting on validator -- less traffic is more cycles, we already have what we need.
* don't retry previously failed transactions: `keep-invalid-txs-in-cache = true`

app:

* Set num states to retain to a different prime on each node around 100 (ie 109, 107, 103 etc.)
* Set prune interval to different primes on each node (ie 17, 43, 61)
* Use cosmprund to trim state to match retention
* disable state snapshots (please run them on at least one node, network needs snapshots to state-sync.)

example ...

```toml
pruning = "custom"
pruning-keep-recent = "109"
pruning-keep-every = "0"
pruning-interval = "13"

# ...

[state-sync]
snapshot-interval = 0

# ...
```

### system tuning:

_apologies to non-ubuntu admins, but you are already used to this shit so figure it out, you are used to it_

* Set CPU governor to performance

```shell
apt-get -y install cpufrequtils

cat > /etc/default/cpufrequtils << EOF
ENABLE="true"
GOVERNOR="performance"
EOF
systemctl restart cpufrequtils
```

* Use lowlatency/SMP PREEMPT kernel

_assumes ubuntu 20.04_

```shell
apt-get install -y linux-lowlatency-hwe-20.04 linux-tools-lowlatency-hwe-20.04 linux-image-lowlatency-hwe-20.04 linux-headers-lowlatency-hwe-20.04
shutdown -r now # reboot to use new kernel
```

* Set Niceness for secretd to -20 via systemd local config

```shell
mkdir -p /etc/systemd/system/secret-node.service.d/
cat > /etc/systemd/system/secret-node.service.d/local.conf << EOF
[Service]
Nice=-20

EOF
systemctl daemon-reload
systemctl restart secret-node
```

* Bump initial TCP congestion windows to 32 and use fair queueing:

_this is route-dependent, we use ansible to build it, but this example assumes you are adding it by hand... adjust accordingly_

add the following to root's crontab:

```
@reboot /sbin/tc qdisc add dev <FIXME-default-interface> root fq
@reboot /usr/bin/ip route change default via <FIXME-default-route-IP-addr> initcwnd 32 initrwnd 32
```

* Bump up network buffer sizes in kernel, a bunch of other misc tuning for faster TCP

_you should research each of these settings on your own, not gonna explain here. You are responsible, not me._

```bash
cat >> /etc/sysctl.conf << EOF
net.core.rmem_max=16777216
net.core.wmem_max=16777216
net.ipv4.tcp_max_syn_backlog=8192
net.core.netdev_max_backlog=65536
net.ipv4.tcp_slow_start_after_idle=0
net.ipv4.tcp_mtu_probing=1
net.ipv4.tcp_sack=0
net.ipv4.tcp_dsack=0
net.ipv4.tcp_fack=0
net.ipv4.tcp_congestion_control=bbr

EOF
sysctl -p
```

* Using striped raid instead of mirrored

_We use zfs almost exclusively because of the ability to snapshot. It sucks for TM chains because of the overhead. This is a short example of creating a stripe, and the settings we use to reduce the IO overhead zfs imposes from about 8x to only about 2x. Once again, don't blindly trust these settings. Google the hell out of these, they might not be what **you** want._

```
zpool create data nvme0n1 nvme1n1 # obviously fix these for correct device names.
zfs set compression=lz4 data
zfs set atime=off data
zfs set logbias=throughput data
zfs set redundant_metadata=most data
zfs set secondarycache=none data

echo 1 > /sys/module/zfs/parameters/zfs_prefetch_disable
echo 'options zfs zfs_prefetch_disable=1' >> /etc/modprobe.d/zfs.conf

zfs create -o mountpoint=/opt/secret data/secret
```

\
