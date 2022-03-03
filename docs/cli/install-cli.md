# Install the `secretcli` Secret Network light client

1. Get the latest release of `secretcli` for your OS [HERE](https://github.com/scrtlabs/SecretNetwork/releases/latest)

2) Install:

   - Mac/Windows: Rename it from `secretcli-${VERSION}-${OS}` to `secretcli` or `secretcli.exe` and put it in your path
   - Ubuntu/Debian: `sudo dpkg -i secret*.deb`

Note - The home directory for the CLI is now `~/.secretd` due to recent changes in the Cosmos SDK. More info can be found [HERE](https://github.com/scrtlabs/SupernovaDocs/blob/master/app%20developers/cli.md)

3. Configure:

   ```bash
   secretcli config chain-id secret-4
   secretcli config output json
   secretcli config node http://api.scrt.network:26657
   ```

   There are two options for getting your own secret node:

   1. [Rent or use a free-tier node from figment](https://figment.io/datahub/secret-network/)
   2. [Set up your own node](https://docs.scrt.network/node-guides/run-full-node-mainnet.html)

4. Check the installation:

   ```bash
   secretcli status
   ```
