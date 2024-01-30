# Example Nginx config

Here is an example `nginx.conf` for Loadbalancing on Nginx:

```nginx
user  www-data;
worker_processes  auto;#Relevant to handle as many connections as the server config could, is correlated  to number of cores in the CPU
                    #https://nginx.org/en/docs/ngx_core_module.html#worker_processes
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;#Relevant to handle as many connections as the server config could
                              #clients = worker_processes * worker_connections
}                             #https://nginx.org/en/docs/ngx_core_module.html#worker_connections

http {

    large_client_header_buffers 4 64k; 
    server_names_hash_bucket_size 128;

map $request_uri $short_uri {
    "~^(.{0,50})" $1;
    default       $request_uri;
}


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
                        '"$short_uri" $status $body_bytes_sent '
                        '"$http_referer" "$http_user_agent"';
                       
    access_log  /var/log/nginx/access.log  combined_log;

    limit_req_zone $binary_remote_addr zone=mylimit:1M rate=70r/s;
    limit_req zone=mylimit burst=9000 nodelay;
    #WSS compatibility config
    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }

    #Upstream group
    upstream rpc_stream_mainnet {
        least_conn; #Redirect requests to the server with least number of active connections
        server  XXX.XXX.XXX.XXX:26657 max_fails=1000 fail_timeout=30s; 
	server  XXX.XXX.XXX.XXX:26657 max_fails=1000 fail_timeout=30s;
	server  XXX.XXX.XXX.XXX:26657 max_fails=1000 fail_timeout=30s;

    }

    upstream grpc_stream_mainnet {
        least_conn; #Redirect requests to the server with least number of active connections
        server  XXX.XXX.XXX.XXX:9091 max_fails=1000 fail_timeout=30s; 
	server  XXX.XXX.XXX.XXX:9091 max_fails=1000 fail_timeout=30s;
        server  XXX.XXX.XXX.XXX:9091 max_fails=1000 fail_timeout=30s;

    }

    upstream lcd_stream_mainnet {
        least_conn; #Redirect requests to the server with least number of active connections
        server  XXX.XXX.XXX.XXX:1317 max_fails=1000 fail_timeout=30s; 
	server  XXX.XXX.XXX.XXX:1317 max_fails=1000 fail_timeout=30s;
        server  XXX.XXX.XXX.XXX:1317 max_fails=1000 fail_timeout=30s;
    }

    
   server {
        listen 80;
        server_name rpc.YOUR_URL;

        location / {
            if ($request_method = 'OPTIONS') {
                return 204;
            }

            add_header 'Access-Control-Allow-Origin' "$http_origin" always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Headers' * always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            proxy_pass       http://rpc_stream_mainnet;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Upgrade $http_upgrade; #WSS compatibility config
            proxy_set_header Connection $connection_upgrade; #WSS compatibility config
        }



}


   server {
        listen 26657;
        server_name rpc.YOUR_URL;

        location / {
            if ($request_method = 'OPTIONS') {
                return 204;
            }

            add_header 'Access-Control-Allow-Origin' "$http_origin" always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Headers' * always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';

            proxy_pass       http://rpc_stream_mainnet;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Upgrade $http_upgrade; #WSS compatibility config
            proxy_set_header Connection $connection_upgrade; #WSS compatibility config
        }
    }



    server {
        listen 80;
        server_name grpc.YOUR_URL;

        location / {
            if ($request_method = 'OPTIONS') {
                return 204;
            }

            add_header 'Access-Control-Allow-Origin' "$http_origin" always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Headers' * always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            
            proxy_pass       http://grpc_stream_mainnet;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Upgrade $http_upgrade; #WSS compatibility config
            proxy_set_header Connection $connection_upgrade; #WSS compatibility config
        }
    

}

    server {
        listen 9091;
        server_name grpc.YOUR_URL;

        location / {
            if ($request_method = 'OPTIONS') {
                return 204;
            }

            add_header 'Access-Control-Allow-Origin' "$http_origin" always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Headers' * always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            
            proxy_pass       http://grpc_stream_mainnet;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Upgrade $http_upgrade; #WSS compatibility config
            proxy_set_header Connection $connection_upgrade; #WSS compatibility config
        }
    }

server {
        listen 1317;
        server_name lcd.YOUR_URL;
        location / {
            if ($request_method = 'OPTIONS') {
                return 204;
            }


	    proxy_hide_header 'Access-Control-Allow-Origin';
	    proxy_hide_header 'Access-Control-Allow-Credentials';
	    proxy_hide_header 'Access-Control-Allow-Headers';
	    proxy_hide_header 'Access-Control-Allow-Methods'; 

            add_header 'Access-Control-Allow-Origin' * always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Headers' * always;
            add_header 'Access-Control-Allow-Methods' * always;

            proxy_pass       http://lcd_stream_mainnet;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Upgrade $http_upgrade; #WSS compatibility config
            proxy_set_header Connection $connection_upgrade; #WSS compatibility config
        }

   
}

    server {
        listen 80;
        server_name lcd.YOUR_URL;
        location / {

            if ($request_method = 'OPTIONS') {
                return 204;
            }

	    proxy_hide_header 'Access-Control-Allow-Origin';
            proxy_hide_header 'Access-Control-Allow-Credentials';
            proxy_hide_header 'Access-Control-Allow-Headers';
            proxy_hide_header 'Access-Control-Allow-Methods'; 

            add_header 'Access-Control-Allow-Origin' * always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Allow-Headers' * always;
            add_header 'Access-Control-Allow-Methods' * always;


            proxy_pass       http://lcd_stream_mainnet;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Upgrade $http_upgrade; #WSS compatibility config
            proxy_set_header Connection $connection_upgrade; #WSS compatibility config
        }
    }


    server {
        listen 127.0.0.1:80;
        server_name 127.0.0.1;
        location /nginx_status {
            stub_status on;
            allow 127.0.0.1;
            deny all;
        }
    }

}
```

