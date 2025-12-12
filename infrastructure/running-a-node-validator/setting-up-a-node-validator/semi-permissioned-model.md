# Semi-Permissioned Model

### Semi-permissioned model of the Network

Following the _wiretap.fail_ (September 2025) and _tee.fail_ (October 2025) disclosures, Secret Network transitioned from being fully permissionless to semi-permissioned.

Nodes running on Microsoft Azure can join the network permissionlessly (see [Adding Azure Node](../adding-an-azure-node.md)). In the future, more cloud providers may be added, as well as machines registered with proofofcloud.org

For nodes running outside Azure, the node’s MachineID must appear in the whitelist embedded in the enclave build. Otherwise, the node cannot join the network.

### Retrieving and Registering the MachineID

#### What is the MachineID?

The MachineID is derived from PPID -  the unique identifier of an Intel SGX-enabled platform.&#x20;

#### How to Retrieve It

Use the `check-hw` tool included in the installation package.

The tool extracts your MachineID, compares it to the public whitelist, and reports:

`Your machine ID: d1b931353e3925bbf98d20046f32921ca761fbb3`\
`✅ This machine ID is known`

or

`Your machine ID: d1b931353e3925bbf98d20046f32921ca761fbb3`\
`🚫 This machine is not known, please contact the dev team`

Whitelist location: https://github.com/scrtlabs/whitelist-test/blob/master/whitelist.txt

**Important:**

A MachineID being “known” only means it exists in the published whitelist.

A node becomes eligible _only after_ that whitelist is included in a network enclave build. Actual location of the whitelist in the source code is [here](https://github.com/scrtlabs/SecretNetwork/blob/accd1dc19af6310dd55b55ca39b62a7819bc9c1e/cosmwasm/enclaves/execute/src/registration/attestation.rs#L146C1-L277C123).&#x20;

#### How to Add New Machines

The recommended method is Governance - see [Adding Nodes via Governance Proposal](../adding-nodes-via-governance-proposal.md). Governance proposals allow the network to approve new MachineIDs and the new nodes can join the network immediately after the governance vote is concluded and the confirmation transaction i ssent.

It is also possible to request addition via the development team. In this case, the node will become eligible only after the next network upgrade, when the updated whitelist is incorporated.

#### MachineID Reset Conditions

The MachineID changes when SGX hardware state is reset, including:

* Toggling SGX off/on in BIOS
* Performing an SGX Reset in BIOS
* Some BIOS/UEFI firmware updates
* Replacing critical hardware (CPU, motherboard or other significant hardware modification)

If the MachineID changes for whatever reason, the new MachineID must be registered again.

