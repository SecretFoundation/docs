# Snapshot

Snapshots are compressed folders of the database to reach the current block quickly.

## Install dependencies

```bash
sudo apt update
sudo apt install snapd lz4
```

## Download snapshot

{% hint style="info" %}
This snapshot only supports goleveldb.
{% endhint %}

```
wget -O secret.tar.lz4 https://snapshots.lavenderfive.com/snapshots/secretnetwork/latest.tar.lz4
```

## Delete old data

Reset your node.&#x20;

{% hint style="danger" %}
**WARNING**: This will erase your node database. If you are already running validator, be sure you backed up your `priv_validator_key.json` prior to running the the command. The command does not wipe the file. However, you should have a backup of it already in a safe location.
{% endhint %}

```bash
sudo service secret-node stop
secretd tendermint unsafe-reset-all --home $HOME/.secretd
```

## Decompress snapshot

```bash
lz4 -c -d secret.tar.lz4  | tar -x -C $HOME/.secretd
```

## Download latest addrbook

This will ensure you connect to peers quickly.

```bash
wget -O addrbook.json https://snapshots.lavenderfive.com/addrbooks/secretnetwork/addrbook.json
mv addrbook.json ~/.secretd/config
```

## Restart service

```bash
sudo service secret-node status && sudo journalctl -o cat -fu secret-node
```

