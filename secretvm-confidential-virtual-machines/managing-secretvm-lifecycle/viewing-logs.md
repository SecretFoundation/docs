---
description: How to view SecretVM Logs
---

# 🗒️ Viewing Logs

Logs are an invaluable source of information about the operation of any kind of software, and are widely used by developers to diagnose issues and monitor performance.

In SecretVM, logs can be accessed separately for each running container, and through 3 different modalities.

#### Accessing Logs through the Portal

Viewing Logs on the Portal is easy. Every VM offers a Logs tab, showing all the logs. The tabs on the left allow breaking the logs down by service (starting with secretvm runtime and all the running containers), plus the "All" tabs showing all the logs in chronological order.

<figure><img src="../../.gitbook/assets/image (2).png" alt=""><figcaption></figcaption></figure>

#### Accessing Logs through the REST endpoint

The logs can also be accessed through the https://\<machine URL>:29343/logs endpoint

The https://\<machine URL>:29343/services endpoint lists all the services running on a SecretVM, and the service name can be used on the /logs endpoint to filter the logs by a specific service, e.g.

&#x20;https://\<machine URL>:29343/logs?service=secretvm

#### Log Forwarding

See the [Log Forwarding](log-forwarding.md) documentation to learn how to forward the SecretVM logs to a 3rd party log aggregation service



