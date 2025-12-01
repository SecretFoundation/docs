# 🪵 Log Forwarding

## Overview

SecretVM provides a built-in log forwarding feature that allows you to stream all system and Docker container logs directly to a log aggregator of your choice.

This feature uses Fluent Bit to collect and forward logs in a structured JSON format. It is designed to be compatible with any aggregator that accepts data over HTTP, such as VictoriaLogs, Loki, or Elasticsearch.

## How to Enable Log Forwarding

To enable log forwarding, you must add a set of environment variables to your main `.env` configuration file.

**Mandatory Variables**

These variables are required to enable the log forwarding service.

```bash
# The public hostname or IP address of your log aggregator
SECRET_VM_LFWD_HOST=your-aggregator.example.com

# The port your log aggregator is listening on
SECRET_VM_LFWD_PORT=8428
```

**Optional Variables**

These variables allow you to configure security (TLS and Basic Auth) and customize the destination URI.

```bash
# Set to 1 to enable TLS (HTTPS) for the connection.
# Default is disabled.
SECRET_VM_LFWD_TLS=1

# Specify a username for HTTP Basic Authentication.
SECRET_VM_LFWD_HTTP_USER=my-username

# Specify a password for HTTP Basic Authentication.
SECRET_VM_LFWD_HTTP_PASSWD=my-secret-password

# Modify the request URI for the log aggregator endpoint.
# This is useful if your aggregator expects a specific path.
# Default: /insert/jsonline?_stream_fields=stream&_msg_field=MESSAGE&_time_field=date
# Note: The default URI is pre-configured for compatibility with VictoriaLogs' 
# JSON line ingestion format. You generally do not need to change this 
# unless you are using a different aggregator with a specific endpoint requirement.
SECRET_VM_LFWD_URI=/my/custom/api/endpoint
```
