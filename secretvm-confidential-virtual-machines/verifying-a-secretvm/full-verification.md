# 🐢 Full Verification

### Follow the process below to verify the integrity of a given SecretVM instance:

{% stepper %}
{% step %}
### Retrieve the Attestation Quote

Retrieve the Attestation Quote by accessing the `<your_machine_url>:29343/cpu.html`   endpoint on your machine. Copy the Attestation Quote to use in the next step.

To rule out a man-in-the-middle attack, view the certificate that secures the connection and note its fingerprint value

<figure><img src="../../.gitbook/assets/image (28).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
### Verify and Parse the Attestation Quote

Use SecretAI Portal's [Verification ](https://preview-aidev.scrtlabs.com/attestation)page to paste the Attestation Quote on the Verify CPU Attestation tab and click "Verify" to confirm the validity of the quote and see the values of the attestation report fields.&#x20;

<figure><img src="../../.gitbook/assets/image (26).png" alt=""><figcaption></figcaption></figure>

For TDX-based machines, note the values of `mr_td, rtrmr0, rtmr1, rtmr2, rtmr3` registers. For AMD SEV-SNP based machines, note the `measurement` register. Also, note the the report\_data value.
{% endstep %}

{% step %}
### Build the SecretVM artifacts

Clone the [secret-vm-build](https://github.com/scrtlabs/secret-vm-build) repository and follow instructions to build the four artifacts.

The following artifacts will be required:

* `ovmf.fd` - the OVMF-based firmware
* `bzImage` - the OS Kernel
* `initramfs.cpio.gz` - the compressed initial RAM filesystem (initramfs) image
* `rootfs.cpio` - the archive file containing the root file system

The source code for all the components is available in their respective repositories that can be found in Yocto Recipe files.

Alternatively, the artifacts can be downloaded from github [here](https://github.com/scrtlabs/secret-vm-build/releases/).
{% endstep %}

{% step %}
### Independently Calculate the Expected Register Values

#### Intel TDX

For Intel TDX validation, we provide a [reproduce-mr](https://github.com/scrtlabs/reproduce-mr) tool (based on Phala's [dstack-mr](https://github.com/scrtlabs/dstack-mr) and Oasis' [oasis-cli](https://github.com/oasisprotocol/cli)) to perform the calculation of the relevant attestation report fields from the artifacts.

Run <kbd>reproduce-mr</kbd> passing all the necessary parameters to independently calculate the MRTD, RTMR0, RTMR1, RTMR2 and RTMR3 registers of the Attestation Report.&#x20;

Example: \
`./reproduce-mr -fw ovmf.fd -kernel bzImage -initrd auto/initramfs.cpio.gz  -dockercompose config/docker-compose.yaml -rootfs rootfs.iso -memory 2G -cpu 1 -cmdline "console=ttyS0 loglevel=7 clearcpuid=mtrr,rtmr ro initrd=initrd"`

Sample output:

<sup><sub>MRTD: ba87a347454466680bfd267446df89d8117c04ea9f28234dd3d84e1a8a957d5adaf02d4aa88433b559fb13bd40f0109e<sub></sup>\ <sup><sub>RTMR0: b6941a8c47be7050bdba6220b915e141c5e33b9c32d9446f743fe5e73cc7612f55acfa662262d1ea2b8017e519c07a7c<sub></sup>\ <sup><sub>RTMR1: 4afcac4edf01c068d1a623ec69519c9c3a7abc91e3e71a578a5ba346e60c02316d3eeee3a4237e9a4278f2af592211ec<sub></sup>\ <sup><sub>RTMR2: c8f67a1007adb5759cbb5d57b2136bcc54c2d2e4d3bac763b9de4cab78729752d4dff1f054bfbcb38443fa71460e37a2<sub></sup>\ <sup><sub>RTMR3: 9959d12cfe7a120fe363e47e7accb9bd15fba4665bdb8b5186a2b57d7bf1999664a8295d51944f0227eb8ceaeefde133<sub></sup>\ <sup><sub>MR\_AGGREGATED: c3c786f51c9d0af4c05a695f84294860af80aed7a643e865b080c3be56fdbcc6<sub></sup>\ <sup><sub>MR\_IMAGE: efae035908324f4583713a3c9af4f30b1b87c33ec88ed29681742e13acb9e879<sub></sup>

#### AMD SEV-SNP

SEV-SNP-measure tool is available for calculating expected measurements of AMD-SEV-SNP guest VMs.

Given the SecretVM artifacts and additional metadata (e.g. number of vcpus, etc.), the tool calculates the expected value of the **measurement.**

[https://github.com/virtee/sev-snp-measure](https://github.com/virtee/sev-snp-measure)
{% endstep %}

{% step %}
### Compare and Validate

Validate if the calculated register values to the one observed in Step 2

<figure><img src="../../.gitbook/assets/image (18).png" alt=""><figcaption></figcaption></figure>

If the values match, you just confirmed that you are dealing with a genuine Confidential Virtual Machine, that it is composed of the exact artifacts that you built/downloaded, and that it is running the specific docker-compose.yaml file.
{% endstep %}

{% step %}
### Rule out Man-in-the-Midlde Attacks

Verify that the first part of the report\_data field matches the fingerprint of the TLS certificate that was retrieved in Step 1


{% endstep %}
{% endstepper %}
