# Troubleshooting

## Panic: SGX\_ERROR\_NO\_DEVICE: Initialize Node Seed Failed

If you get this, generally your server has restarted erroneously. In order to fix it and get secret-node running again, you must reinstall sgx and reload the aesm.service. [Source Discord conversation](https://discord.com/channels/360051864110235648/507935210902650890/790944933547606027).

1.  [Re-install sgx](broken-reference)

    ```bash
    sudo bash sgx
    ```
2. Restart the `aesmd.service`

```
systemctl restart aesmd && journalctl -fu aesmd
```

![aesmd.service](<../../../.gitbook/assets/Screen Shot 2022-06-27 at 5.54.36 PM.png>)

4\. Restart `secret-node.service`

```
systemctl restart secret-node && journalctl -fu secret-node
```

![Expected Output](<../../../.gitbook/assets/Screen Shot 2022-06-27 at 5.57.39 PM.png>)

## Blocks Aren't Being Produced

If you aren't seeing any blocks being produced, that likely means you don't have any active peers. To solve this:

1. Add seed nodes

```
sed -i.bak -e "s/^seeds *=.*/seeds = \"6fb7169f7630da9468bf7cc0bcbbed1eb9ed0d7b@scrt-seed-01.scrtlabs.com:26656,ab6394e953e0b570bb1deeb5a8b387aa0dc6188a@scrt-seed-02.scrtlabs.com:26656,9cdaa5856e0245ecd73bd464308fb990fbc53b57@scrt-seed-03.scrtlabs.com:26656\"/" $HOME/.secretd/config/config.toml
```

2\. Restart `secret-node`

```
systemctl restart secret-node && journalctl -fu secret-node
```

{% hint style="info" %}
You'll be tempted to add persistent\_peers as well, but unless you have control over the peers, DO NOT add them. Peers change frequently and interfere with the built-in network peering protocol.
{% endhint %}
