---
icon: pencil
---

# AMD SEV-SNP Attestation Report - Key Fields

An AMD SEV-SNP **Attestation Report** contains several cryptographic measurements that prove the integrity of the Confidential Virtual Machine. These values are generated during the boot process and serve as a **verifiable fingerprint** of the system state.

#### Attestation Report Structure

An SEV-SNP attestation report contains measurements, policy constraints, and platform state, all covered by a cryptographic signature.

Below are the key fields and their meaning.

<table><thead><tr><th width="208.7109375">Field</th><th>Description</th></tr></thead><tbody><tr><td>version</td><td>Report format version. Defines how the rest of the report should be interpreted.</td></tr><tr><td>guest_svn</td><td>Security Version Number - monotonically increasing version number of the guest image. Used for rollback protection.</td></tr><tr><td>chip_id</td><td>A unique 64-byte identifier that represents the specific AMD physical processor (CPU) chip on which the SEV-SNP guest is currently running</td></tr><tr><td>family_id</td><td>A string representing the SecretVM type and size (e.g. prod-small-sev)</td></tr><tr><td>image_id</td><td>A string showing the version of SecretVM artifacts that the machine is running (e.g. v0.0.24)</td></tr><tr><td>measurement</td><td>Contains measurements of all the components of the VM, hashed consecutively: firmware, kernel, kernel commandline, initial RAM FS, Root FS, the docker-compose.yaml and (optionally) the dockerfiles.tar archive.<br>The measurement field essentially defines the identity of the SecretVM</td></tr><tr><td>report_data</td><td>A special field that concatenates:<br>- The <strong>fingerprint of the TLS certificate</strong> generated on the VM<br>- The <strong>nonce of the GPU Attestation Quote</strong> (for GPU-enabled machines only).</td></tr></tbody></table>
