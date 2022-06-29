# Configuring Prometheus

Prior to using Prometheus, it needs basic configuring. Thus, we need to create a configuration file named `prometheus.yml`

**Note:** The configuration file of Prometheus is written in [YAML](http://www.yaml.org/start.html) which strictly forbids to use tabs. If your file is incorrectly formatted, Prometheus will not start. Be careful when you edit it.

1. Open the file `prometheus.yml` in a text editor:

```
sudo nano /etc/prometheus/prometheus.yml
```

Prometheus’ configuration file is divided into three parts: `global`, `rule_files`, and `scrape_configs`.

In the `global` part we can find the general configuration of Prometheus: `scrape_interval` defines how often Prometheus scrapes targets, `evaluation_interval` controls how often the software will evaluate rules. Rules are used to create new time series and for the generation of alerts.

The `rule_files` block contains information of the location of any rules we want the Prometheus server to load.

The last block of the configuration file is named `scape_configs` and contains the information which resources Prometheus monitors.

Our file should look like this example:

```
global:  
  scrape_interval:     15s  
  evaluation_interval: 15s
  
rule_files:
  # - "first.rules"  
  # - "second.rules"
  
scrape_configs:  
  - job_name: 'prometheus'    
    scrape_interval: 5s    
	static_configs:      
	  - targets: ['localhost:9090']
```

The global `scrape_interval` is set to 15 seconds which is enough for most use cases.

We do not have any `rule_files` yet, so the lines are commented out and start with a `#`.

In the `scrape_configs` part we have defined our first exporter. It is Prometheus that monitors itself. As we want to have more precise information about the state of our Prometheus server we reduced the `scrape_interval` to 5 seconds for this job. The parameters `static_configs`and `targets` determine where the exporters are running. In our case it is the same server, so we use `localhost` and the port `9090`.

As Prometheus scrapes only exporters that are defined in the `scrape_configs` part of the configuration file, we have to add Node Exporter to the file, as we did for Prometheus itself.

We add the following part below the configuration for scraping Prometheus:

```
- job_name: 'node_exporter'  
  scrape_interval: 5s  
  static_configs:    
    - targets: ['localhost:9100']
```

Overwrite the global scrape interval again and set it to 5 seconds. As we are scarping the data from the same server as Prometheus is running on, we can use `localhost` with the default port of Node Exporter: `9100`.

If you want to scrape data from a remote host, you have to replace `localhost` with the IP address of the remote server.

**Tip:** For all information about the configuration of Prometheus, you may check the [configuration documentation](https://prometheus.io/docs/prometheus/latest/configuration/configuration/).

1. Set the ownership of the file to our `Prometheus` user:

```
sudo chown prometheus:prometheus /etc/prometheus/prometheus.yml
```

Our Prometheus server is ready to run for the first time.

### Running Prometheus <a href="#running-prometheus" id="running-prometheus"></a>

1. Start Prometheus directly from the command line with the following command, which executes the binary file as our `Prometheus` user:

```
sudo -u prometheus /usr/local/bin/prometheus --config.file /etc/prometheus/prometheus.yml --storage.tsdb.path /var/lib/prometheus/ --web.console.templates=/etc/prometheus/consoles --web.console.libraries=/etc/prometheus/console_libraries
```

The server starts displaying multiple status messages and the information that the server has started:

```
level=info ts=2018-04-12T11:56:53.084000977Z caller=main.go:220 msg="Starting Prometheus" version="(version=2.2.1, branch=HEAD, revision=bc6058c81272a8d938c05e75607371284236aadc)"
level=info ts=2018-04-12T11:56:53.084463975Z caller=main.go:221 build_context="(go=go1.10, user=root@149e5b3f0829, date=20180314-14:15:45)"
level=info ts=2018-04-12T11:56:53.084632256Z caller=main.go:222 host_details="(Linux 4.4.127-mainline-rev1 #1 SMP Sun Apr 8 10:38:32 UTC 2018 x86_64 scw-041406 (none))"
level=info ts=2018-04-12T11:56:53.084797692Z caller=main.go:223 fd_limits="(soft=1024, hard=65536)"
level=info ts=2018-04-12T11:56:53.09190775Z caller=web.go:382 component=web msg="Start listening for connections" address=0.0.0.0:9090
level=info ts=2018-04-12T11:56:53.091908126Z caller=main.go:504 msg="Starting TSDB ..."
level=info ts=2018-04-12T11:56:53.102833743Z caller=main.go:514 msg="TSDB started"
level=info ts=2018-04-12T11:56:53.103343144Z caller=main.go:588 msg="Loading configuration file" filename=/etc/prometheus/prometheus.yml
level=info ts=2018-04-12T11:56:53.104047346Z caller=main.go:491 msg="Server is ready to receive web requests."
```

1.  Open your browser and type `http://IP.OF.YOUR.SERVER:9090` to access the Prometheus interface. If everything is working, we end the task by pressing on `CTRL + C` on our keyboard.

    **Note:** If you get an error message when you start the server, double check your configuration file for possible YAML syntax errors. The error message will tell you what to check.
2. The server is working now, but it cannot yet be launched automatically at boot. To achieve this, we have to create a new `systemd` configuration file that will tell your OS which services should it launch automatically during the boot process.

```
sudo nano /etc/systemd/system/prometheus.service
```

The service file tells `systemd` to run Prometheus as `prometheus` and specifies the path of the configuration files.

1. Copy the following information in the file and save it, then exit the editor:

```
[Unit]
Description=Prometheus Monitoring
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
--config.file /etc/prometheus/prometheus.yml \
--storage.tsdb.path /var/lib/prometheus/ \
--web.console.templates=/etc/prometheus/consoles \
--web.console.libraries=/etc/prometheus/console_libraries
ExecReload=/bin/kill -HUP $MAINPID

[Install]
WantedBy=multi-user.target
```

1. To use the new service, reload `systemd`:

```
sudo systemctl daemon-reload
```

We enable the service so that it will be loaded automatically during boot:

```
sudo systemctl enable prometheus
```

1. Start Prometheus:

```
sudo systemctl start prometheus
```

Your Prometheus server is ready to be used.

We have now installed Prometheus to monitor your instance. Prometheus provides a basic web server running on `http://your.server.ip:9000` that provide access to the data collected by the software.
