# Install Prometheus

Download and Unpack [Prometheus](https://prometheus.io/download/) latest release of Prometheus:

```
sudo apt-get update && apt-get upgrade
wget https://github.com/prometheus/prometheus/releases/download/v2.30.0/prometheus-2.30.0.linux-amd64.tar.gztar xfz prometheus-_.tar.gzcd prometheus-_
```

The following two binaries are in the directory:

* Prometheus - Prometheus main binary file
* Promtool

The following two folders (which contain the web interface, configuration files examples and the license) are in the directory:

* Consoles
* Console\_libraries

Copy the binary files into the `/usr/local/bin/`directory:

```
sudo cp ./prometheus /usr/local/bin/
sudo cp ./promtool /usr/local/bin/
```

Set the ownership of these files to the `prometheus` user previously created:

```
sudo chown prometheus:prometheus /usr/local/bin/prometheus
sudo chown prometheus:prometheus /usr/local/bin/promtool
```

Copy the `consoles` and `console_libraries` directories to `/etc/prometheus`:

```
sudo cp -r ./consoles /etc/prometheus
sudo cp -r ./console_libraries /etc/prometheus
```

Set the ownership of the two folders, as well as of all files that they contain, to our `prometheus` user:

```
sudo chown -R prometheus:prometheus /etc/prometheus/consoles
sudo chown -R prometheus:prometheus /etc/prometheus/console_libraries
```

In our home folder, remove the source files that are not needed anymore:

```
cd .. && rm -rf prometheus-\*
```
