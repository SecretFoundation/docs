# 🔐 Using Private Container Registries

In some cases, developers prefer to use private container repositories.

SecretVM offers support for this - just open the "Private Container Registry" panel, enter your repository URL and credentials.

<figure><img src="../../.gitbook/assets/image (6).png" alt=""><figcaption></figcaption></figure>

On startup, the SecretVM runtime will pass the information to the docker engine and it will be able to pull the images from this private repository
