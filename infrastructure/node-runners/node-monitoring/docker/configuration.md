# Configuration

Clone the [node\_tooling repo](https://github.com/Xiphiar/node\_tooling) and descend into the monitoring folder:

```bash
$ git clone https://github.com/Xiphiar/node_tooling.git
$ cd ./node_tooling/monitoring
```

In the Prometheus folder, modify cosmos.yaml, replace `NODE_IP` with the IP of your node. (If your node is on the docker host machine, use `172.17.0.1`)

```bash
$ nano ./prometheus/cosmos.yaml
```

Replace the default Prometheus config with the modified cosmos.yaml

```bash
$ mv ./prometheus/prometheus.yml ./prometheus/prometheus.yml.orig
$ cp ./prometheus/cosmos.yaml ./prometheus/prometheus.yml
```
