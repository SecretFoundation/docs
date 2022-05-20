# Environment Preperation

1. You will need to create new users for running Prometheus securely. This can be done by doing:

```
sudo useradd --no-create-home --shell /usr/sbin/nologin prometheus 
sudo useradd --no-create-home --shell /bin/false node_exporter
```

1. Create the directories for storing the Prometheus binaries and its config files:

```
sudo mkdir /etc/prometheus 
sudo mkdir /var/lib/prometheus
```

1. Set the ownership of these directories to our `prometheus` user, to make sure that Prometheus can access to these folders:

```
sudo chown prometheus:prometheus /etc/prometheus 
sudo chown prometheus:prometheus /var/lib/prometheus
```
