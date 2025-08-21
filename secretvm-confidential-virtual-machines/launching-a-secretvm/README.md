# 🏁 Launching a SecretVM

## Using SecretAI Portal

You can easily create and deploy a Confidential Virtual Machine using the [Secret AI Dev Portal](https://secretai.scrtlabs.com/). Follow the steps below to get started:

{% stepper %}
{% step %}
#### Log In

* Visit the portal: [https://secretai.scrtlabs.com](https://secretai.scrtlabs.com/)
* Sign in with your wallet or your Google account
{% endstep %}

{% step %}
**Create a New SecretVM**

* In the left sidebar, navigate to **`SecretVMs`**.
* Click the **`Create New SecretVM`** button.

<figure><img src="../../.gitbook/assets/image (2) (1) (1).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
**Configure Your Machine**

* **Select VM Type**\
  Choose from one of the available VM sizes

<figure><img src="../../.gitbook/assets/image (24).png" alt=""><figcaption></figcaption></figure>

* **Select your environment**\
  Development environment can be accessed from the outside (via serial console or ssh). Also it has some development tools installed (e.g. `git`).

<figure><img src="../../.gitbook/assets/image (1) (2).png" alt=""><figcaption></figcaption></figure>

* **Upload Docker Compose File**\
  Upload your custom `docker-compose.yaml` that defines the container workload
* **Set Secret Environment Variables (Optional)**\
  Add environment variables that will be stored securely and injected into your container at runtime
{% endstep %}

{% step %}
**Launch the VM**

* Click **`Launch your SecretVM`** to spin up your Confidential Virtual Machine.
* Your SecretVM will begin provisioning, and you'll be able to monitor its status and access attestation endpoints once it's live.
{% endstep %}
{% endstepper %}

## Using SecretAI CLI

See [SecretVM CLI](../secretvm-cli/) for information on how to launch and manage SecretVM through command line interface
