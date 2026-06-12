---
description: >-
  Launch a SecretVM in your own Google Cloud project using your own billing
  account.
---

# 🏗️ Bring Your Own GCP Project

## Using SecretAI Portal

You can deploy a SecretVM directly into a Google Cloud project you control.

Your own GCP billing account is used for VM and infrastructure resources.

SecretAI charges a separate **Service Fee** for the platform layer.

{% hint style="info" %}
We strongly recommend creating a **dedicated GCP project** solely for SecretVM deployments. This keeps billing, IAM policies, and resources isolated from your other projects.
{% endhint %}

{% stepper %}
{% step %}
#### Prepare your GCP project

* Open the [Google Cloud Console](https://console.cloud.google.com/)
* Create a new project, or choose an existing one you control
* Make sure you have **Owner** access
* Enable these APIs for the project:
  * **Compute Engine API**
  * **Cloud Storage API**
{% endstep %}

{% step %}
**Create a service account**

* In the GCP Console, go to **IAM & Admin → Service Accounts**
* Click **Create Service Account**
* Set a clear name, such as `secretvm-deployment`
* Click **Create and Continue**

<figure><img src="../../.gitbook/assets/Знімок екрана 2026-06-12 о 14.52.57.png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
**Assign required roles**

Grant the service account these roles:

* **Compute Admin** — `roles/compute.admin`
* **Storage Admin** — `roles/storage.admin`

Then click **Done**.

<figure><img src="../../.gitbook/assets/Знімок екрана 2026-06-12 о 14.53.26.png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
**Create a JSON key**

* Open the service account you created
* Go to the **Keys** tab
* Click **Add key** → **Create new key**
* Select **JSON**
* Click **Create**

GCP downloads the key file to your machine. Keep this file secure.

<figure><img src="../../.gitbook/assets/Знімок екрана 2026-06-12 о 14.53.52.png" alt=""><figcaption></figcaption></figure>

<figure><img src="../../.gitbook/assets/Знімок екрана 2026-06-12 о 14.53.59.png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
**Create a New SecretVM**

* Visit [https://secretai.scrtlabs.com](https://secretai.scrtlabs.com/)
* Click **`Create New SecretVM`**
* Under **Cloud Provider**, choose **Google Cloud**
* Enable the **Deploy to Your Own GCP Project** toggle
* Paste the full contents of the key file into **GCP Service Account Key (JSON)**

The VM type cards show a **Service Fee** label.

GCP bills VM and infrastructure resources directly to your project. The portal charges the separate **Service Fee**.

<figure><img src="../../.gitbook/assets/Знімок екрана 2026-06-12 о 14.52.25.png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
**Configure Your Machine**

* **Select VM Type**\
  Choose `large` or `xlarge`
* **Upload Docker Compose File**\
  Upload your `docker-compose.yaml`
* **Set Secret Environment Variables (Optional)**\
  Add environment variables that are injected securely at runtime
* **Additional Ports (Optional)**\
  Ports `80`, `443`, and `29343` are opened automatically. Add any extra app ports you need.
{% endstep %}

{% step %}
**Launch the VM**

* Click **`Launch your SecretVM`**
* The first BYO deployment usually takes **5–7 minutes**
* The VM is created in your GCP project
{% endstep %}
{% endstepper %}

## Default open ports

| Port  | Usage                        |
| ----- | ---------------------------- |
| 80    | HTTP                         |
| 443   | HTTPS                        |
| 29343 | SecretVM attestation service |
