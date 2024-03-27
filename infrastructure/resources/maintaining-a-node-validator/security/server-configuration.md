# Server configuration

## Server Configuration

In this section we will cover:

1. **Logging In**
2. **Creating a new user**
3. **Disable root login**
4. **Disable password login**

### **Logging in**

When you provision a new server, you will be provided a username, password, and ip address. Generally that username will be **root**. Let’s log in with them now in the form of `ssh username@ip` .

1. Initiate login to server

![](https://cdn-images-1.medium.com/max/1600/1\*A63\_z3J2PhKBCTBwqMQklQ.png)SSH into the server

2\. Type `Yes`

3\. Enter password

![](https://cdn-images-1.medium.com/max/1600/1\*sVRGmmsEhrfKhjsorOalsw.png)Logged into root

You are now logged into root. However, we do **NOT** want this as an option, so let’s fix it.

### **Create New User**

Since we no longer want to be able to log in as root, we’ll first need to create a new user to log into.

1. Create a new user

You’re going to want to choose a unique username here, as the more unique, the harder it’ll be for a bad actor to guess. We’re going to use `mellamo` .

```bash
$ adduser mellamo
```

![](https://cdn-images-1.medium.com/max/1600/1\*mSdweTS6WSZjtQLmmWJPsg.png)Create user mellamo

You will then be prompted to create a password and fill in information. Don’t worry about the information, but make sure your password is complicated!

2\. Give them sudo privileges

sudo is the name for “master” privileges, so we need to modify the user to add them to that group.

```bash
$ usermod mellamo -aG sudo
```

3\. Verify user has sudo access

```bash
$ su - mellamo$ sudo ls /root
```

![](https://cdn-images-1.medium.com/max/1600/1\*sRoT2ecQugMrvX8iA3Q\_OA.png)Testing sudo privileges

### **Disable Root Login**

Disabling root login takes away an easy method for hackers to get in. The easiest way of accessing remote servers or VPSs is via SSH and to block root user login under it, you need to edit the **/etc/ssh/sshd\_config** file.

1. From the remote server, open /etc/ssh/sshd\_config

```bash
$ sudo nano /etc/ssh/sshd_config
```

![](https://cdn-images-1.medium.com/max/1600/0\*esAbd\_PEd0Y0T4QY.png)Set PermitRootLogin to “no”

2\. Save and exit sshd\_config, then restart the service.

```bash
$ sudo systemctl restart sshd
```

### **Copy SSH key**

1. Return to you local machine.

```bash
$ exit
```

![](https://cdn-images-1.medium.com/max/1600/1\*6VYxLX8A3qRTN7HXdAn2ew.png)Log out of server

2\. Copy your ssh key to the server

```bash
$ ssh-copy-id mellamo@{ip address}
```

![](https://cdn-images-1.medium.com/max/1600/1\*-Xh5exfIRi0EakScu\_KNcA.png)Copy keys

3\. Confirm you can login with just your SSH key

```bash
$ ssh mellamo@104.149.129.250
```

![](https://cdn-images-1.medium.com/max/1600/1\*k8NnrH0mXhX\_E5OImuSyIg.png)Log in with SSH key

Done! You can now log in exclusively with your SSH key.

### **Disable Password Login**

Now that you can log in with just your ssh key, you should now disable password login.

1. Return to your remote server, and open /etc/ssh/sshd\_config again

```bash
$ sudo nano /etc/ssh/sshd_config
```

2\. Find ChallengeResponseAuthentication and set to no:

```
bbChallengeResponseAuthentication no
```

3\. Next, find PasswordAuthentication set to no too:

```
PasswordAuthentication no
```

4\. Search for UsePAM and set to no, too:

```markup
UsePAM no
```

5\. Save and exit sshd\_config, then restart the service.

```bash
$ sudo systemctl restart sshd
```

Congratulations! You can only login with your ssh key now. **Be sure to back it up in case something happens to your machine!**
