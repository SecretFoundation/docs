The following is a general guide for upgrading the Secret Network starting from version **1.18**, where we finally switch to _mrenclave_ sealing.

# v1.18

This is the first scheduled version to use _mrenclave_ sealing. As part of the upgrade process, the legacy (i.e. files sealed with _mrsigner_) should be imported.
The upgrade should proceed according to the following steps:

1. Create a software-upgrade proposal (as usual). Vote for it, and wait till the upgrade height is reached.
2. Install the new node version (v1.18)
   - **Important**: don't start the new node yet.
3. Run the migration command:
   - `secretd migrate_op 4`
   - This should import the legacy data (several files with `.sealed` extension, sealed with _mrsigner_)
4. Start the new node:
   `sudo systemctl start secret-node`

# Consequent versions

For the consequent upgrades, there's a data handover mechanism, where both current and next enclave versions communicate to migrate the sealed data.
After the next version has been built, the `mrenclave` value of the next secret enclave should be known **prior** to the upgrade, and then the current version of the enclave should be given an evidence that confirms that the next version is eligible for the data handover.

There're 2 upgrade mechanisms:
- On-chain (a.k.a. regular) upgrade
- Off-chain (a.k.a. emergency) upgrade
The on-chain upgrade is preferrable, it involves less hassles for the user. The off-chain upgrade should be used as an emergency measure, if for some reason the on-chain upgrade can't be used (such as sudden network stop due to a bug, or etc.)

### Finding-out the `mrenclave` of the next version
(This part is essential for developers. No for the users, that perform the actual upgrade)

After the new version is built, there's a `.deb` file, includes the installation files.

#### Method 1
The simplest way to find the `mrenclave` value would be to install and run this version once on a dev machine. Upon running, the node would create its sealed data file, unless it already exists. The file itself has its `mrenclave` hash included in its name. The file can be seen in the `/opt/secret/.sgx_secrets` directory, and should be named like the following:
```
-rw-rw-r-- 1 azureuser azureuser  4096 Feb  9 07:40 data-3cd370317fd400d29afa3b4ef943d623599355eeb3aea40a86b23bd5d7adf6f0.bin
```
In this example, the `mrenclave` of this enclave is `3cd370317fd400d29afa3b4ef943d623599355eeb3aea40a86b23bd5d7adf6f0`.

#### Method 2
If for some reasons installing and running this version is not possible (such as if there's another version of node is running, or the machine has no SGX), it's possible to extract the enclave file from the installation package, and measuring its `mrenclave` externally:
```
# First, extract the installation archive:
ar x build/<installation-archive>.deb

# among the extracted files there should be data.tar.zst. Unpack it
tar --zstd -xvf data.tar.zst

# Now use sgx_sign tool to get the measurements of the enclave file:
sgx_sign dump -enclave ./usr/lib/librust_cosmwasm_enclave.signed.so -dumpfile /dev/stdout
```
The enclave file metrics should include, among other things, the value of `mrenclave`. Such as in this example:
```
metadata->enclave_css.body.enclave_hash.m:
0x3c 0xd3 0x70 0x31 0x7f 0xd4 0x00 0xd2 0x9a 0xfa 0x3b 0x4e 0xf9 0x43 0xd6 0x23
0x59 0x93 0x55 0xee 0xb3 0xae 0xa4 0x0a 0x86 0xb2 0x3b 0xd5 0xd7 0xad 0xf6 0xf0
```

## On-chain upgrade preparations

There should be an upgrade proposal (as usual). In addition to the common upgrade parameters, the following should be included in the upgrade plan:
```
   "plan": {
    "info": "MREnclaveHash:3cd370317fd400d29afa3b4ef943d623599355eeb3aea40a86b23bd5d7adf6f0",
   }
```

i.e. it should include the `mrenclave` of the next secret enclave (`3cd370317fd400d29afa3b4ef943d623599355eeb3aea40a86b23bd5d7adf6f0` in the above example).

The following are the steps of the upgrade:
1. Submit an upgrade proposal and vote for it (as usual).
2. Wait until the proposal is passed, but **before the upgrade height is reached**.
3. Send upgrade confirmation transaction:
   - `secretcli tx compute upgrade-proposal-passed 3cd370317fd400d29afa3b4ef943d623599355eeb3aea40a86b23bd5d7adf6f0`
   - Make sure tx was accepted in a block
4. Wait till the upgrade height is reached

## Off-chain upgrade preparations

Each validator with the voting power should run this command:
```
secretd emergency_approve_upgrade 3cd370317fd400d29afa3b4ef943d623599355eeb3aea40a86b23bd5d7adf6f0
```

The output should look like this:
```
Signature: {"86BA1F5334D21B1260AE3816BC0CEEAD90CAEC0B":["9TPTQRn/uMAV/fPyc4cC1IIgzVNQM1woDbE7BDTErOo=","vi/PaNbqZ601x6c0MYIydIi+pUCBOV31TW27nj3y1PuKGZ5a17Co0FzLDNhfHWNDaGzHuxHVbD+nXlMlZd5PCA=="]
```

The goal is to reach enough voting power and enough whitelisted validators to enable the upgrade. All those outputs from different validators should be aggregated into a single json file. Then, during the upgrade, this file should be copied there:
```
/opt/secret/.sgx_secrets/migration_consensus.json
```

## Upgrade procedure

After the upgrade evidence is received (either on-chain, or off-chain), the upgrade may proceed

1. Stop the node
2. Remove migration files that could be left from previous migrations
   - `rm /opt/secret/.sgx_secrets/migration_*`
3. In case it's an off-chain upgrade, make sure to put the `migration_consensus.json` file
4. Get the self target info
  - `secretd migrate_op 5`
  - This is optional, but recommended, to enable local attestation rather than remote one
5. Switch to the new enclave version
   - Either install the new version, or download and use `check_hw` tool, while keeping the current node version
6. Get the migration report
   - `secretd migrate_op 1`
7. Switch back to the previous version (needed if in step 5 the new version was installed)
8. Export sealed data
   - `secretd migrate_op 2`
9. Install the new version
10. Import the sealed data
   - `secretd migrate_op 3`
11. Start node

