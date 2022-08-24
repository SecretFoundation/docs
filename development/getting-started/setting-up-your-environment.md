# Setting Up Your Environment

Secret Contracts are written using the CosmWasm framework. CosmWasm contracts are written in Rust, which is later compiled to WebAssembly (or WASM for short). To write our first Secret Contract, we need to set up a development environment with all the tools required.&#x20;

There are 3 main tools we will use -

* IDE - a development environment (usually VS Code or JetBrains CLion/IDEA with Rust support)
* SecretCLI - a command-line tool to interact with the blockchain
* LocalSecret - a local Secret Network chain set up for development purposes

Luckily for us, there are a few ways that can help us hit the ground running without working too hard.

### Gitpod Environment (Recommended)

This Gitpod environment contains everything you need to write and interact with your first Secret Network application. To get started, make sure you have a registered GitHub account, and [click here](https://gitpod.io/#https://github.com/scrtlabs/GitpodDevEnv), or visit the repo [https://github.com/scrtlabs/MillionaireProblemTutorial](https://github.com/scrtlabs/MillionaireProblemTutorial)&#x20;

If you chose this environment, you may skip ahead to [Compile and Deploy](compile-and-deploy.md), as SecretCLI and LocalSecret are already running and set up for you, and the example contract is included as well.

### JetBrains Dev Environment (Secret IDE)

The amazing folks at Digiline created a prebuilt containerized environment containing an IDE (IntelliJ IDEA) that contains everything you need to get started. If you're comfortable with JetBrains IDEs, this may be a good choice for you.&#x20;

To complement Secret IDE, we will set up another docker container with LocalSecret, where we will deploy our contracts to test and play around with.&#x20;

To get started, visit [https://github.com/digiline-io/Secret-IDE-Plugin](https://github.com/digiline-io/Secret-IDE-Plugin), or just go for it and run the IDE from docker:

`docker run -p 8888:8888 -it ghcr.io/digiline-io/secret-ide:0.0.8`

Then after a few seconds you will be able to access your in-browser IDE at [https://localhost:8888](https://localhost:8888).

Once the environment loads, clone our repository ("Get from VCS") from [https://github.com/scrtlabs/MillionaireProblemTutorial](https://github.com/scrtlabs/MillionaireProblemTutorial).

Secret IDE has built-in support for both the Pulsar testnet and mainnet, but for the purposes of this guide we will be using the SecretCLI via terminal. To go the graphical route, during the compile and deploy stages you can refer to the GitHub Repository above for instructions on how to work with the IDE. &#x20;

{% hint style="info" %}
Secret-IDE is also available as a plugin for IDEA, so you can just install it from the marketplace.
{% endhint %}

Lastly, it will be helpful to configure SecretCLI by using the included "Configure secretcli" command which will set up SecretCLI to target the public testnet

![](<../../.gitbook/assets/image (3).png>)

### Manual Install

#### Install Requirements

To follow along with the guide, we will be using `git` and `make`

{% tabs %}
{% tab title="Linux/WSL" %}
```bash
sudo apt-get install git make
```
{% endtab %}

{% tab title="MacOS" %}
Install `git`:

1. Download the latest [Git for Mac installer](https://sourceforge.net/projects/git-osx-installer/files/).
2. Follow the prompts to install Git.
3. Open a terminal and verify the installation was successful by typing `git --version`

Install `make`:



```bash
brew install make
```
{% endtab %}

{% tab title="Windows" %}
Install `git` (for Windows):&#x20;

1. Go to [https://git-scm.com/download/win](https://git-scm.com/download/win) and the download will start automatically. Note that this is a project called Git for Windows, which is separate from Git itself; for more information on it, go to [https://gitforwindows.org](https://gitforwindows.org/).

**Note:** support for **** `make` on Windows is pretty shit, so we'll provide separate commands for Windows where necessary
{% endtab %}
{% endtabs %}

#### Install Rust

{% tabs %}
{% tab title="Linux/WSL" %}
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
{% endtab %}

{% tab title="MacOS" %}
```bash
curl https://sh.rustup.rs -sSf | sh
```
{% endtab %}

{% tab title="Windows (PowerShell)" %}
Download and run [`rustup-init.exe`](https://static.rust-lang.org/rustup/dist/i686-pc-windows-gnu/rustup-init.exe).
{% endtab %}

{% tab title="Windows (GUI)" %}
Download and run [the Rust .msi installer ](https://static.rust-lang.org/dist/rust-1.62.1-aarch64-pc-windows-msvc.msi)
{% endtab %}
{% endtabs %}

#### Add WASM build target

```
rustup target add wasm32-unknown-unknown
```

{% hint style="warning" %}
**Having Trouble?** You might need to restart your terminal, or run a command like:&#x20;

_`source "$HOME/.cargo/env"`_

After installing Rust to configure the current shell
{% endhint %}

#### Clone the Getting Started Repo

```
git clone https://github.com/scrtlabs/MillionaireProblemTutorial.git
```

#### Install SecretCLI

SecretCLI is a command-line tool that helps us interact with the Secret Network blockchain. It is used to send and query data as well as manage user keys and wallets.

{% tabs %}
{% tab title="Linux" %}
```bash
curl https://github.com/scrtlabs/SecretNetwork/releases/download/v1.3.1/secretcli-Linux
chmod +x secretcli-Linux
sudo mv secretcli-Linux /usr/local/bin/secretcli
```
{% endtab %}

{% tab title="Windows (PowerShell)" %}
```powershell
wget -O secretcli-Windows.exe https://github.com/scrtlabs/SecretNetwork/releases/download/v1.3.1/secretcli-Windows
```

TODO: Add \`secretcli-Windows.exe\` to the PATH
{% endtab %}

{% tab title="MacOS (Intel)" %}
Download `secretcli` for your system [here](https://github.com/scrtlabs/SecretNetwork/releases/download/v1.3.1/secretcli-MacOS-arm64)

Set the file name to `secretcli` and set it as executable

```
mv secretcli-macOS secretcli
chmod 755 secretcli
```
{% endtab %}

{% tab title="MacOS (M1)" %}
Download `secretcli` for your system [here](https://github.com/scrtlabs/SecretNetwork/releases/download/v1.3.1/secretcli-macOS)

Set the file name to `secretcli` and set it as executable

```
mv secretcli-macOS secretcli
chmod 755 secretcli
```
{% endtab %}
{% endtabs %}

For a more detailed and in-depth guide on SecretCLI installation and usage, check out the [documentation](https://docs.scrt.network/secret-network-documentation/development/secret-cli)

### Install LocalSecret

We recommend using a local chain for development purposes. LocalSecret is a complete Secret Network testnet and ecosystem containerized with Docker. It simplifies the way secret contract developers test their contracts in a sandbox before they deploy them on a testnet or mainnet. If, however, you wish to use a public testnet you can skip this section.

{% hint style="warning" %}
An instance of LocalSecret requires approximately 2.5 GB of RAM to run. You may need to increase the resources available in your Docker settings.
{% endhint %}

{% hint style="warning" %}
The installation methods differ based on the processor architecture. This is because Secret Network makes use of Intel SGX to protect private data.
{% endhint %}

{% tabs %}
{% tab title="x86 (Intel/AMD)" %}
```bash
docker run -it -p 9091:9091 -p 26657:26657 -p 1317:1317 -p 5000:5000 \
  --name localsecret ghcr.io/scrtlabs/localsecret:v1.4.0-cw-v1-beta.2
```

You'll need to configure SecretCLI to work with LocalSecret

```bash
secertcli config node http://localhost:26657
secretcli config chain-id secretdev-1
secretcli config keyring-backend test
secretcli config output json
```
{% endtab %}

{% tab title="ARM (Mac M1)" %}
Unfortunately, even LocalSecret inside a docker cannot be run on an M1 Mac. As a workaround, we recommend using a LocalSecret instance in a Gitpod environment.

This environment is set up in such a way that can be accessed remotely as well.

To get started, simply click [here](https://gitpod.io/#https://github.com/scrtlabs/GitpodDevEnv).

To connect, prepend the port number with the Gitpod URL. e.g., if my workspace is at `https://scrtlabs-gitpoddevenv-shqyv12iyrv.ws-eu54.gitpod.io` then I would be able to connect to the RPC service at `https://26657-scrtlabs-gitpoddevenv-shqyv12iyrv.ws-eu54.gitpod.io`

To set up SecretCLI to connect to this environment, use the following commands

```bash
secertcli config node https://26657-<your-gitpod-workspace>.gitpod.io
secretcli config chain-id secret-testnet-1
secretcli config keyring-backend test
secretcli config output json
```

For more information, check the main repo at [https://github.com/scrtlabs/GitpodLocalSecret](https://github.com/scrtlabs/GitpodLocalSecret)
{% endtab %}
{% endtabs %}
