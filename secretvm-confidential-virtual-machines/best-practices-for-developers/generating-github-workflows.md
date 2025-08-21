---
description: How to automatically create verifiable GitHub workflows
---

# 🤖 Generating Github Workflows

In order to simplify and standardize Github workflows, use the Projects feature on the Portal

{% stepper %}
{% step %}
### Connect your GitHub Account

<figure><img src="../../.gitbook/assets/image (41).png" alt=""><figcaption></figcaption></figure>


{% endstep %}

{% step %}
### Choose the Repository  and Branch

If your repository doesn't have a Dockerfile, the Portal will offer help to created one for you:

<figure><img src="../../.gitbook/assets/image (43).png" alt=""><figcaption></figcaption></figure>

If one or more Dockerfiles already exists, you wil be asked to pick the one you want to use and click Continue

<figure><img src="../../.gitbook/assets/image (42).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
### Review the Workflow file and set Ports

The system will generate a GitHub workflow file that will be run every time a new version tag is created in the repository. The Workflow will build a Docker Image for your project following the Dockerfile instructions, publish the resulting  image, and create a docker-compose-secretvm.yaml file properly referencing the newly built image by its hash, and with comments specifying the exact release tag and commit from which the image was built.

**IMPORTANT: make sure to configure the ports correctly so that the docker-compose-secretvm.yaml file is generated correctly**

<figure><img src="../../.gitbook/assets/image (44).png" alt=""><figcaption></figcaption></figure>

&#x20;
{% endstep %}

{% step %}
### Create a new Version Tag to start the Worflow&#x20;

Choose a version tag (e.g. v1.0.0) and click "Continue"

<figure><img src="../../.gitbook/assets/image (45).png" alt=""><figcaption></figcaption></figure>
{% endstep %}

{% step %}
### Wait for the Workflow to Finish, review results

<figure><img src="../../.gitbook/assets/image (46).png" alt=""><figcaption></figcaption></figure>


{% endstep %}

{% step %}
### Use docker-compose-secretvm.yaml

From now on, every time you create a new release of your project, the workflow will be executed, publishing a new Docker Image and updating your docker-compose-secretvm.yaml with the latest version. Make sure to pick docker-compose-secretvm.yaml from your project when creating new SecretVM instances.
{% endstep %}
{% endstepper %}
