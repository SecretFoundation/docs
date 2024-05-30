# Statesync

{% hint style="info" %}
[Got questions or need help with ](#user-content-fn-1)[^1]using state-sync properly?

* You can find help in Telegram [here](https://t.me/SCRTNodeSupport)
* Visit the Secret Network Discord [here](https://discord.com/invite/SJK32GY) and ask in #node-discussion or #node-support for help
{% endhint %}

{% hint style="info" %}
A complete to go command that should fit most needs can be found at [#fast-state-sync-script](state-sync.md#fast-state-sync-script "mention"). Be aware that this script can also fail or cause problems. In that case please ask for help in the channels above.
{% endhint %}

Statesync is a module built into the Cosmos SDK to allow validators to rapidly join the network by syncing your node with a snapshot enabled RPC from a trusted block height.

This greatly reduces the time required for a node to sync with the network from days to minutes. The limitations of this are that there is not a full transaction history, just the most recent state that the state-sync RPC has stored. An advantage of state-sync is that the database is very small in comparison to a fully synced node, therefore using state-sync to re-sync your node to the network can help keep running costs lower by minimizing storage usage.

By syncing to the network with state-sync, a node can avoid having to go through all the upgrade procedures and can sync with the most recent binary only.

## Mainnet Statesync <a href="#mainnet-state-sync" id="mainnet-state-sync"></a>

{% hint style="info" %}
**This documentation assumes you have followed the instructions for** [**Running a Full Node**](setup-full-node.md)**.**
{% endhint %}

First, adjust the configuration to be compatible with state-sync:

#### Set IAVL-disable-fastnode

IAVL fast node **must** be disabled, otherwise the daemon will attempt to upgrade the database whil state sync is occuring.&#x20;

```
sed -i.bak -e "s/^iavl-disable-fastnode *=.*/iavl-disable-fastnode = true/" $HOME/.secretd/config/app.toml
```

#### Set correct snapshot-interval

To ensure that state-sync works on your node, it has to look for the correct snapshots that the snapshot RPC provides.

```toml
sed -i.bak -e "s/^snapshot-interval *=.*/snapshot-interval = 2000/" -e "s/^snapshot-keep-recent *=.*/snapshot-keep-recent = 3/" $HOME/.secretd/config/app.toml
```

### Assign And Verify Variables

SNAP\_RPC is the RPC node endpoint that is used for statesyncing

```bash
SNAP_RPC="https://rpc.statesync.secretsaturn.net:443"
```

Set the state-sync `BLOCK_HEIGHT` and fetch the `TRUST_HASH` from the snapshot RPC. The `BLOCK_HEIGHT` to sync is determined by finding the latest block that's a multiple of snapshot-interval.

<pre class="language-bash"><code class="lang-bash">SNAP_RPC="https://rpc.statesync.secretsaturn.net:443" &#x26;&#x26;
<strong>BLOCK_HEIGHT=$(curl -s $SNAP_RPC/block | jq -r .result.block.header.height | awk '{print $1 - ($1 % 2000-3)}') &#x26;&#x26;
</strong>TRUST_HASH=$(curl -s "$SNAP_RPC/block?height=$BLOCK_HEIGHT" | jq -r .result.block_id.hash)

echo $BLOCK_HEIGHT $TRUST_HASH
</code></pre>

The output should be similar to:&#x20;

```bash
# 11238000 B342DB8A2B603F528F1F6372FE088F48D8FD0B8CD2FFB7E6B96EEDF9B804BA5B
```

### Set Variables In \~/.secretd/config/config.toml

```bash
sed -i.bak -E "s|^(enable[[:space:]]+=[[:space:]]+).*$|\1true| ; \
s|^(rpc_servers[[:space:]]+=[[:space:]]+).*$|\1\"http://rpc.statesync1.secretsaturn.net:26657,http://rpc.statesync2.secretsaturn.net:26657,http://rpc.statesync3.secretsaturn.net:26657\"| ; \
s|^(trust_height[[:space:]]+=[[:space:]]+).*$|\1$BLOCK_HEIGHT| ; \
s|^(trust_hash[[:space:]]+=[[:space:]]+).*$|\1\"$TRUST_HASH\"|" $HOME/.secretd/config/config.toml
```

### Reset Database And Stop Node

[Got questions or need help with ](#user-content-fn-2)[^2]using statesync properly?

* You can find help in Telegram [here](https://t.me/SCRTNodeSupport)
* Visit the Secret Network Discord [here](https://discord.com/invite/SJK32GY) and ask in #node-discussion or #node-support for help

{% hint style="danger" %}
This will erase your node database. If you are already running validator, be sure you backed up your `config/priv_validator_key.json` prior to running `unsafe-reset-all`.

It is recommended to copy the signing state of the node by coping `data/priv_validator_state.json` and only running `unsafe-reset-all` to avoid potential double signing.&#x20;
{% endhint %}

The code below stops the node, resets the temporary directory and resets the node into a fresh state.

```bash
sudo systemctl stop secret-node && 
sudo umount -l /tmp && 
sudo mount -t tmpfs -o size=12G,mode=1777 overflow /tmp &&
sudo rm -rf $HOME/.secretd/.compute &&
sudo rm -rf $HOME/.secretd/data &&
mkdir $HOME/.secretd/data &&
secretd tendermint unsafe-reset-all  --home $HOME/.secretd &&
mkdir $HOME/.secretd/data/snapshots/
```

### Restart Node And Check Logs

This generally takes several minutes to complete, but has been known to take up to 24 hours. To better help the process along, add [seeds](../../maintaining-a-node-validator/troubleshooting.md#undefined).

```bash
sudo systemctl restart secret-node && journalctl -fu secret-node
```

![Expected State Sync Output](<../../../../.gitbook/assets/Screen Shot 2022-07-03 at 7.56.31 PM.png>)

### In case state-sync fails

When state-sync fails, you can restart the process and try again using the condensed script below. This usually fixes some of the random problems with it:

<pre class="language-bash"><code class="lang-bash">SNAP_RPC="https://rpc.statesync.secretsaturn.net:443" &#x26;&#x26;
BLOCK_HEIGHT=$(curl -s $SNAP_RPC/block | jq -r .result.block.header.height | awk '{print $1 - ($1 % 2000-3)}') &#x26;&#x26;
TRUST_HASH=$(curl -s "$SNAP_RPC/block?height=$BLOCK_HEIGHT" | jq -r .result.block_id.hash) &#x26;&#x26;
sed -i.bak -E "s|^(enable[[:space:]]+=[[:space:]]+).*$|\1true| ; \
s|^(rpc_servers[[:space:]]+=[[:space:]]+).*$|\1\"http://rpc.statesync1.secretsaturn.net:26657,http://rpc.statesync2.secretsaturn.net:26657,http://rpc.statesync3.secretsaturn.net:26657\"| ; \
s|^(trust_height[[:space:]]+=[[:space:]]+).*$|\1$BLOCK_HEIGHT| ; \
s|^(trust_hash[[:space:]]+=[[:space:]]+).*$|\1\"$TRUST_HASH\"|" $HOME/.secretd/config/config.toml &#x26;&#x26;
echo $BLOCK_HEIGHT $TRUST_HASH &#x26;&#x26;
<strong>sudo systemctl stop secret-node &#x26;&#x26; 
</strong>sudo umount -l /tmp &#x26;&#x26; 
sudo mount -t tmpfs -o size=12G,mode=1777 overflow /tmp &#x26;&#x26;
sudo rm -rf $HOME/.secretd/.compute &#x26;&#x26;
sudo rm -rf $HOME/.secretd/data &#x26;&#x26;
mkdir $HOME/.secretd/data &#x26;&#x26;
secretd tendermint unsafe-reset-all  --home $HOME/.secretd &#x26;&#x26;
mkdir $HOME/.secretd/data/snapshots/ &#x26;&#x26;
sudo systemctl restart secret-node &#x26;&#x26; 
journalctl -fu secret-node
</code></pre>

## Fast State-sync script

{% hint style="info" %}
To safe time, you can use this script to quickly init everything you need for statesync. Please be aware that this might be dangerous if you have a validator.
{% endhint %}

<pre class="language-bash"><code class="lang-bash">sed -i.bak -e "s/^iavl-disable-fastnode *=.*/iavl-disable-fastnode = true/" $HOME/.secretd/config/app.toml &#x26;&#x26;
sed -i.bak -e "s/^snapshot-interval *=.*/snapshot-interval = 2000/" -e "s/^snapshot-keep-recent *=.*/snapshot-keep-recent = 3/" $HOME/.secretd/config/app.toml &#x26;&#x26;
SNAP_RPC="https://rpc.statesync.secretsaturn.net:443" &#x26;&#x26;
BLOCK_HEIGHT=$(curl -s $SNAP_RPC/block | jq -r .result.block.header.height | awk '{print $1 - ($1 % 2000-3)}') &#x26;&#x26;
TRUST_HASH=$(curl -s "$SNAP_RPC/block?height=$BLOCK_HEIGHT" | jq -r .result.block_id.hash) &#x26;&#x26;
sed -i.bak -E "s|^(enable[[:space:]]+=[[:space:]]+).*$|\1true| ; \
s|^(rpc_servers[[:space:]]+=[[:space:]]+).*$|\1\"http://rpc.statesync1.secretsaturn.net:26657,http://rpc.statesync2.secretsaturn.net:26657,http://rpc.statesync3.secretsaturn.net:26657\"| ; \
s|^(trust_height[[:space:]]+=[[:space:]]+).*$|\1$BLOCK_HEIGHT| ; \
s|^(trust_hash[[:space:]]+=[[:space:]]+).*$|\1\"$TRUST_HASH\"|" $HOME/.secretd/config/config.toml &#x26;&#x26;
echo $BLOCK_HEIGHT $TRUST_HASH &#x26;&#x26;
<strong>sudo systemctl stop secret-node &#x26;&#x26; 
</strong>sudo umount -l /tmp &#x26;&#x26; 
sudo mount -t tmpfs -o size=12G,mode=1777 overflow /tmp &#x26;&#x26;
sudo rm -rf $HOME/.secretd/.compute &#x26;&#x26;
sudo rm -rf $HOME/.secretd/data &#x26;&#x26;
mkdir $HOME/.secretd/data &#x26;&#x26;
secretd tendermint unsafe-reset-all  --home $HOME/.secretd &#x26;&#x26;
mkdir $HOME/.secretd/data/snapshots/ &#x26;&#x26;
sudo systemctl restart secret-node &#x26;&#x26; 
journalctl -fu secret-node
</code></pre>

[^1]: 

[^2]: 
