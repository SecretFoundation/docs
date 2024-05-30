# Setup Goaccess

### **Editing Nginx Configuration**

Configure Nginx to format logs and set up a server block.

1. Open the Nginx configuration file:

```bash
sudo nano /etc/nginx/nginx.conf 
```

2. Add the following log format into your http group in nginx:

```nginx
http {  
    log_format combined_log '$remote_addr - $remote_user [$time_local] '
                   '"$request" $status $body_bytes_sent '
                   '"$http_referer" "$http_user_agent"';
    # ... (rest of the configuration)
}
```

{% hint style="warning" %}
**Warning:** This logs the users IP address directly. It's not recommended to do it in this fashion, if possible anonymize the address as seen below.
{% endhint %}

3. (optional) Instead anonymize IP addresses in logs:

```nginx
http {
    map $remote_addr $anonymized_addr {
                ~(?P<ip>\d+\.\d+)\.\d+\.    $ip.0.0;
                ~(?P<ip>[^:]+:[^:]+):       $ip::;
                # IP addresses to not anonymize (such as your server)
                127.0.0.1                   $remote_addr;
                ::1                         $remote_addr;
                #w.x.y.z                    $remote_addr;
                #a::c:d::e:f                $remote_addr;
                default                     0.0.0.0;
    }
    
    log_format combined_log '$anonymized_addr - $remote_user [$time_local] '
                       '"$request" $status $body_bytes_sent '
                       '"$http_referer" "$http_user_agent"';
                       
    access_log  /var/log/nginx/access.log  combined_log;
    
    # ... (rest of the configuration)
}
```

4. Configure a server block:

```nginx
server {
    listen 80;
    server_name yourdomain.com;  # Replace with your domain

    root /var/www/html;
    index report.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

### **Testing and Reloading Nginx Configuration**

1. Test the new configuration:

```bash
sudo nginx -t
```

2. Reload Nginx to apply changes:

```bash
sudo systemctl reload nginx
```

### **Configuring Log Rotation**

Log rotation in Nginx is a process for managing log files to prevent them from becoming excessively large and consuming too much disk space. As Nginx continuously logs web requests, these files can grow rapidly. Without rotation, they can lead to performance issues and make log analysis more difficult. The default setting is for log rotation is daily, which means that the logs that goaccess can use for its reporting are also only daily. To increase that timeframe, do the following:

1. Edit log rotation configuration:

```bash
sudo nano /etc/logrotate.d/nginx
```

2. Add the configuration, please change the monthly to daily or weekly if you need daily or weekly rotation of the logs.

```bash
/var/log/nginx/*.log {
        monthly
        missingok
        rotate 1
        compress
        delaycompress
        notifempty
        create 0640 www-data adm
        sharedscripts
        prerotate
                if [ -d /etc/logrotate.d/httpd-prerotate ]; then \
                        run-parts /etc/logrotate.d/httpd-prerotate; \
                fi \
        endscript
        postrotate
                invoke-rc.d nginx rotate >/dev/null 2>&1
        endscript
}
```

3. Apply the new rotation configuration:

```bash
sudo logrotate -f /etc/logrotate.d/nginx
```

### **Setting Up GoAccess for Web Traffic Monitoring**

1. Generate a HTML report:&#x20;

```bash
sudo goaccess /var/log/nginx/access.log -o /var/www/html/report.html --log-format=COMBINED
```

If you wish to automate this, use crontab to generate recurring reports:

2. Open crontab for editing (use sudo, otherwise crontab will not access to the log file):

```bash
sudo crontab -e
```

3. Add the line to automate hourly report generation:

```bash
0 * * * * goaccess /var/log/nginx/access.log -o /var/www/html/report.html --log-format=COMBINED
```

