# Running Multiple Nodes on the Same Server

It's possible to run multiple Secret Nodes on the same Secret-compatible server, and it is fairly easy to do so.

### Important Notes

There are 2 important things that must be done for each node:

1. A unique system file is necessary for each node
2. A unique `sgx_secrets` path is necessary for each node
3. All Secret Nodes should have their own user to simplify
4. It's easiest to do this with `auto-register`, but it's possible manual as well
5. Each node must be registered

### Setup

This process assumes you already have a full node running. If you do not, proceed by [Setting Up a Full Node](../node-setup/setup-full-node.md), then returning.

#### 1. Create a User

This isn't necessary, but will help with keeping nodes organized. From here on, the assumption is the username is `secret`, but it can be anything of your choosing.

```
adduser secret
usermod secret -aG sudo
```

#### 2. Verify secretd Access

This will make it so you don't need to install `secretd` multiple times, and therefore, can upgrade all nodes at the same time.

```
secretd status
```

#### 3. Begin Setting up a Node

On the new user, execute steps 1 and 2 of [Setting Up a Full Node](../node-setup/setup-full-node.md). You should now have a `.secretd` directory on the new user, and the correct genesis file.

#### 4. Register the Node

The variables `SCRT_ENCLAVE_DIR` and `SCRT_SGX_STORAGE` are going to need to be custom for each user/node. These variables are NOT the same as the ones in step 3 of setting up a full node.

```bash
export SCRT_ENCLAVE_DIR=~/lib
export SCRT_SGX_STORAGE=~/.secretd/.sgx_secrets
secretd auto-register
```

#### 5. Change Ports

In order for these nodes to work in tandem, they cannot use the same ports. I recommend [this tool](https://cch.79anvi.com/) to help automate changing them.

![Example Ports](<../../../.gitbook/assets/Screen Shot 2022-07-04 at 3.57.33 PM.png>)

Which will then create a command that looks like this:

```bash
sed -i.bak -e "s%^proxy_app = \"tcp://127.0.0.1:26658\"%proxy_app = \"tcp://127.0.0.1:10658\"%; s%^laddr = \"tcp://127.0.0.1:26657\"%laddr = \"tcp://127.0.0.1:10657\"%; s%^pprof_laddr = \"localhost:6060\"%pprof_laddr = \"localhost:10060\"%; s%^laddr = \"tcp://0.0.0.0:26656\"%laddr = \"tcp://0.0.0.0:10656\"%; s%^prometheus_listen_addr = \":26660\"%prometheus_listen_addr = \":10660\"%" $HOME/.secretd/config/config.toml && \
sed -i.bak -e "s%^address = \"tcp://0.0.0.0:1317\"%address = \"tcp://0.0.0.0:10317\"%; s%^address = \":8080\"%address = \":10080\"%; s%^address = \"0.0.0.0:9090\"%address = \"0.0.0.0:10090\"%; s%^address = \"0.0.0.0:9091\"%address = \"0.0.0.0:10091\"%" $HOME/.secretd/config/app.toml
```

#### 6. Create Service File

Note that this service file has two environment variables that are set, as well as a `--home` directory. These will be unique to your user.

```bash
sudo tee /etc/systemd/system/secretd.service > /dev/null <<EOF
[Unit]
Description=Secret Node service
After=network.target

[Service]
Type=simple
Environment=SCRT_ENCLAVE_DIR=/home/secret/lib
Environment=SCRT_SGX_STORAGE=/home/secret/.secretd/.sgx_secrets
WorkingDirectory=/home/secret
ExecStart=/usr/local/bin/secretd start --home /home/secret/.secretd
User=secret
Restart=on-failure
StartLimitInterval=0
RestartSec=3
LimitNOFILE=65535
LimitMEMLOCK=209715200

[Install]
WantedBy=multi-user.target
EOF
```

#### 7. Continue Setting Up a Full Node

At this point, all unique behavior for additional nodes is complete! :tada:

From here, you can return to[ step 9](../node-setup/setup-full-node.md) of setting up a full node. Note that the service file name is different. The following is what the system file commands would look like.

```
sudo systemctl daemon-reload && sudo systemctl enable secretd && \
sudo systemctl restart secretd && sudo journalctl -u secretd -f -o cat
```
