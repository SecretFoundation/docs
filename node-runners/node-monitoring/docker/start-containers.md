# Start Containers

1. Start the contrainers deploying the monitoring stack (Grafana + Prometheus + Node Exporter):

```
$ docker-compose --profile monitor up -d
```

1. Login to Grafana at `http://your-ip:3000` with username `admin` and password `admin`

The containers will restart automatically after rebooting unless they are stopped manually.

\
