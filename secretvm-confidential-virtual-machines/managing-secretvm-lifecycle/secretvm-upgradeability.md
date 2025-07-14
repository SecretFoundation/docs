# ⏫ SecretVM Upgradeability

SecretVMs support optional upgradeablility.

In the context of SecretVM, upgradeability means that if the workload is modified (e.g. the docker container is upgraded to a newer version), the upgraded SecretVM will get access to the encrypted state created by the previous version of the VM.

### Defininig Upgradeability at Creation Time

When a SecretVM is created, the developer can decide whether the VM is upgradeable or not. This decision is final and cannot be changed later in the life of SecretVM

If upgradeability is not enabled, the VM's secret keys are generated inside the KMS contract using `AddSecretKeyByImage` method, i.e. the keys can only be accessed by this specific VM image, and if the workload changes, the access to pre-existing secrets will be lost)

If upgradeability is enabled, the a new _service_ is generated in the KMS contract using `CreateService`  and `AddImageToService` messages. In the future, the SecretVM can be upgraded to a new workload (i.e. new set of Attestation registrs), and the new image is added to the _service_ in the KMS contract, thus providing the upgraded VM with access to the persistence state of the previous version.&#x20;

### Transparency and Verifiability

It is important that the end users are aware whether a given SecretVM is upgradeable or not. Similar to smart contracts, the users may be more willing to trust their information to non-upgradeable services. If a SecretVM is upgradeable, it is important that the users can see the upgrade history.

#### Viewing the upgrade history

The upgrade history of a SecretVM is available through a dedicated endpoint built in to the [secret-vm-rest-attest server](https://github.com/scrtlabs/secret-vm-attest-rest-server) that runs as part of the SecretVM Runtime.

The endpoint can be accessed using \<machine url>:29343/vm\_updates

If the machine is upgradeable, the endpoint will show the history of its upgrades.&#x20;

#### On-chain Visibility

Every time a new Image is added to a Service, an `add_image_to_service` event is published on-chain. The event has the following parameters:

* service\_id (ID of the Service to which a new image was aded
* admin (identity of the administrator of the service)
* image (a string representing the attestation fields defining the new image)
* description (optional description provided by the developer)



