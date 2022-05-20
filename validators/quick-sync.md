# Quick Sync



**NOTE** There are no quicksync snapshots provided at this time. The information below is for if a snapshot is provided by a third party.

At times you will want to bootstrap a new node quickly or need to start from scratch on an existing node. To do this you can download a copy of the blockchain and get sync'd quicker.

To do this, first stop your node with.

```
sudo systemctl stop secret-node
```

Download the quicksync files.

```
curl {SNAPSHOT_URL}
```

Then untar and move the files into the `~/.secretd` directory. Run each of these commands one at a time.

```
rm -r .secretd/.compute
rm -r .secretd/data
tar -xf {SNAPSHOT_NAME}
```

Then change your node to prune everything so it works with the quicksync file.

Navigate to `.secretd/config` directory and edit the app.toml

```
nano app.toml
```

Change the following value from "syncable" to "nothing"

```
# Pruning sets the pruning strategy: syncable, nothing, everything
# syncable: only those states not needed for state syncing will be deleted (keeps last 100 + every 10000th)
# nothing: all historic states will be saved, nothing will be deleted (i.e. archiving node)
# everything: all saved states will be deleted, storing only the current state
pruning = "everything"
```

Then start your node back up

```
sudo systemctl start secret-node
```
