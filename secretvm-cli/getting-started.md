# Getting started

This section will guide you through the installation of `secretvm-cli` and the initial steps to begin using the tool.

## Prerequisites

Before installing `secretvm-cli`, please ensure you have the following:

* **Node.js and npm:** `secretvm-cli` is a Node.js application distributed via npm (Node Package Manager). You'll need Node.js (which includes npm) installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
* **Keplr Wallet:** For authentication using the `auth login` command, you will need to have a Keplr wallet and its address.

## Installation

To install `secretvm-cli` globally on your system, open your terminal or command prompt and run the following npm command:

```bash
npm install -g secretvm-cli
```

This command downloads the package from the npm registry and makes the `secretvm-cli` command available in your system's PATH.

## Verify Installation

After the installation is complete, you can verify that `secretvm-cli` is installed correctly by checking its version:

```bash
secretvm-cli --version
```

This should display the installed version of the CLI (e.g. 0.1.0)

You can also view the list of available commands and global options by running:

```bash
secretvm-cli --help
```
