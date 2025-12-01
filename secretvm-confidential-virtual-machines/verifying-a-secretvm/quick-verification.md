# 🐰 Quick Verification

The SecretAI Portal offers a Quick Verification feature, allowing the users to easily confirm that a particular workload is running on a given SecretVM.

To verify, access the[ Verify SecretVM Workload](https://secretai.scrtlabs.com/attestation) feature on the Portal:

<figure><img src="../../.gitbook/assets/image (2) (1) (1).png" alt=""><figcaption></figcaption></figure>

On that page, paste or upload the contents of your docker-compose.yaml file in the first field. In the second field, paste either the SecretVM's attestation quote, or simply the URL of the deployed SecretVM  machine, and click Verify.

The service will provide one of the following responses:

1. SecretVM is authentic and is running the specified workload
2. SecretVM is authentic, but is **not** running the specfied workload
3. The attestation quote does not represent a valid SecretVM
