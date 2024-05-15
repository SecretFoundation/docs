# Application Ports

The docker images expose the following ports:

* `3000` Grafana. Your main dashboard. Default login is admin\admin.
* `9090` Prometheus. Access to this port should be restricted.
* `9100` Node Exporter. Access to this port should be restricted.
* Your secret node metrics on port `26660` should also be restricted.

If you followed the basic security guide, these ports are already restricted. You will need to allow the grafana port:

`sudo ufw allow 3000`

You can also allow access from a specific IP if desired:

`sudo ufw allow from 123.123.123.123 to any port 3000`
