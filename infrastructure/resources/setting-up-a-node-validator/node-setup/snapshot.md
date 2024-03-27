# Quicksync / Snapshot

Snapshots are compressed folders of the database to reach the current block quickly.

You can either chose to use the [#id-1-download-the-secret-network-package-installer-for-debian-ubuntu](snapshot.md#id-1-download-the-secret-network-package-installer-for-debian-ubuntu "mention") or do it with the [#id-1-download-the-secret-network-package-installer-for-debian-ubuntu-1](snapshot.md#id-1-download-the-secret-network-package-installer-for-debian-ubuntu-1 "mention")

{% hint style="danger" %}
**WARNING**: This will erase your node database. If you are already running validator, be sure you backed up your `priv_validator_key.json` prior to running the command. The command does not wipe the file. However, you should have a backup of it already in a safe location.
{% endhint %}

## Quicksync / Snapshot script <a href="#id-1-download-the-secret-network-package-installer-for-debian-ubuntu" id="id-1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

### Download the quicksync script

```bash
wget https://raw.githubusercontent.com/SecretFoundation/docs/main/docs/node-guides/quicksync
```

### Run the quicksync script

```bash
bash quicksync
```

## Manual Method <a href="#id-1-download-the-secret-network-package-installer-for-debian-ubuntu" id="id-1-download-the-secret-network-package-installer-for-debian-ubuntu"></a>

All of the above steps can also be done manually if you wish.

### Download snapshot

Quicksync / snapshots are provided by [Lavender.five Nodes](https://services.lavenderfive.com/mainnet/secretnetwork/snapshot).

```
wget -O secret.tar.lz4 https://snapshots.lavenderfive.com/snapshots/secretnetwork/latest.tar.lz4
```

### Install dependencies

```bash
sudo apt update
sudo apt install snapd lz4 pv
```

### Delete old data

Reset your node.&#x20;

```bash
sudo systemctl stop secret-node
secretd tendermint unsafe-reset-all --home $HOME/.secretd
```

### Decompress snapshot

```bash
lz4 -c -d secret.tar.lz4 | pv -s $(du -sb secret.tar.lz4 | awk '{ print $1 }') | tar -x -C $HOME/.secretd
```

### Download latest addrbook

This will ensure you connect to peers quickly.

```bash
wget -O addrbook.json https://snapshots.lavenderfive.com/addrbooks/secretnetwork/addrbook.json
mv addrbook.json $HOME/.secretd/config
```

### Restart service and open logs

```bash
sudo systemctl restart secret-node && journalctl -fu secret-node
```

