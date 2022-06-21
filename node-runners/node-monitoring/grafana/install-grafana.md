# Install Grafana



1. Install Grafana on our instance which queries our Prometheus server.

```
wget https://s3-us-west-2.amazonaws.com/grafana-releases/release/grafana_8.1.4_amd64.deb
sudo apt-get install -y adduser libfontconfig
sudo dpkg -i grafana_8.1.4_amd64.deb
```

1. Enable the automatic start of Grafana by `systemd`:

```
sudo systemctl daemon-reload && sudo systemctl enable grafana-server && sudo systemctl start grafana-server
```

Grafana is running now, and we can connect to it at `http://your.server.ip:3000`. The default user and password is `admin` / `admin`.

Now you have to create a Prometheus data source: - Click the Grafana logo to open the sidebar. - Click “Data Sources” in the sidebar. - Choose “Add New”. - Select “Prometheus” as the data source. - Set the Prometheus server URL (in our case: http://localhost:9090/) - Click “Add” to test the connection and to save the new data source.

### [#](https://docs.scrt.network/node-guides/monitoring-manual-install.html#installing-cosmos-sdk-grafana-dashboard) <a href="#installing-cosmos-sdk-grafana-dashboard" id="installing-cosmos-sdk-grafana-dashboard"></a>

\
