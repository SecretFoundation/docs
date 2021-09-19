---
title : 'Quick Sync'
---

# Quick Sync

At times you will want to bootstrap a new node quickly or need to start from scratch on an existing node. To do this you can download a copy of the blockchain and get sync'd quicker.

To do this, first stop your node with.

```bash
sudo systemctl stop secret-node
```

Download the quicksync files.

```bash
curl https://quicksync.scrt.network/secret-3-sep19.tar.gz -o secret-3-sep19.tar.gz
```

Note : To check for other quicksync files you can browse https://quicksync.scrt.network

Then untar and move the files into the secretd directory. Run each of these commands one at a time.

```bash
rm -r .secretd/.compute
rm -r .secretd/data
tar -xf secret-3-sep19.tar.gz
```

Then change your node to prune everything so it works with the quicksync file.

Navigate to .secretd/config directory and edit the app.toml

```bash
nano app.toml
```

Change the following value from "syncable" to "nothing"

```bash
# Pruning sets the pruning strategy: syncable, nothing, everything
# syncable: only those states not needed for state syncing will be deleted (keeps last 100 + every 10000th)
# nothing: all historic states will be saved, nothing will be deleted (i.e. archiving node)
# everything: all saved states will be deleted, storing only the current state
pruning = "everything"
```

Then start your node back up

```bash
sudo systemctl start secret-node
```

##### Contributers

*
