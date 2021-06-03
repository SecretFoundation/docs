---
title : 'Quick Sync'
---

# Quick Sync

First stop your node with.

```bash
sudo systemctl stop secret-node
```

Download the quicksync files from (chainofsecrets.org)[https://chainofsecrets.org] by running the below commands.

```bash
wget http://23.29.117.206/data.tar.gz
wget http://23.29.117.206/compute.tar.gz
```

Then untar and move the files into the secretd directory.

```bash
- tar -xf data.tar.gz
- tar -xf compute.tar.gz 
- rm -r .secretd/.compute
- rm -r .secretd/data
- mv data .secretd/
- mv .compute .secretd/
```


Then start your node back up

```bash
sudo systemctl start secret-node
```
