# Adding Nodes via Governance Proposal

Since release 1.22, Secret Network limited the admission of new nodes.

Starting with release 1.23 and until further notice, the addition of new nodes is only available via governance. It is also possible to add nodes hosted in Micrsoft Azure without any limitations (see [Adding an Azure Node](adding-an-azure-node.md))

### Issuing the Proposal

A new governance proposal type has been added:&#x20;

```
MsgUpdateMachineWhitelistProposal
```

In order to create such proposal, use:\
`secretcli tx gov draft-proposal`

Pick the MsgUpdateMachineWhitelist,  choose `/secret.Compute.v1betal.MsgUpdateMachineWhitelistProposal` type and follow the instructions in the wizard.

Enter the machineId when prompted to `Enter msg machine id`. More than one machineID can be entered, separated by commas.

### Confirmation Transaction after Proposal Passes

After the proposal is passed, it is necessary to send a confirmation transaction so that the information on the proposal  is received by the enclave:

`secretcli tx compute update-machine-whitelist <machine_ids>`&#x20;

The `machine_ids` must exactly match the string entered in the proposal

\
Once the transaction succeeds, the Enclave will receive the new machine\_id(s) and the new node(s) will be able to register on Secret Network
