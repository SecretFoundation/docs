# Configuration

1. Clone the [node\_tooling repo](https://github.com/Xiphiar/node\_tooling) and decend into the monitoring folder:

```
$ git clone https://github.com/Xiphiar/node_tooling.git
$ cd ./node_tooling/monitoring
```

1. In the prometheus folder, modify cosmos.yaml, replace `NODE_IP` with the IP of your node. (If your node is on the docker host machine, use `172.17.0.1`)

```
$ nano ./prometheus/cosmos.yaml
```

1. Replace the default prometheus config with the modified cosmos.yaml

```
$ mv ./prometheus/prometheus.yml ./prometheus/prometheus.yml.orig
$ cp ./prometheus/cosmos.yaml ./prometheus/prometheus.yml
```
