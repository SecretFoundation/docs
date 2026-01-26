---
description: How to launch a SecretVM under a custom domain name
---

# 🚩 Using Custom Domain Names

When a SecretVM is created, a random fully qualified domain name (FQDN) is created for it. A subdomain of one of the domains that belongs to the Portal, such as `secretvm.com`, is used, so the resulting domain name would look something like this: `tomato-dolphin.secretvm.com`

It is also possible to launch SecretVM with a custom domain name under a domain managed by the develoloper.

Do do that, it is required to specify the domain name in Custom Domain box:

<figure><img src="../../.gitbook/assets/image (5) (1).png" alt=""><figcaption></figcaption></figure>

After Launch Your SecretVM is clicked, the machine will be created, but not yet launched.

Go to the Network tab to find the IP address that was assigned to the new machine, and then configure your DNS to point the chosen FQDN to that IP.

<figure><img src="../../.gitbook/assets/image (1) (1) (1) (1).png" alt=""><figcaption></figcaption></figure>

Once the DNS records are created and sufficiently propagated, launch the SecretVM.

#### CNAME record for ZeroSSL Certificate

After the VM starts, you will need to create an additional DNS record under your domain - this is required by ZeroSSL to validate ownership of the domain before issuing a new DNS certificate.

Go to the Logs tab of the machine, and search for "CNAME Challenge":<br>

<figure><img src="../../.gitbook/assets/image (2) (1) (1).png" alt=""><figcaption></figcaption></figure>

Copy the <mark style="color:red;">name</mark> of the record and the expected <mark style="color:green;">value</mark>, and create a respective record under your DNS. ZeroSSL script will continue retrying multiple times until it can read the expected record.

Once the script identifies the required DNS record, it will generate the SSL certificate and continue with the startup routine.



&#x20;
