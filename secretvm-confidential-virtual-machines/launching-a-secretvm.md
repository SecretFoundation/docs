---
hidden: true
---

# 🏁 Launching a SecretVM

## Using SecretAI Portal

You can easily create and deploy a Confidential Virtual Machine using the [Secret AI Dev Portal](https://preview-aidev.scrtlabs.com/). Follow the steps below to get started:

{% stepper %}
{% step %}
#### Log In

* Visit the portal: [https://preview-aidev.scrtlabs.com](https://preview-aidev.scrtlabs.com)
* Sign in with your GitHub, email, or preferred authentication method.
{% endstep %}

{% step %}
**Create a New SecretVM**

* In the left sidebar, navigate to **`SecretVMs`**.
* Click the **`Create New SecretVM`** button.

<figure><img src="../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
**Configure Your Machine**

* **Select a Template**\
  Choose a pre-configured template that best fits your use case (e.g. LLM Inference, Web Server, Data Processing).
* **Upload Docker Compose File**\
  Upload your custom `docker-compose.yaml` that defines the container workload.
* **Set Secret Environment Variables (Optional)**\
  Add environment variables that will be stored securely and injected into your container at runtime.
{% endstep %}

{% step %}
**Launch the VM**

* Click **`Launch VM`** to spin up your Confidential Virtual Machine.
* Your SecretVM will begin provisioning, and you'll be able to monitor its status and access attestation endpoints once it's live.
{% endstep %}

{% step %}

{% endstep %}
{% endstepper %}

## Using SecretAI CLI

Coming soon
