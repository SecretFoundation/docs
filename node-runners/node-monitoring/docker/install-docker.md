# Install Docker

### Preparing Your Environment <a href="#preparing-your-environment" id="preparing-your-environment"></a>

* You will need to install docker and docker-compose.
* The following instructions assume Ubuntu 20.04 on an x86-64 CPU.

## Install Docker <a href="#install-docker" id="install-docker"></a>

```
$ docker-compose --version
```

Test the installation:

```
$ sudo chmod +x /usr/local/bin/docker-compose
```

Apply executable permissions to the binary:

```
$ sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

Download the current stable release of Docker Compose:

### Install Docker Compose <a href="#install-docker-compose" id="install-docker-compose"></a>

```
$ sudo docker run hello-world
```

Test the installation:

```
$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io
```

Install docker:

```
$ echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Setup the docker stable repository:

```
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

Add Docker’s official GPG key:

```
 $ sudo apt-get update
 $ sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
```

Update the apt package index and install packages to allow apt to use a repository over HTTPS:

```
$ sudo apt-get remove docker docker-engine docker.io containerd runc
```
