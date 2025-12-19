# 🌱 Seed Server (only for Seed Rotation)

In some of the network upgrades, it may be decided to perform a Seed Rotation.

In this case, one Enclave is set up to be a Seed Server, whose role is to generate a new network seed and distribute it to all other Enclaves while the network is being upgraded.



One party is chosen to run the Seed Server, and all the other nodes should use that seed server - that should be configured in the upgrade script - see below.

The following steps are required to set up the seed server:

#### Generate a new Seed&#x20;

```
./check-hw --migrate_op 6 [--testnet]
```

Upon completion, the command prints out the public keys of the new Seed, like so:

```
Creating enclave instance..
Generate true random seed for rotation
rot_seed pubkey
pnlfbLV7oxkXr4tqyW+ewQG1qQ1nxsjQVSrxYdKyHHM=,zhXpu9bAeZOQdAcxzAf+5v1IfaF2LqfXlvUtEp4cCys=
New seed generated
Migration op reval: SGX_SUCCESS., SGX_SUCCESS.
```

**Note:** the new seed must be generated some time before the actual upgrade so that the public key verification can be incorporated into the upgrade script

#### Start the Seed Server

The Seed Server is started using the following command:

```
./check-hw --server_seed [--testnet]
```

The Seed Server needs to be running during the upgrade and for several days thereafter to accomodate the late comers.&#x20;

Once the seed server is stopped, nodes operators will not be able to upgrade their nodes, and will need to re-register.

#### Preparing the upgrade script

Use the upgrade script for version 1.22 as an example, substituting the seed server URL for the address in the script

```
# get encrypted seed based on our report
response=$(curl -f -X POST --data-binary @"$STORAGE_PATH/migration_report_remote.bin" http://<Your Seed Server URL>:3000/)

echo "$response" | jq -r '.buf1' | base64 -d >"$STORAGE_PATH/migration_report_remote.bin"
echo "$response" | jq -r '.buf2' | base64 -d >"$STORAGE_PATH/rot_seed_encr.bin"
```

