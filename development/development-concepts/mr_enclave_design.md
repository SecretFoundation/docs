The transition to `mr_enclave` consists of 3 parts:
 1. The way how the sealed files will be created (which key would be used)
 2. Authorization control, a way for current enclave to verify that the next enclave is eligible for the export.
 3. The export procedure itself, where the current enclave transcodes the sealed files for the next enclave

# Current design

## 1. Sealed files
The idea is to keep using `SgxFile`, but with the application-supplied key. The application will create its sealing key by a call to `sgx_get_key`, with `SGX_KEYPOLICY_MRENCLAVE | SGX_KEYPOLICY_MRSIGNER`.
All the sealed files will be encoded by this key (in fact the SgxFile will use it as a key-deviation-key, and produce ephemeral keys internally).

**Note**: for this to work the secret enclave (librust) has to be merged with tendermint enclave.

## 2. Authorization control.
We support 2 procedures: On-chain upgrade proposal, and Off-chain emergency procedure.

### On-chain scenario (normal scenario)
The upgrade proposal will include the `mr_enclave` of the new enclave. After the proposal is accepted, an additional transaction will be sent to the network with the message `MsgUpgradeProposalPassed`. This message will contain the exact same `mr_enclave`.
If this message is malicious - it'll be filtered-out in the honest nodes by Ante-handler. Once this message is included in the block - the enclave will handle it, and save the target `mr_enclave` in a local sealed file.

### Off-chain scenario (emergency)
It is intended for the emergency network upgrade. For example, where the network stopped due to a bug. The majority of the validators will sign the upgrade to the new proposed `mr_enclave`. This is done by untrusted code (enclave itsn't involved at all) with their validator account.
Once we have enough validators who signed this, all those signatures will be collected into a single json file. During the export procedure the enclave will check this json file, according to the block header verification logic (i.e. majority of voting power, plus whitelisted validators).

**Note**: in either case, we assume that only enclave signed by our current `mr_signer` is eligible.

## 3. Export procedure.

It's implemented in a way similar to how the registration works.
 1. The new enclave generates a so-called _migration report_, which is an SGX quote with its migration pubkey.
 2. Then the current enclave verifies this report, checks that the next enclave is eligible for the export, and then exports its sealed files, encrypted via DH scheme.
 3. The new enclave reads the sealed files, using the imported migration key, and then writes them for itself using its current sealing key.

**Note**: since it's a 3-way operation, both the current and the next version of the enclave must be present. So before downloading and installing the new version, the user will need to download the `check_hw` tool with the new enclave to perform the needed operations.

# Known vulnerability of this design

The main problem with the above design is that the sealed files are bound to the specific SGX machine, to the `mr_enclave` and `mr_signer`, but <ins>**not to the current network**</ins>.

For instance, the attacker can use the production build to run its own network where it will have the majority of the voting power, a.k.a. _scamnet_, and then copy the generated sealed files into the directory running the mainnet, and vice versa. Using those manipulations, the attacker can perform the following attacks:

### Proposal upgrade acceptance injection
The attacker may create a malicious upgrade proposal on _scamnet_, accept it, and wait till the enclave will generate the corresponding local sealed file. This file is then copied into the node running on the mainnet. Then the attacker can use the migration procedure to reveal the sealing key.

### Validatorset replacement
The attacker can copy the validator set file from _scamnet_ into the mainnet node (this problem is not know actually). Then the attacker can sign the off-chain upgrade proposal with its owned validators, and use the off-chain emergency migration procedure to reveal the sealing key.

### Sealed files replacement
The attacker can perform the migration procedure on _scamnet_. But before doing it, it's possible to replace the local sealed files with those taken from the mainnet network. By such all the production sealed files can be revealed.

**Note**: due to the current restrictions, which are a minimum number of validators from the whitelist, and the fact that we still allow only the current `mr_signer`, those attacks are possible only if the one who has access to the `mr_signer` key (i.e. someone from Secret Labs) colludes with at least 4 other validators from the current validator whitelist.

# Solution proposal

The above attack would be prevented if we bind the sealed files to the network, and prevent possibility to move those files accross different networks. The best seems to bind the sealing key to the current _network seed_.
The following scheme:
 1. The root sealing key is created (as explained before, using both `SGX_KEYPOLICY_MRENCLAVE` and `SGX_KEYPOLICY_MRSIGNER`).
 2. This key is used only to save the current (or genesis?) network seed.
 3. The network seed is then used as a key material to derive a network-bound sealing key.
 4. This network-bound sealing key will be used to encode all other sealed files.

In case the network see is not known (for example, during the node initialization and registration), it's assumed to be zero. Once the network seed becomes known, and also each time the network seed changes (after seed rotation) - all the sealed files are immediately transcoded.
