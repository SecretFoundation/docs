# Grafana Dashboard

The dashboard for Cosmos SDK nodes is pre-installed, to use it:

1. Enable Tendermint metrics in your secret-node

```
sed -i 's/prometheus = false/prometheus = true/g' <YOUR-NODE-HOMEDIR>/config/config.toml
```

After restarting your node, you should be able to access the tendermint metrics(default port is 26660): [http://localhost:26660](http://localhost:26660/)

1. **(If you did not replace `NODE_IP` with the IP of your node in the prometheus config)**, do so now. (If your node is on the docker host machine, use `172.17.0.1`)

```
$ nano ./prometheus/prometheus.yml
$ docker-compose down
$ docker-compose --profile monitor up -d
```

1. Login to grafana and open the Cosmos Dashboard from the [Manage Dashboards](http://localhost:3000/dashboards) page.
2. Set the chain-id to `secret-3`

### [#](https://docs.scrt.network/node-guides/monitoring-docker.html#application-ports) <a href="#application-ports" id="application-ports"></a>

\
