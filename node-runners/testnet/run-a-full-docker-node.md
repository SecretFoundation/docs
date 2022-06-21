# Run A Full Docker Node

## SGX-enabled Secret Node in Docker <a href="#sgx-enabled-secret-node-in-docker" id="sgx-enabled-secret-node-in-docker"></a>

So you don't want to fiddle with the .deb file, and just want to run your node? We got you, with this quick and easy guide to getting a node started without much tinkering.

This guide will help you set up a node, but you will need to maintain it, or change the default setup. We recommend being familiar with Linux, docker, and docker-compose.

The scripts in the guide will be for Linux (tested on Ubuntu 18.04), but you could get this working on Windows if you swing that way too.

### [#](https://docs.scrt.network/testnet/run-full-node-docker.html#requirements)Requirements <a href="#requirements" id="requirements"></a>

* A public IP address
* Open ports `TCP 26656 & 26657` _Note: If you're behind a router or firewall then you'll need to port forward on the network device._
* Reading https://docs.tendermint.com/master/tendermint-core/running-in-production.html
* Outbound network connection (you will need to connect to a remote service for this setup)

#### [#](https://docs.scrt.network/testnet/run-full-node-docker.html#minimum-requirements)Minimum requirements <a href="#minimum-requirements" id="minimum-requirements"></a>

* 1GB RAM
* 150GB SSD for Prune Everyting, or default pruining. 1TB premium SSD for Archive nodes.
* 1 dedicated core of any Intel Xeon CPU with SGX through SPS.

#### [#](https://docs.scrt.network/testnet/run-full-node-docker.html#recommended-requirements)Recommended requirements <a href="#recommended-requirements" id="recommended-requirements"></a>

* 4GB RAM
* 256GB SSD for Prune Everyting, or default pruining. 1TB premium SSD for Archive nodes.
* 2 dedicated core of any Intel Xeon CPU with SGX through SPS.
* Known Working CPUs (E-2276G, E-2278G, E-2286G, E-2288G) Non Xeon CPUs are reported to not get updated often enough to be compliant.
* Motherboard with support for SGX in the BIOS

Refer to https://ark.intel.com/content/www/us/en/ark.html#@Processors if unsure if your processor supports SGX.

### [#](https://docs.scrt.network/testnet/run-full-node-docker.html#installation)Installation <a href="#installation" id="installation"></a>

#### [#](https://docs.scrt.network/testnet/run-full-node-docker.html#\_0-step-up-sgx-on-your-local-machine)0. Step up SGX on your local machine <a href="#_0-step-up-sgx-on-your-local-machine" id="_0-step-up-sgx-on-your-local-machine"></a>

See instructions [here](https://docs.scrt.network/node-guides/setup-sgx.html)

#### [#](https://docs.scrt.network/testnet/run-full-node-docker.html#\_1-make-sure-you-have-the-sgx-device-installed)1. Make sure you have the SGX device installed <a href="#_1-make-sure-you-have-the-sgx-device-installed" id="_1-make-sure-you-have-the-sgx-device-installed"></a>

If you're using Linux either `/dev/sgx` or `/dev/isgx` should exist depending on the driver and hardware you're using.

#### [#](https://docs.scrt.network/testnet/run-full-node-docker.html#\_2-install-docker-docker-compose)2. Install docker & docker-compose <a href="#_2-install-docker-docker-compose" id="_2-install-docker-docker-compose"></a>

Either install yourself, or use this script for Ubuntu

Run as root

```
#! /bin/bash

# Run as root

apt update
apt install apt-transport-https ca-certificates curl software-properties-common -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
apt update
apt install docker-ce -y

# systemctl status docker
curl -L https://github.com/docker/compose/releases/download/1.26.0/docker-compose-"$(uname -s)"-"$(uname -m)" -o /usr/local/bin/docker-compose


chmod +x /usr/local/bin/docker-compose

docker-compose --version
```

#### [#](https://docs.scrt.network/testnet/run-full-node-docker.html#\_3-set-up-tmp-aesmd-folder)3. Set up `/tmp/aesmd` folder <a href="#_3-set-up-tmp-aesmd-folder" id="_3-set-up-tmp-aesmd-folder"></a>

We use this folder to communicate with the aesm (architectural enclave service manager) service. You can use any other folder you want, just change the paths in the scripts

You may have to run this after a reboot, as well, since the /tmp/ folders are volatile.

```
#! /bin/bash

# Aesm service relies on this folder and having write permissions
# shellcheck disable=SC2174
mkdir -p -m 777 /tmp/aesmd
chmod -R -f 777 /tmp/aesmd || sudo chmod -R -f 777 /tmp/aesmd || true
```

#### [#](https://docs.scrt.network/testnet/run-full-node-docker.html#\_4-create-the-docker-compose-file-docker-compose-yaml)4. Create the docker-compose file `docker-compose.yaml` <a href="#_4-create-the-docker-compose-file-docker-compose-yaml" id="_4-create-the-docker-compose-file-docker-compose-yaml"></a>

Edit the path under `devices` to match to your device from step 1

```
version: "3.4"

services:
  aesm:
    image: enigmampc/aesm
    devices:
      - /dev/isgx
    volumes:
      - /tmp/aesmd:/var/run/aesmd
    stdin_open: true
    tty: true

  node:
    image: enigmampc/secret-network-node:v1.0.0-mainnet
    devices:
      - /dev/isgx
    volumes:
      - /tmp/aesmd:/var/run/aesmd
      - /tmp/.secretd:/root/.secretd
      - /tmp/.secretcli:/root/.secretcli
      - /tmp/.sgx_secrets:/root/.sgx_secrets
    environment:
      - SGX_MODE=HW
      - MONIKER
      - RPC_URL
      - CHAINID
      - PERSISTENT_PEERS
      - REGISTRATION_SERVICE
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:26657"]
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
    ports:
      - "26656:26656"
      - "26657:26657"
```

NOTE: If you want to persist the node beyond a reboot, change the paths

```
      - /tmp/.secretd:/root/.secretd
      - /tmp/.secretcli:/root/.secretcli
      - /tmp/.sgx_secrets:/root/.sgx_secrets
```

To something persistent (e.g. in your home directory) like:

```
      - /home/bob/.secretd:/root/.secretd
      - /home/bob/.secretcli:/root/.secretcli
      - /home/bob/.sgx_secrets:/root/.sgx_secrets
```

Note: If you delete or lose either the .secretd or the .sgx\_secrets folder your node will have to reset and resync itself.

#### [#](https://docs.scrt.network/testnet/run-full-node-docker.html#\_5-set-up-environment-variables)5. Set up environment variables <a href="#_5-set-up-environment-variables" id="_5-set-up-environment-variables"></a>

* MONIKER - your network name
* RPC\_URL - address of a node with an open RPC service (you can use `bootstrap.secrettestnet.io:26657`)
* CHAINID - chain-id of the network (for testnet this is `holodeck-2`)
* PERSISTENT\_PEERS - List of peers to connect to initially (for this testnet use `64b03220d97e5dc21ec65bf7ee1d839afb6f7193@bootstrap.secrettestnet.io:26656`)
* REGISTRATION\_SERVICE - Address of registration service (this will help the node start automatically without going through all the manual steps in the other guide) - `bootstrap.secrettestnet.io:26667`

You can set an environment variable using the `export` syntax

`export RPC_URL=bootstrap.secrettestnet.io:26657`

#### [#](https://docs.scrt.network/testnet/run-full-node-docker.html#\_6-start-your-node)6. Start your node <a href="#_6-start-your-node" id="_6-start-your-node"></a>

`docker-compose up -d`

After creating the machine a healthy status of the node will have 2 containers active:

`docker ps`

```
CONTAINER ID        IMAGE                                      COMMAND                  CREATED             STATUS                    PORTS                                  NAMES
bf9ba8dd0802        enigmampc/secret-network-node:v1.0.0-mainnet   "/bin/bash startup.sh"   13 minutes ago      Up 13 minutes (healthy)   0.0.0.0:26656-26657->26656-26657/tcp   secret-node_node_1
2405b23aa1bd        cashmaney/aesm                             "/bin/sh -c './aesm_…"   13 minutes ago      Up 13 minutes                                                    secret-node_aesm_1
```

#### [#](https://docs.scrt.network/testnet/run-full-node-docker.html#\_7-helpful-aliases)7. Helpful aliases <a href="#_7-helpful-aliases" id="_7-helpful-aliases"></a>

We recommend setting the following aliases, which will allow you to transparently use the `secretd` and `secretcli` commands from the host (rather than having to exec into the container)

```
echo 'alias secretcli="docker exec -it secret-node_node_1 secretcli"' >> $HOME/.bashrc
echo 'alias secretd="docker exec -it secret-node_node_1 secretd"' >> $HOME/.bashrc
```

Where `secret-node_node_1` should be the name of the node container (but it may be different, you can check with `docker ps`)

#### [#](https://docs.scrt.network/testnet/run-full-node-docker.html#\_8-troubleshooting)8. Troubleshooting <a href="#_8-troubleshooting" id="_8-troubleshooting"></a>

You can see the logs of the node by checking the docker logs of the node container:

`docker logs secret-node_node_1`

If you want to debug/do other stuff with your node you can exec into the actual node using

`docker exec -it secret-node_node_1 /bin/bash`
