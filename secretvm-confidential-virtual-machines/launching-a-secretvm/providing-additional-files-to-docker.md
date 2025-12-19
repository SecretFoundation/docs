# 📂 Providing Additional Files to Docker

SecretVM lets you attach an optional .tar archive containing extra files your workload needs at runtime.

When provided, the archive is automatically unpacked into the ./usr/ directory inside your SecretVM environment.

<figure><img src="../../.gitbook/assets/image (3) (1).png" alt=""><figcaption></figcaption></figure>

These files become available to Docker Compose and can be mounted into your containers just like any local path.

#### How it works

1. Upload a .tar archive.
2. SecretVM extracts it into: `./usr/`
3. You can then reference any file inside that directory via standard Docker volume mounts.

Example:

`volumes:`

&#x20; `- ./usr/myfile:/app/myfile`

#### Typical Use Cases &#x20;

* Supplying config files or secrets that aren’t stored in the image
* Bundling auxiliary scripts or models
* Including static assets needed at runtime

\
This feature is optional and only needed for advanced workloads requiring external file bundles.
