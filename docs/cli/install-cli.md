# Install Secret CLI

`secretcli` is the Secret Network light client, a command-line interface tool for interacting with nodes running on the Secret Network.

To install it, follow these instructions:

## Download

Get the latest release of `secretcli` for your OS [HERE](https://github.com/scrtlabs/SecretNetwork/releases/latest).

## Install

- Mac/Windows: Rename it from `secretcli-${VERSION}-${OS}` to `secretcli` or `secretcli.exe` and put it in your path
- Ubuntu/Debian: `sudo dpkg -i secret*.deb`

Note - The home directory for the CLI is now `~/.secretd` due to recent changes in the Cosmos SDK. More info can be found [HERE](https://github.com/scrtlabs/SupernovaDocs/blob/master/app%20developers/cli.md).

## Configure

```bash
secretcli config chain-id secret-4
secretcli config output json
secretcli config node http://api.scrt.network:26657
```

There are two options for getting your own secret node:

1.  [Rent or use a free-tier node from figment](https://figment.io/datahub/secret-network/)

    - In the list of provided endpoints, pick a Secret RPC one starting with `secret-4`
    - Add the port `:443` and API key when configuring the URL:

    ```bash
    secretcli config node https://secret-4--rpc--full.datahub.figment.io:443/apikey/abcdefghijklmnopqrstuvwxyz123456789
    ```

2.  [Set up your own node](../node-guides/run-full-node-mainnet.md)

## Check the installation

```bash
secretcli status
```

```json
{
   "NodeInfo": {
      "protocol_version": {
         "p2p": "8",
         "block": "11",
         "app": "0"
      },
      "id": "d023c405ea78c2a99550f8fa5a5d493806c77371",
      "listen_addr": "tcp://xx.xx.xx.xx:26656",
      "network": "secret-4",
...
```

## Shells Completion Scripts

Completion scripts for popular UNIX shell interpreters such as `Bash` and `Zsh`
can be generated through the `completion` command, which is available for both the
`secretd` and `secretcli`.

If you want to generate `Bash` completion scripts run the following command:

```bash
secretd completion > secretd_completion
secretcli completion > secretcli_completion
```

If you want to generate `Zsh` completion scripts run the following command:

```bash
secretd completion --zsh > secretd_completion
secretcli completion --zsh > secretcli_completion
```

::: tip Note
On most UNIX systems, such scripts may be loaded in `.bashrc` or
`.bash_profile` to enable Bash autocompletion:

```bash
echo '. secretd_completion' >> ~/.bashrc
echo '. secretcli_completion' >> ~/.bashrc
```

Refer to the user's manual of your interpreter provided by your
operating system for information on how to enable shell autocompletion.
:::
