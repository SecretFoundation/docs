---
description: Launch a SecretVM on Google Cloud with managed GCP infrastructure.
icon: cloud
---

# Deploying on Google Cloud Platform

## Using SecretAI Portal

You can launch a SecretVM on **Google Cloud Platform** directly from the SecretAI portal. GCP-backed SecretVMs run on **Intel TDX** hardware inside Google Confidential Computing.

This gives you the same confidentiality guarantees on familiar GCP infrastructure.

When you choose **Google Cloud** in the SecretAI portal, the VM is provisioned in a GCP project managed by Secret Network.

You do not need your own GCP account.

You pay for the GCP resources used by the deployment, plus a separate **Service Fee** charged by the portal.

If you prefer to use your own GCP project and billing account, see [Bring Your Own GCP Project](bring-your-own-gcp-project.md).

{% stepper %}
{% step %}
#### Log In

* Visit the portal: [https://secretai.scrtlabs.com](https://secretai.scrtlabs.com/)
* Sign in with your wallet or Google account
{% endstep %}

{% step %}
**Create a New SecretVM**

* Click **`Create New SecretVM`**
* Under **Cloud Provider**, choose **Google Cloud**

The VM type selector updates to show GCP-compatible sizes. Currently, these are `large` and `xlarge`.
{% endstep %}

{% step %}
**Configure Your Machine**

* **Select VM Type**\
  Choose `large` or `xlarge` based on your workload
* **Upload Docker Compose File**\
  Upload your `docker-compose.yaml` that defines the container workload
* **Set Secret Environment Variables (Optional)**\
  Add environment variables that are injected securely at runtime
{% endstep %}

{% step %}
### Google Cloud deployment details

The first GCP deployment usually takes **5–7 minutes** while the VM image is built and provisioned.

Once the VM is running, you can monitor its status and access attestation endpoints from the SecretVM dashboard.
{% endstep %}

{% step %}
**Launch the VM**

* Click **`Launch your SecretVM`**
* The VM begins provisioning on Google Cloud
* Once it is live, you can monitor status and access attestation endpoints from the SecretVM dashboard
{% endstep %}
{% endstepper %}
