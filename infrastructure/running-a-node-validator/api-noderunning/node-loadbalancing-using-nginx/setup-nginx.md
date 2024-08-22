# Setup Nginx

### **Login and User Setup**

1. **SSH into Your Machine**: Use an SSH client to log into your server.

```bash
ssh your_user@your_server_ip
```

### **Update System Packages**

Frist, ensure that all packages are up to date. This can prevent security vulnerabilities.

```bash
sudo apt update && sudo apt upgrade && sudo apt autoremove
```

### **Install Monitoring and Web Server Tools**

1. **Install Glances**: An advanced system monitor for Linux.

```bash
sudo apt install glances
```

2. **Install Nginx**: A high-performance web server and a reverse proxy, often used for load balancing.

```bash
sudo apt install nginx
```

3. **Configure UFW Firewall for Nginx**: Make sure Nginx can receive HTTP and HTTPS traffic.

```bash
sudo ufw allow 'Nginx HTTP' 
sudo ufw allow 'Nginx HTTPS'
```

### **Set Up Nginx Configuration**

1. **Remove Existing Nginx Configuration**:

```bash
sudo rm -rf /etc/nginx/nginx.conf
```

2. **Edit New Configuration**: Use a text editor like nano to create a new configuration file.

```bash
sudo nano /etc/nginx/nginx.conf
```

* Replace the contents with your load balancer configuration. You can use the [example-nginx-config.md](example-nginx-config.md "mention") as a starting point.
* Modify RPC/LCD/gRPC server entries and domain names as required.
* Save and exit the editor (`CTRL + X`, then `Y` to confirm, and `Enter` to save).

3. **Test Nginx Configuration**: Ensures your syntax is correct.

```bash
sudo nginx -t
```

4. **Enable and Start Nginx**: This will make sure Nginx starts on boot and starts running immediately.

```bash
sudo systemctl enable nginx sudo systemctl start nginx
```

### **Secure with SSL/HTTPS**

1. **Install Certbot**: This tool automates obtaining free SSL/TLS certificates from Let's Encrypt.

```bash
sudo apt-get install certbot python3-certbot-nginx
```

2. **Obtain the SSL Certificate for your domain**:

```bash
sudo certbot --nginx -d your_domain.com
```

3. Finally, you can add a cronjob to crontab to enable auto-newing of the certificates:

```bash
crontab -e
0 12 * * * /usr/bin/certbot renew --quiet
```
