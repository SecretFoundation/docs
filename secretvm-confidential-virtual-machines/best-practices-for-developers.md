---
description: How to create verifiable workloads
---

# 💡 Best Practices for Developers

SecretVM offers develpers a robust way to run their application in a privacy-preserving and verifiable state.

SecretVM's attestation creates a chain of trust that is rooted in the provably genuine TEE hardware, and extends up to the `docker-compose.yaml` file that is deployed inside the SecretVM.

However, this is not enough - the end users need to be able to verify the actual provenance of the docker image specified in the `docker-compose` file and to examine its source code (assuming of course, that your source code is open - it would hardly be possible to trust it without that)

There are several ways to reach verifiability:

### Reproducible Builds

A reproducible build is a software compilation process that guarantees identical binary output regardless of when or where the build is performed.

To achieve reproducibility, several tools and techniques are commonly used.  Build systems such as Nix, Bazel, and Yocto offer solutions that are deterministic and highly configurable, making them especially useful in secure or embedded build pipelines. Pinning exact versions of compilers, dependencies, and timestamps is also crucial to eliminate sources of nondeterminism.

In the context of Docker containers, reproducible builds ensure that container images are consistent and verifiable across environments. Dockerfiles should be written carefully to avoid introducing nondeterminism—e.g., by avoiding apt-get update without pinning versions, using --no-cache, and ensuring fixed timestamps and layer order. Tools like buildkit, docker-slim, or frameworks such as Buildah and img can further enhance reproducibility.&#x20;

While reproducible builds offer the highest level of verifiability, they are often complex to develop and maintain, so we only recommend those to teams who have experience with those systems and tools.

### GitHub Actions (Recommended)

GitHub Actions allows you to automatically build a Docker container from a specific tagged version of your code by setting up a workflow that triggers on tag creation. In the .github/workflows directory of your repository, you define a YAML file specifying that the workflow should run when a new Git tag is pushed. The workflow will typically check out the repository at that tag, set up Docker, and then use a docker build command to create an image based on the code snapshot corresponding to the tag.

Inside the workflow file, the steps would usually include checking out the code (actions/checkout@v4), logging in to a container registry (like Docker Hub or GitHub Container Registry), building the image with a tag like yourimage:${GITHUB\_REF#refs/tags/}, and  pushing the image to the registry.&#x20;

By way of example, here's an action run building SecretNetwork's Localsecret container from a specific commit:

{% @github-files/github-code-block url="https://github.com/scrtlabs/SecretNetwork/actions/runs/14378183295" %}

In this Action run, the LocalSecret container in bult by the `publish-localsecret` job

{% @github-files/github-code-block url="https://github.com/scrtlabs/SecretNetwork/actions/runs/14378183295/job/40317611046" %}

The output container is shown in the log (see screenshot below).&#x20;

<figure><img src="../.gitbook/assets/image (23).png" alt=""><figcaption></figcaption></figure>

For best verifiability, we recommend specifying the exact version and sha256 value in the address of the image in your docker-compose.yaml file.&#x20;

Read more in GitHub documentation [here](https://docs.github.com/en/actions/sharing-automations/creating-actions/creating-a-docker-container-action).

> Note: GitLab and BitBucket have features that are equivalent to GitHub actions, please refer to the respective docs

Using GitHub Actions  or similar solutions from other code repositories assumes a certain level of trust in the operators of GitHub.
