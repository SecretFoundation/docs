# Grafana Dashboard



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

### [#](https://docs.scrt.network/node-guides/monitoring-manual-install.html#installing-cosmos-sdk-grafana-dashboard)Installing Cosmos SDK Grafana Dashboard <a href="#installing-cosmos-sdk-grafana-dashboard" id="installing-cosmos-sdk-grafana-dashboard"></a>

Finally, we're going to install a basic dashboard for Cosmos SDKs. For further reference in these steps, see: https://github.com/zhangyelong/cosmos-dashboard

1. Enable Tendermint metrics

```
sed -i 's/prometheus = false/prometheus = true/g' <YOUR-NODE-HOMEDIR>/config/config.toml
```

After restarting your node, you should be able to access the tendermint metrics(default port is 26660): [http://localhost:26660](http://localhost:26660/)

1. Configure Prometheus Targets

Append a `job` under the `scrape_configs` of your prometheus.yml

```
  - job_name: secret-network
	static_configs:
	- targets: ['<Validator-IP>:26660']
	  labels:
		instance: validator
	- targets: ['<Sentry-0-IP>:26660']
	  labels:
		instance: sentry-0
	- targets: ['<Sentry-1-IP>:26660']
	  labels:
		instance: sentry-1
```

1. Reload prometheus config

```
curl -X POST http://<PROMETHEUS-IP>:9090/-/reload
```

1. Import Grafana Dashboard

Copy and paste the [Grafana Dashboard ID](https://grafana.com/grafana/dashboards/11036) `11036` OR content of [cosmos-dashboard.json](https://github.com/zhangyelong/cosmos-dashboard/blob/master/cosmos-dashboard.json), click on `Load` to complete importing.

1. Set chain-id to `secret-3`
2. You're done!

## [#](https://docs.scrt.network/node-guides/monitoring-manual-install.html#next-steps) <a href="#next-steps" id="next-steps"></a>

\
