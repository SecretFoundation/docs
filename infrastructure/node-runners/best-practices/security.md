# Server security

To add basic security to your node, we've provided a guide covering 2 simple tools.

* Uncomplicated Firewall (UFW)
* Key-based SSH authentication.

## &#x20;<a href="#setup-a-basic-firewall-with-ufw" id="setup-a-basic-firewall-with-ufw"></a>

## &#x20;<a href="#key-based-ssh-authentication" id="key-based-ssh-authentication"></a>

## Raising The Security Floor Of The Cosmos Ecosystem

Within the #Cosmos, conversations around node security tend to start with whether or not you use backup servers, sentries, and a remote-signing key management solution. This does not see the forest for the trees. While those steps are certainly important, they are \*final\* security steps. We should instead be discussing the first steps you make when setting up a new Tendermint node; raise the floor of security, rather than the ceiling, if you will.

{% hint style="info" %}
**This is intended to be a very basic guide on Linux security practices. If you want to more in-depth information,** [**you can read about it here.**](https://github.com/imthenachoman/How-To-Secure-A-Linux-Server)
{% endhint %}

The following topics will be covered:\
1\. **SSH Key Setup**

2\. **Server Configuration**

3\. **Setting up a Basic Firewall**

**4. Using Local CLI Machinesbas**

When you receive your server, you will be provided a root user login, and a password. You’ll be inclined to log in with that login and password, but we have steps before we do that! We first want to create out ssh key as we’ll be disabling password login shortly.

### SSH Key Setup

#### **Create SSH Key**

An SSH (Secure Shell) key is a way to identify yourself as a user without using a password. It has 2 parts: the pubkey and private key. When you create the SSH key, you give your pubkey to a computer you wish to log into. You can then “show” the server your private key and it will admit you automatically. This makes it far more secure than a password, as then only you will have access to the server via your key.

This document assumes you’re using a Mac. If you need instructions for Linux or Windows, see the [Github instruction for generating an SSH key.](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

1. Open Terminal
2. Generate the SSH key:

```bash
$ ssh-keygen -t ed25519 -C “your_email@example.com”
```

![](https://cdn-images-1.medium.com/max/1600/1\*o9AlJ9J0bCCGokhQ3se5QQ.png)Generate SSH key

3\. When you’re prompted to “Enter a file in which to save the key,” press Enter. This accepts the default file location.

4\. At the prompt, type a secure passphrase. For more information, see [“Working with SSH key passphrases](https://docs.github.com/en/articles/working-with-ssh-key-passphrases).”

```bash
> Enter passphrase (empty for no passphrase): [Type a passphrase]> Enter same passphrase again: [Type passphrase again]
```

Your SSH key is now created, but we have to add it to the agent for it to be usable.

#### **Adding your SSH key to the ssh-agent**

1. Start the ssh-agent in the background

```bash
$ eval "$(ssh-agent -s)"> Agent pid 59566
```

2\. Open your SSH config file

```bash
$ open ~/.ssh/config
```

![](https://cdn-images-1.medium.com/max/1600/1\*lzrlsw-n64g9u-yLRxw6gg.png)Open \~/.ssh/config

3\. Add the following text block to your file

```bash
Host *  AddKeysToAgent yes  UseKeychain yes  IdentityFile ~/.ssh/id_ed25519
```

4\. Add your SSH key to the ssh-agent

```bash
$ ssh-add -K ~/.ssh/id_ed25519
```

Your SSH key is now set up! This only has to happen once, so you can skip this if you need to refer back to this document.

##

## Setting Up A Basic Firewall

Uncomplicated Firewall (UFW) is a program for managing a netfilter firewall designed for easy use. It uses a command-line interface (CLI) with a small number of simple commands and is configured with [iptables](https://en.wikipedia.org/wiki/Iptables). UFW is available by default in all Ubuntu installations after 18.04 LTS, and features tools for intrusion prevention which we will cover in this guide.

1. Start by checking the status of UFW.

```bash
$ sudo ufw status
```

![](https://cdn-images-1.medium.com/max/1600/1\*RwlFFEpe\_nEB8365W8n17Q.png)Check UFW status

2\. Enable SSH

```bash
$ sudo ufw allow ssh/tcp
```

3\. Enable p2p

This is the default p2p port for Tendermint systems, but if you’ve changed the port, you’ll need to update the ufw setting.

```
$ sudo ufw allow 26656
```

4\. Enable UFW

```bash
$ sudo ufw enable
```

5\. Confirm UFW is enabled

```bash
$ sudo ufw status
```

![](https://cdn-images-1.medium.com/max/1600/1\*goWe3WgqWXX831OwfZIhRw.png)Confirm UFW is enabled

Note that at any time you can disable ufw by doing:

```bash
$ sudo ufw disable
```

##
