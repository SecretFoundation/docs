# Grafana Dashboard

The dashboard for Cosmos SDK nodes is pre-installed, to use it:

Enable Tendermint metrics in your secret-node

```
sed -i 's/prometheus = false/prometheus = true/g' <YOUR-NODE-HOMEDIR>/config/config.toml
```

After restarting your node, you should be able to access the Tendermint metrics (default port is 26660): [http://localhost:26660](http://localhost:26660/)

**If you did not replace `NODE_IP` with the IP of your node in the Prometheus config**, do so now. If your node is on the docker host machine, use `172.17.0.1`

```
$ nano ./prometheus/prometheus.yml
$ docker-compose down
$ docker-compose --profile monitor up -d
```

1. Login to Grafana and open the Cosmos Dashboard from the [Manage Dashboards](http://localhost:3000/dashboards) page.
2. Set the chain-id to `secret-3`
