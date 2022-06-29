# Troubleshooting

### panic: SGX\_ERROR\_NO\_DEVICE: Initialize node seed failed

If you get this, generally your server has restarted erroneously. In order to fix it and get secret-node running again, you must reinstall sgx and reload the aesm.service. [Source Discord conversation](https://discord.com/channels/360051864110235648/507935210902650890/790944933547606027).

1.  [Re-install sgx](install-sgx.md)

    ```bash
    sudo bash sgx
    ```
2. Restart the `aesmd.service`

```
systemctl restart aesmd && journalctl -fu aesmd
```

![aesmd.service](<../../.gitbook/assets/Screen Shot 2022-06-27 at 5.54.36 PM.png>)

4\. Restart `secret-node.service`

```
systemctl restart secret-node && journalctl -fu secret-node
```

![](<../../.gitbook/assets/Screen Shot 2022-06-27 at 5.57.39 PM.png>)
