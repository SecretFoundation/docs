# Adding Nodes via Governance Proposal

Since release 1.22, Secret Network limited the admission of new nodes.

Starting with release 1.23 and until further notice, the addition of new nodes is only available via governance. It is also possible to add nodes hosted in Micrsoft Azure without any limitations (see [Adding an Azure Node](adding-an-azure-node.md))

A new governance proposal type has been added:&#x20;

```
MsgUpdateMachineWhitelistProposal
```

In order to create such proposal, use:\
`secretcli tx gov draft-proposal`

Pick the MsgUpdateMachineWhitelist,  choose `/secret.Compute.Vibetal.MsgUpdateMachineWhitelistProposal` type and follow the instructions in the wizard.

After the proposal is passed, it is necessary to send a transacion so that the information on the proposal  is received by the enclave:

\
`secretcli tx compute update-machine-whitelist <machine_id>`
