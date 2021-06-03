---
title : 'Quick Sync'
---

# Quick Sync

At times you will want to bootstrap a new node quickly or need to start from scratch on an existing node. To do this you can download a copy of the blockchain and get sync'd quicker.

To do this, first stop your node with.

```bash
sudo systemctl stop secret-node
```

Download the quicksync files provided by Dan from (chainofsecrets.org)[https://chainofsecrets.org] by running the below commands.

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

##### Contributers

* [chainofsecrets](https://secretnodes.com/secret/chains/secret-2/validators/1B68882AB7CD6BC4CDDD742FC8F3D1FDE31C1A82)