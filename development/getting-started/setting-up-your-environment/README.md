---
description: >-
  Environment configuration instructions to get started developing on Secret
  Network.
---

# Setting Up Your Environment

Secret Contracts are written using the [CosmWasm framework](https://book.cosmwasm.com/). CosmWasm contracts are written in Rust, which is later compiled to WebAssembly (or WASM for short). To write our first Secret Contract, we need to set up a development environment with all of the tools required so that you can upload, instantiate, and execute your smart contracts.

{% hint style="info" %}
For a step-by-step Secret Network environment configuration video tutorial, [follow along here](https://www.youtube.com/watch?v=m64c\_3fui3o\&ab\_channel=SecretNetwork) 🎥. Otherwise, continue reading!
{% endhint %}

### Install Requirements

To follow along with the guide, we will be using `git`, `make`, `rust`, and `docker`.

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
Install `git` and `perl` (for Windows):

1. Go to [https://git-scm.com/download/win](https://git-scm.com/download/win) and the download will start automatically. Note that this is a project called Git for Windows, which is separate from Git itself; for more information on it, go to [https://gitforwindows.org](https://gitforwindows.org/).
2. Go to [https://strawberryperl.com](https://strawberryperl.com) and download the recommended version for your system. StrawberryPerl is an open-source Perl environment for Windows; for more information, visit [https://perl.org](https://www.perl.org/get.html#win32). Perl is used to build other dependencies that will be installed later.

**Note:** support for `make` on Windows is limited, so we'll provide separate commands for Windows where necessary
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
Download and run [the Rust .msi installer](https://static.rust-lang.org/dist/rust-1.68.2-x86\_64-pc-windows-msvc.msi)
{% endtab %}
{% endtabs %}

#### Add WASM build target

```
rustup target add wasm32-unknown-unknown
```

{% hint style="warning" %}
**Having Trouble?** You might need to restart your terminal, or run a command like:

_`source "$HOME/.cargo/env"`_

After installing Rust to configure the current shell
{% endhint %}

#### Install Cargo Generate

Cargo generate is the tool you'll use to create a smart contract project. [Learn more about `cargo-generate` here.](https://doc.rust-lang.org/cargo)

```
cargo install cargo-generate --features vendored-openssl
```

#### Install Docker

[Docker](https://docs.docker.com/get-docker/) is an open platform for developing, shipping, and running applications.

#### Install SecretCLI

SecretCLI is a command-line tool that lets us interact with the Secret Network blockchain. It is used to send and query data as well as manage user keys and wallets.

{% tabs %}
{% tab title="Linux" %}
```bash
wget https://github.com/scrtlabs/SecretNetwork/releases/latest/download/secretcli-Linux
chmod +x secretcli-Linux
sudo mv secretcli-Linux /usr/local/bin/secretcli
```
{% endtab %}

{% tab title="Windows (PowerShell)" %}
Run the following commands in Powershell to download the latest version of SecretCLI and add it to your profile's PATH:

```powershell
mkdir "$home\appdata\local\secretcli"
wget -O "$home/appdata/local/secretcli/secretcli.exe" https://github.com/scrtlabs/SecretNetwork/releases/latest/download/secretcli-Windows
$old_path = [Environment]::GetEnvironmentVariable('path', 'user');
$new_path = $old_path + ';' + "$home\appdata\local\secretcli"
[Environment]::SetEnvironmentVariable('path', $new_path,'User');
```

Afterwards, restart the terminal and test the installation with the following command:

```powershell
secretcli version
```
{% endtab %}

{% tab title="MacOS (Intel)" %}
Download `secretcli` for your system [here](https://github.com/scrtlabs/SecretNetwork/releases/download/v1.15.0-beta.15/secretcli-macOS).

Set the file name to `secretcli` and set it as executable

```
mv secretcli-macOS secretcli
chmod 755 secretcli
```
{% endtab %}

{% tab title="MacOS (M1)" %}
Download `secretcli` for your system [here](https://github.com/scrtlabs/SecretNetwork/releases/download/v1.15.0-beta.15/secretcli-MacOS-arm64).

Set the file name to `secretcli` and set it as executable

```
mv secretcli-macOS secretcli
chmod 755 secretcli
```
{% endtab %}
{% endtabs %}

For a more detailed and in-depth guide on SecretCLI installation and usage, check out the [documentation here](https://docs.scrt.network/secret-network-documentation/development/tools-and-libraries/secret-cli/install).

Now it's time to learn how to compile and deploy your first smart contract 🎉

