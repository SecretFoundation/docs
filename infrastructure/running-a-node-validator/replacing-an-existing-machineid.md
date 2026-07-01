# Replacing an existing MachineID

Starting from v 1.25, node operators can replace their existing MachineID with a new one without issuing a governance proposal.

### Connecting Existing MachineID to Validator Key

First, the node operators need to explicitly connect their existing MachineID to their validator key by obtaining the attestation again, and issuing an additional register transaction on the existing node.

```
# Obtain the attestation again, which is bound to the validator key
# to avoid attestation-validator binding, specify --unbound-attestation flag
secretd init-enclave
```

This will produce the opt/secret/.sgx\_secrets/attestation\_combined.bin  file that will include the binding of your validator key

```
secretcli tx register auth /opt/secret/.sgx_secrets/attestation_combined.bin \ 
 --gas-prices 0.25uscrt --gas 5000000
```

After this transaction is processed, the MachineID of the node is attached to the validator key, and the owner of the key can, if needed, issue a transaction to replace this MachineID with a new one.

### Replacing an existing MachineID

Copy the validator key from the machine on which the original node was running to the new node. Default location of the validator key is .secretd/config/priv\_valitator\_key.json

After that, issue the registration transaction to replace the existng MachineID with the new one:

```
secretcli tx register auth /opt/secret/.sgx_secrets/attestation_combined.bin \ 
 –replace_machine_id <existing MachineID> --gas-prices 0.25uscrt --gas 5000000 
```

After this transaction is mined, the node with old MachineID will stop working, and the new machine will be able to register with the network.

If the old machine is still running and connected to the network, you will see “this node is not allowed to run” message in the logs.

✏️ Note: the “old” machine does not need to exist or be connected to the network in order for the transaction to succeed.

<br>
