# SGX-enabled Secret Node in Docker

So you don't want to fiddle with the .deb file, and just want to run your node? We got you, with this quick and easy guide to getting a node started without much tinkering.

This guide will help you set up a node, but you will need to maintain it, or change the default setup. We recommend being familiar with Linux, docker, and docker-compose.

The scripts in the guide will be for Linux (tested on Ubuntu 20.04), but you could get this working on Windows if you swing that way too.

## Requirements

- A public IP address
- Open ports `TCP 26656 & 26657` _Note: If you're behind a router or firewall then you'll need to port forward on the network device._
- Reading https://docs.tendermint.com/master/tendermint-core/running-in-production.html
- Outbound network connection (you will need to connect to a remote service for this setup)

### Minimum requirements

- 16GB RAM (and 10 GB of swap memory)
- 100GB HDD
- 1 dedicated core of any Intel Skylake processor (Intel® 6th generation) or better

### Recommended requirements

- 32GB RAM
- 256GB SSD
- 2 dedicated cores of any Intel Skylake processor (Intel® 6th generation) or better
- Motherboard with support for SGX in the BIOS

Refer to https://ark.intel.com/content/www/us/en/ark.html#@Processors if unsure if your processor supports SGX.

## Installation

### 0. Step up SGX on your local machine

See instructions [here](./setup-sgx.md)

### 1. Make sure you have the SGX device installed

If you're using Linux either `/dev/sgx` or `/dev/isgx` should exist depending on the driver and hardware you're using.

### 2. Install docker & docker-compose

Either install yourself, or use this script for Ubuntu

Run as root

```bash
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

### 3. Set up `/tmp/aesmd` folder

We use this folder to communicate with the aesm (architectural enclave service manager) service. You can use any other folder you want, just change the paths in the scripts

You may have to run this after a reboot, as well, since the /tmp/ folders are volatile.

```bash
#! /bin/bash

# Aesm service relies on this folder and having write permissions
# shellcheck disable=SC2174
mkdir -p -m 777 /tmp/aesmd
chmod -R -f 777 /tmp/aesmd || sudo chmod -R -f 777 /tmp/aesmd || true
```

### 4. Create the docker-compose file `docker-compose.yaml`

Edit the path under `devices` to match to your device from step 1

```yaml
version: '3.4'

services:
  aesm:
    image: fortanix/aesmd:2.13.103.1-1
    devices:
      - /dev/sgx/enclave
      - /dev/sgx/provision
    volumes:
      - /tmp/aesmd:/var/run/aesmd
    stdin_open: true
    tty: true

  node:
    image: ghcr.io/scrtlabs/secret-network-node:1.3.0-docker
    devices:
      - /dev/sgx/enclave
      - /dev/sgx/provision
    volumes:
      - /tmp/aesmd:/var/run/aesmd
      - /tmp/.secretd:/root/.secretd
      - /tmp/.secretcli:/root/.secretcli
      - /tmp/.sgx_secrets:/opt/secret/.sgx_secrets
    environment:
      - SGX_MODE=HW
      - MONIKER
      - CHAINID
      - STATE_SYNC1
      - STATE_SYNC2
      - REGISTRATION_SERVICE
      - FORCE_RESYNC
      - FORCE_REGISTER
      
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:26657"]
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
    ports:
      - "26656:26656"
      - "26657:26657"
      - "1317:1317"
      - "9091:9091"
```

* Note that the device paths (`/dev/sgx/provision` and `/dev/sgx/enclave`) should correspond to the devices that exist on the host. 

* If you wish to run a secret node without the aesmd container it is possible to map the volume `- /tmp/aesmd:/var/run/aesmd` to the host instead (by default this will be in `/var/run/aesmd` on the host)

* If you want to persist the node beyond a reboot, change the paths

```
      - /tmp/.secretd:/root/.secretd
      - /tmp/.sgx_secrets:/root/.sgx_secrets
```

To something persistent (e.g. in your home directory) like:

```
      - /home/bob/.secretd:/root/.secretd
      - /home/bob/.sgx_secrets:/root/.sgx_secrets
```

Note: If you delete or lose either the .secretd or the .sgx_secrets folder your node will have to reset and resync itself.

### 5. Set up environment variables

- MONIKER - Name of your node
- [optional] CHAINID - chain-id of the network (for testnet this is `supernova-1`, for mainnet this is `secret-4`)
- [optional] REGISTRATION_SERVICE - Address of registration service (if you are not using a custom registeration service leave this blank)
- [optional] STATE_SYNC1/STATE_SYNC2 - If you wish to sync using state sync, you can set these values as the state sync peers that the node will use. You may set only STATE_SYNC1 if you do not wish to use two different endpoints
- [optional] FORCE_RESYNC - set this environment variable to force the node to reset the state on startup and resync
- [optional] FORCE_REGISTER - set this environment variable to force the node to re-register with the network

You can set an environment variable using the `export` syntax

`export MONIKER=my_node_name`

or using an .env file

### 6. Start your node

`docker-compose up -d`

After creating the machine a healthy status of the node will have 2 containers active:

`docker ps`

```
CONTAINER ID        IMAGE                                      COMMAND                  CREATED             STATUS                    PORTS                                  NAMES
bf9ba8dd0802        ghcr.io/scrtlabs/secret-network-node:1.3.1   "/bin/bash mainnet_n…"   10 minutes ago   Up 10 minutes (healthy)   0.0.0.0:1317->1317/tcp, :::1317->1317/tcp, 0.0.0.0:9091->9091/tcp, :::9091->9091/tcp, 0.0.0.0:26656-26657->26656-26657/tcp, :::26656-26657->26656-26657/tcp   secret-node_node_1
2405b23aa1bd        fortanix/aesm                             "/bin/sh -c './aesm_…"   13 minutes ago      Up 13 minutes                                                    secret-node_aesm_1
```

### 7. Helpful aliases

We recommend setting the following aliases, which will allow you to transparently use the `secretd` and `secretcli` commands from the host (rather than having to exec into the container)

```
echo 'alias secretcli="docker exec -it secret-node_node_1 secretcli"' >> $HOME/.bashrc
echo 'alias secretd="docker exec -it secret-node_node_1 secretd"' >> $HOME/.bashrc
```

Where `secret-node_node_1` should be the name of the node container (but it may be different, you can check with `docker ps`)

### 8. Troubleshooting

You can see the logs of the node by checking the docker logs of the node container:

`docker logs secret-node_node_1`

If you want to debug/do other stuff with your node you can exec into the actual node using

`docker exec -it secret-node_node_1 /bin/bash`
